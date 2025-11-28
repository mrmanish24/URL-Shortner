import jwt  from "jsonwebtoken";
import { redisClient } from "../index.js";
import User from "../model/User.js";

//Auth middleware
export const isAuth = async (req,res,next) =>{
    console.log("auth check is triggered");
    
try{
    //checking if user is loggedin  mean have accessotken
    const token = req.cookies.accessToken;
    if(!token){
        console.log("token not found")
        return res.status(403).json({
            code : "NO_TOKEN_FOUND",
            message : "please login, no token found"
        });
    }
    //decoding accesstoken = userId
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if(!decodedData){
        return res.status(400).json({
            code : "TOKEN_IS_EXPIRE",
            message: "token is expried"
        })
    }
    //if user is already cache send user to the myprofile or whereevery needed
    const cacheUser = await redisClient.get(`user:${decodedData.id}`);
    if(cacheUser){
        req.user = JSON.parse(cacheUser);
        console.log(`user from redis: ${cacheUser}`)
        console.log("auth successfull")
        return next();
    }
    
    //if user is not cached then fetch from DB then store in redis then send user to next.
    const user = await User.findById(decodedData.id).select("-password");
    if (!user){
        return res.status(400).json({
            message: "no user with this id"
        })
    }
    await redisClient.setEx(`user:${user.id}`,3600, JSON.stringify(user));
    req.user = user;
    console.log("auth check success");
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

export const authorizedAdmin = async (req,res,next) =>{
    const user = req.user;

    if(user.role != "admin"){
        return res.status(401).json({
            message : "you are not allowed for this activity",
        })
    }
    console.log("admin check successfull")
    next();
}