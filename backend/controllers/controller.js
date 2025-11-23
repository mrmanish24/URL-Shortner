import { array, success } from "zod";
import {registerSchema} from "../config/zod.js";
import { loginSchema } from "../config/zod.js";
import User from "../model/User.js";
import sanitize from "mongo-sanitize";
import { redisClient } from "../index.js";
import crypto, { verify } from "crypto";
import bcrypt from "bcrypt";
import sendMail from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import { TryCaught } from "../middleware/middleware.js";
import { generateAccessToken, generateToken, revokeRefreshToken, verifyRefreshToken } from "../config/generateToken.js";
import { generateCSRFToken } from "../config/csrfMiddleware.js";

//Notes
//NoSQL Injection is an attack where a hacker sends malicious JSON or objects to manipulate MongoDB queries.
// Instead of injecting SQL code, they inject MongoDB operators like:
// { "$gt": "" }
// { "$ne": null }
// { "$or": [...] }
// This can bypass login or return unintended data.

// Data sanitization means cleaning and filtering user input so it cannot harm your database or application.
// It removes or blocks dangerous characters, objects, operators, scripts, etc.
// Examples of sanitization:
// Converting input to string (String(req.body.username))
// Removing MongoDB operators like $gt, $ne, $or
// Stripping HTML/JS (to prevent XSS)
// Validating shape using Zod/Joi


export const registerUser = async (req, res) => {
  console.log("registerUser route called");

  // step 1 : data sanitize
  const sanitizeData = sanitize(req.body);
  // step 2 data validation
  let validation = registerSchema.safeParse(sanitizeData); // throw object if error

  if (!validation.success) {
    let zodError = validation.error;
    return res.status(400).json({
      success: false,
      message: zodError.issues,
    });
  }

  const { name, email, password } = validation.data;

  //step 3: check rate limit
  const rateLimitkey = `register-rate-limit:${res.ip}:${email}`; //key for storing rate limit

  //if rate limit exist this if block will run.
  if (await redisClient.get(rateLimitkey)) {
    return res.status(429).json({                     
      message: "too many attempts try after one minute",
    });
  }

  // step 4: check if user already exist
  const checkUser = await User.findOne({ email });

  if (checkUser) {
    return res.status(400).json({
      message: "user already exist",
    });
  }

  // step 5 : hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // step 6 : create token for 2 step verification
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyKey = `verify:${verifyToken}`;

  // step 7 : create data object in json
  const datatostore = JSON.stringify({
    name,
    email,
    password: hashPassword,
  });

  // step 8 : set verify key and data as key value pair
  await redisClient.set(verifyKey, datatostore, { EX: 300 });

  // step 9 : creating mail for verification
  const subject = "verify you email for account creation";

  //this html will generate a link with token e.g. httt://localhost:5017/token/alksdhjflkasdh
  //creating email layout
  const html = getVerifyEmailHtml({ email, token: verifyToken });
  //step 10 : sending mail and set rate limit for 1 min
  await TryCaught(sendMail({ email, subject, html }));

// set Rate limit
  await redisClient.set(rateLimitkey, "true", { EX: 60 });

  res.status(200).json({
    message: "mail is sent",
  });
};


//verifying and creating user in database

export const verifyUser = async(req,res)=>{
  const { token } = req.params;

  //checking if token is sent by user
  if (!token) {
    console.log("token not found");
    res.status(400).json({
      message: "token is required",
    });
  }

  //creating verifykey with token
  const verifyKey = `verify:${token}`;

  //we get data in json from redis
  const userDataJson = await redisClient.get(verifyKey);

  // if we didnt find userdata that mean user is not in redis, time is over for verifycation or wrong token is sent
  if (!userDataJson) {
    return res.status(400).json({
      message: "wrong token or verification link is expired",
    });
  }

  //if we got data we will delete user in redis
  await redisClient.del(verifyKey);

  // store userdata as object
  const userData = JSON.parse(userDataJson);

  //will create user using mongodb model;

    const newUser = await User.create({
      name : userData.name,
      email : userData.email,
      password: userData.password,
    });
    console.log("user register successfully");

    res.status(201).json({
      success: true,
      message: "user is created successfully",
      user: newUser,
    });
};

