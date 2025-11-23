import crypto from "crypto";
import { redisClient } from "../index.js";

export const generateCSRFToken = async (userId, res) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  const csrfKey = `csrfkey:${userId}`;
  await redisClient.setEx(csrfKey, 3600, csrfToken);

  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  return csrfToken;
};



export const verifyCSRFToken = async (req, res, next) => {
  try {
    if (req.method === "GET") {
      return next();
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }
    const clientToken = req.headers["x-csrf-token"];
    if (!clientToken) {
      return res.status(403).json({
        message: "CSRF Token missing. Please refresh the page.",
        code: "CSRF_TOKEN_MISSING",
      });
    }

    const csrfkey = `csrfkey:${userId}`;
    const storedToken = await redisClient.get(csrfkey);

    if (!storedToken) {
      return res.status(403).json({
        message: "CSRF Token Expired, Please try again",
        code: "CSRF_TOKEN_EXPIRED",
      });
    }
    if (storedToken !== clientToken) {

      return res.status(403).json({
        message: "Invalid CSRF Token. Please refresh the page.",
        code: "CSRF_TOKEN_INVALID",
      });
    }
    next();
  } catch (error) {
    console.log("CSRF verification error:", error);
  }
};

export const revokeCSRFTOKEN = async (userId) => {
  const csrfKey = `csrfkey:${userId}`;
  await redisClient.del(csrfKey);
};



export const refreshCSRFToken = async (userId, res) => {
  await revokeCSRFTOKEN(userId);
  return await generateCSRFToken(userId, res);
};


