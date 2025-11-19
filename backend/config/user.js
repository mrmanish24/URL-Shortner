import mongoose from "mongoose";

const connectDB = async (URL) =>{
    try{
        await mongoose.connect(URL)

        console.log("Database connected successfully")
    }
    catch(err){
        console.log("Error connecting to database",err)

    }
}

export default connectDB;