// creating User Part complete

//now we will implement login system.

export const loginUser = async (req, res)=>{
  // step 1 : data sanitize
  const sanitizeData = sanitize(req.body);

  // step 2 data validation
  let validation = loginSchema.safeParse(sanitizeData);
  console.log(validation.data);
  if (!validation.success) {
    let zodError = validation.error;
    res.status(400).json({
      success: false,
      message: zodError.issues,
    });
  }
  const { email, password } = validation.data;

  //step 3: check rate limit
  const rateLimitkey = `login-rate-limit:${res.ip}:${email}`;
  if (await redisClient.get(rateLimitkey)) {
    return res.status(429).json({
      message: "too many attempts try after one minute",
    });
  }
//check user exist
  const user = await User.findOne({ email });
  if (!user) {
    console.log("user not found");
    return res.status(400).json({
      message: "invalid credentials",
    });
  }
// compare password
  const comparepassword = bcrypt.compare(password, user.password);
  if (!comparepassword) {
    console.log("password not matched");
    return res.status(400).json({
      message: "invalid credentials",
    });
  }
  // 2 step verification
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, JSON.stringify(otp), {
    EX: 300,
  });

  const subject = "OTP for verification";
  const html = getOtpHtml({ email, otp });

  await sendMail({ email, subject, html });
  await redisClient.set(rateLimitkey, "true", { EX: 60 });

  res.json({
    message:
      "if your email is valid,an otp has been sent, it is valid for 5 min",
  });
};

//otp verification
export const verifyOtp = TryCaught(async (req, res)=>{
  const {email, otp} = req.body;
   if(!email || !otp){
    res.status(400).json({
      message: "all fields are required"
    })
   }

   const otpKey = `otp:${email}`;
   const storedOtpString = await redisClient.get(otpKey);

   if (!storedOtpString){
    return res.status(400).json({
      message : "otp expired"
    })
   }

   const storedOtp =  JSON.parse(storedOtpString);
   if (storedOtp != otp){
    return res.status(400).json({
      message : "invalid otp"
    })
   }

   await redisClient.del(otpKey)

   let user = await User.findOne({email});
   const tokenData = await generateToken(user.id,res);
   console.log("successfully logged-in")
   res.status(200).json({
        message : `welcome ${user.name}`,
        user
   })
});

//fetching user data
export const myProfile = TryCaught((req,res)=>{

  //this api-end point will work when user is already loggedIn (authenticated) mean access token is present in browser 
console.log("myProfile triggered")
  const user = req.user
  res.status(200).json({
    message : `Profile : ${user.name}`,
    user
  }
  )
})


//till now our auth is completed but if accessToken expire we need to generate it again so lets work on it.
export const refreshToken = TryCaught(async(req,res)=>{
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken){
    console.log("message: Invalid refresh token , refreshToken route")
    return res.status(401).json({
      message: "Invalid refresh token"
    })
  }
  const decode = await verifyRefreshToken(refreshToken);
  if(!decode){
    console.log(`message: "Invalid refresh token", verifyRefreshtoken`);
      return res.status(401).json({
        message: "Invalid refresh token",
      });
  }

  generateAccessToken(decode.id,res);
  console.log(`message: "new accesstoken refreshed , refresh token route`,);
  res.status(200).json({
    message: "new accesstoken refreshed"
  })
})

export const logoutUser = TryCaught(async (req,res)=>{
  console.log("logouttriggered")
const userId = req.user.id
res.clearCookie("refreshToken");
res.clearCookie("accessToken");
res.clearCookie("csrfToken");
await redisClient.del(`user:${userId}`);
console.log("logout successfully")
res.json({
  message: "logout successfully"
})
})


export const refreshCSRF = TryCaught(async(req,res)=>{

  const userId = req.user._id
  const newCSRFToken = await generateCSRFToken(userId,res);

  res.json({
    message : "CSRF token refreshed",
    csrfToken : newCSRFToken,
  })

});