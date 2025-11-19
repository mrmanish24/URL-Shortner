import jwt  from "jsonwebtoken";
import { redisClient } from "../index.js";
import User from "../model/User.js";


export const isAuth = async (req,res,next) =>{
try{
    const token = req.cookies.accessToken;

    if(!token){
        return res.status(403).json({
            message : "please login, no token found"
        })
    }

    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if(!decodedData){
        return res.status(400).json({
            message: "token is expried"
        })
    }
    const cacheUser = await redisClient.get(`user:${decodedData.id}`);

    if(cacheUser){
        req.user = JSON.parse(cacheUser);
        return next();
    }

    const user = await User.findById(decodedData.id).select("-password");
    if (!user){
        return res.status(400).json({
            message: "no user with this id"
        })

    }
    await redisClient.setEx(`user:${user.id}`,3600, JSON.stringify(user));

    req.user = user;
    next();

}
catch(err)
{
    res.status(500).json(
        {
            message: err.message
        }
    )
}
}