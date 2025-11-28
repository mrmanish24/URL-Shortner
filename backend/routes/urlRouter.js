import express from "express";
import { getAnalytics, handlePostUrl, handleRedirectUrl } from "../controllers/urlController.js";
import { isAuth } from "../middleware/isAuth.js";
import { TryCaught } from "../middleware/middleware.js";

export const urlRouter = express.Router()

urlRouter.post("/",isAuth,TryCaught(handlePostUrl));
urlRouter.get("/analytics", isAuth, TryCaught(getAnalytics));
urlRouter.get("/:shortId", TryCaught(handleRedirectUrl));



