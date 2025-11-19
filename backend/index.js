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
const PORT = process.env.PORT || 9034; 
const URL = process.env.MONGO_URL


const redisUrl = process.env.REDIS_URL;

if(!redisUrl){
  process.exit(1);
}

export const redisClient = createClient({
  url : redisUrl
});

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
app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))
app.use((err, req, res, next) => {
  if (err.code === "ECONNRESET") {
    console.warn("Client aborted the connection");
    return;
  }
  next(err);
});


//routes
app.use("/api/v1",userRouter)

//connect DB
connectDB(URL);

app.use(globalErrorHandler)
app.listen(PORT, ()=>{
    console.log("server is Running ",PORT)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION:", err);
  if (err.code === 'ECONNRESET') {
    console.log('A connection was forcibly closed by a peer. Ignoring...');
  }
});
