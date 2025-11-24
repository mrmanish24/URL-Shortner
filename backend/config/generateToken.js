import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";
import { generateCSRFToken, revokeCSRFTOKEN } from "./csrfMiddleware.js";



export const generateToken = async (id, res) =>{
  //generating accesstoken and refreshtoken
    const accessToken = jwt.sign({id},process.env.JWT_SECRET, {expiresIn : "15m"});
    const refreshToken = jwt.sign({id},process.env.REFRESH_SECRET, {expiresIn :"7d"})
  //refershtoken stored in refreshkey which is userID
   const  refreshKey = `refresh-token-key:${id}`;
   //store refreshkey in redis so we can regenerate accesstoken again
   await redisClient.setEx(refreshKey,7*24*60*60,refreshToken);

   //sending accesstoken and refresh token as cookie in browser
   res.cookie("accessToken", accessToken, {
     httpOnly: true,
     secure: false,
     sameSite: "lax", //get method will work and cookies will be sent eg. login to our site directly using google
     maxAge: 60*15*1000,
   });
 
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24*7*60*60*1000,
      });
      const csrfToken = await generateCSRFToken(id,res);
      return {accessToken,refreshToken, csrfToken };
}


export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const storedToken = await redisClient.get(`refresh-token-key:${decode.id}`);
    if (storedToken === refreshToken) {
      return decode;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const generateAccessToken = (id, res) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
   res.cookie("accessToken", accessToken, {
     httpOnly: true,
     secure: false,
     sameSite: "lax",
     maxAge: 60 * 1000 *15,
   });
};

export const revokeRefreshToken = async (userId) =>{
  await redisClient.del(`refresh-token-key:${userId}`);
  await revokeCSRFTOKEN();
}