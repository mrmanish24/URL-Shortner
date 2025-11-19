import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";


export const generateToken = async (id, res) =>{
    const accessToken = jwt.sign({id},process.env.JWT_SECRET, {expiresIn : "1m"});
    const refreshToken = jwt.sign({id},process.env.REFRESH_SECRET, {expiresIn :"7d"})

   const  refreshKey = `refresh-token-key:${id}`;

   await redisClient.setEx(refreshKey,7*24*60*60,refreshToken);

   res.cookie("accessToken", accessToken, {
     httpOnly: true,
     secure: false,
     sameSite: "lax",
     maxAge: 60*1000,
   });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24*7*60*60*1000,
      });


      return {accessToken,refreshToken };
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
}

