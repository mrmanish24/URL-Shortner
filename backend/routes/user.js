import express from "express";
import {TryCaught} from "../middleware/middleware.js";
import { registerUser, verifyUser, loginUser, verifyOtp, myProfile, refreshToken, logoutUser, refreshCSRF, adminController,} from "../controllers/controller.js";
import { authorizedAdmin, isAuth } from "../middleware/isAuth.js";
import { verifyRefreshToken } from "../config/generateToken.js";
import { verifyCSRFToken } from "../config/csrfMiddleware.js";
import { getAnalytics } from "../controllers/urlController.js";

const userRouter = express.Router();
userRouter.post("/register",TryCaught(registerUser));
userRouter.get('/verify/:token',TryCaught(verifyUser));
userRouter.post("/login", TryCaught(loginUser));
userRouter.post("/verify",verifyOtp);
userRouter.get("/me",isAuth,myProfile);
userRouter.post("/refresh",refreshToken);
userRouter.post("/logout",isAuth,verifyCSRFToken, TryCaught(logoutUser));
userRouter.post("/refresh-csrf",isAuth,refreshCSRF);
userRouter.get("/admin",isAuth, authorizedAdmin,TryCaught(adminController));


userRouter.get("/", TryCaught((req, res)=>{
 console.log("userRouter working ");
 res.status(200).json({
    message : "get method triggered successfully"
 });
}));

export {
    userRouter
}