import crypto from "crypto";
import { redisClient } from "../index.js";

export const generateCSRFToken = async (userId, res) => {
  console.log("generating csrf token")
  const csrfToken = crypto.randomBytes(32).toString("hex");
  const csrfkey = `csrfkey:${userId}`;
  await redisClient.setEx(csrfkey, 3600, csrfToken);
  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    secure: NODE_ENV === "production",
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
  });
  return csrfToken;
};


export const verifyCSRFToken = async (req, res, next) => {
  console.log("verification csrf processing.....")
  try {
    if (req.method === "GET") {
      return next();
    }
    const userId = req.user?._id;
    console.log("user :", req.user);
    console.log(
    `userID : ${userId}`
    )
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const clientToken = req.headers["x-csrf-token"];
    if (!clientToken) {
      console.log("csrf token not found")
      return res.status(403).json({
        message: "CSRF Token missing. Please refresh the page.",
        code: "CSRF_TOKEN_MISSING",
      });
    }
    const csrfkey = `csrfkey:${userId}`;
    const storedToken = await redisClient.get(csrfkey);

    if (!storedToken) {
      console.log("CSRF_TOKEN_EXPIRED, stored Token check failed")
      return res.status(403).json({
        message: "CSRF Token Expired, Please try again",
        code: "CSRF_TOKEN_EXPIRED",
      });
    }

    if (storedToken !== clientToken) {
      console.log("storedtoken != CLIENT TOKEN")
      return res.status(403).json({
        message: "Invalid CSRF Token. Please refresh the page.",
        code: "CSRF_TOKEN_INVALID",
      });
    }
    console.log("csrf verification successfull")
    next();
  } catch (error) {
    console.log("CSRF verification error:", error);
  }
};


export const revokeCSRFTOKEN = async (userId) => {
  const csrfkey = `csrfkey:${userId}`;
  await redisClient.del(csrfkey);
};


export const refreshCSRFToken = async (userId, res) => {
  await revokeCSRFTOKEN(userId);
  return await generateCSRFToken(userId, res);
};
