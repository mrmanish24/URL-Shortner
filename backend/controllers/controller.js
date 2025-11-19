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

export const registerUser = async (req, res) => {
  console.log("registerUser route called");

  // step 1 : data sanitize
  const sanitizeData = sanitize(req.body);
  // step 2 data validation
  let validation = registerSchema.safeParse(sanitizeData);

  if (!validation.success) {
    let zodError = validation.error;
    return res.status(400).json({
      success: false,
      message: zodError.issues,
    });
  }
  const { name, email, password } = validation.data;

  //step 3: check rate limit
  const rateLimitkey = `register-rate-limit:${res.ip}:${email}`;

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
  const html = getVerifyEmailHtml({ email, token: verifyToken });
  //step 10 : sending mail and set rate limit for 1 min
  await sendMail({ email, subject, html });
  await redisClient.set(rateLimitkey, "true", { EX: 60 });

  res.status(200).json({
    message: "mail is sent",
  });
};


export const verifyUser = async(req,res)=>{
  const { token } = req.params;
    console.log("this is token:", token)
  if (!token) {
    console.log("token not found");
    res.status(400).json({
      message: "token is required",
    });
  }

  const verifyKey = `verify:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  console.log(userDataJson)
  if (!userDataJson) {
    return res.status(400).json({
      message: "wrong token or verification link is expired",
    });
  }
  await redisClient.del(verifyKey);
  const userData = JSON.parse(userDataJson);

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


export const loginUser = async (req, res)=>{
  // step 1 : data sanitize
  const sanitizeData = sanitize(req.body);
  let validation = loginSchema.safeParse(sanitizeData);
  console.log(validation.data)
  // step 2 data validation
  if (!validation.success) {
    let zodError = validation.error;
    res.status(400).json({
      success: false,
      message: zodError.issues,
    });
  }
  const {email, password } = validation.data;

  //step 3: check rate limit
  const rateLimitkey = `login-rate-limit:${res.ip}:${email}`;

  if (await redisClient.get(rateLimitkey)) {
   return res.status(429).json({
      message: "too many attempts try after one minute",
    });
  }

  const user = await User.findOne({email});

  if(!user){
    console.log("user not found");
    return res.status(400).json({
      message : "invalid credentials"
    })
  }

  const comparepassword = bcrypt.compare(password,user.password)
  
  if(!comparepassword){
    console.log("password not matched")

    return res.status(400).json({
      message : "invalid credentials"
    })
  }
// 2 step verification
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey,JSON.stringify(otp),{
    EX:300
  })

  const subject = "OTP for verification";
  const html = getOtpHtml({email,otp});

  await sendMail({email,subject,html});
  await redisClient.set(rateLimitkey, "true",{EX:60});

  res.json({
    message: "if your email is valid,an otp has been sent, it is valid for 5 min"
  })
};

export const verifyOtp = TryCaught(async (req, res)=>{
  const {email, otp} = req.body;

  console.log(email, otp)
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

export const myProfile = TryCaught((req,res)=>{
console.log("myProfile triggered")
  const user = req.user
  console.log(req.cookies)
  res.status(200).json({
    message : `Profile : ${user.name}`,
    user
  }
  )
})


export const refreshToken = TryCaught(async(req,res)=>{
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(401).json({
      message: "Invalid refresh token"
    })
  }

  const decode = await verifyRefreshToken(refreshToken);
  if(!decode){
      return res.status(401).json({
        message: "Invalid refresh token",
      });
  }

  generateAccessToken(decode.id,res);
  res.status(200).json({
    message: "new accesstoken refreshed"
  })
})  



export const logoutUser = TryCaught(async (req,res)=>{
  console.log("logouttriggered")
const userId = req.user.id
await revokeRefreshToken(userId);

res.clearCookie("refreshToken");
res.clearCookie("accessToken");

await redisClient.del(`user:${userId}`);

res.json({
  message: "logout successfully"
})

})