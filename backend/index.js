import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/user.js";
import { userRouter } from "./routes/user.js";
import { globalErrorHandler, TryCaught } from "./middleware/middleware.js";
import { createClient } from "redis";
import cookieParser from "cookie-parser";
import cors from "cors";



dotenv.config();
const app = express();


//initialize PORTS and URLS
const PORT = process.env.PORT || 9034;
const URL = process.env.MONGO_URL;
const redisUrl = process.env.REDIS_URL;

if(!redisUrl){
  process.exit(1);
}

//redis Client
export const redisClient = createClient({
  url : redisUrl
});

//connect redis
const connectRedis = async () =>{
    try{
      await redisClient.connect()
      console.log("connected to redisclient")
}

catch(error){
  console.log("not able to connect to redisClient")
  throw error
}
}
connectRedis();

//middleware
app.use(express.json()); // parse json data
app.use(express.urlencoded({extended: true})); //parse html form data
app.use(cookieParser());  // to read cookies
//cors
app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))

//error handle middleware (when it takes 4 argument it become error handling middleware)
// if its econnerset error then it will run otherwise pass to next middleware
app.use((err, req, res, next) => {
  if (err.code === "ECONNRESET") {
    console.warn("Client aborted the connection");
    return;
  }
  next(err);
});


//linking routes
app.use("/api/v1",userRouter)

//connect DB
connectDB(URL);

//glboal error handler
app.use(globalErrorHandler)

//running server
app.listen(PORT, ()=>{
    console.log("server is Running ",PORT)
})


//handling silent error
process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION:", err);
  if (err.code === 'ECONNRESET') {
    console.log('A connection was forcibly closed by a peer. Ignoring...');
  }
});
