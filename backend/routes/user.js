import express from "express";
import {TryCaught} from "../middleware/middleware.js";
import { registerUser, verifyUser, loginUser, verifyOtp, myProfile, refreshToken, logoutUser, refreshCSRF,} from "../controllers/controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { verifyRefreshToken } from "../config/generateToken.js";
import { verifyCSRFToken } from "../config/csrfMiddleware.js";

const userRouter = express.Router();
userRouter.post("/register",TryCaught(registerUser))
userRouter.get('/verify/:token',TryCaught(verifyUser))
userRouter.post("/login", TryCaught(loginUser));
userRouter.post("/verify",verifyOtp)
userRouter.get("/me",isAuth,myProfile);
userRouter.post("/refresh",refreshToken);
userRouter.post("/logout",isAuth,verifyCSRFToken, logoutUser);
userRouter.post("/refresh-csrf",verifyRefreshToken, refreshCSRF);


userRouter.get("/", TryCaught((req, res)=>{
 console.log("userRouter working ");
 res.status(200).json({
    message : "get method triggered successfully"
 })
}))

export {
    userRouter
}