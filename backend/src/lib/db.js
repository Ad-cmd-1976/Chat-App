import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
const url=process.env.MONGO_URL;
export const connectdb=async ()=>{
    try{
        const conn=await mongoose.connect(url);
        console.log(`Mongodb Connected: ${conn.connection.host}`);
    }
    catch(err){
        console.log(`Mongodb Connection Error: ${err}`);
    }
}