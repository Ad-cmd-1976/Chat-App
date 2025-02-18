import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserModel from '../models/user.model.js';
dotenv.config();
export const protectedRoute=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(400).json({message:'Unauthorized- token required'});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:'Unauthorized - token invalid'});
        }
        // console.log(decoded);
        const user=await UserModel.findById(decoded.userid).select("-password");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        req.user=user;
        next();
    }
    catch(error){
        console.log("Error in protectedRoute middleware");
        return res.status(500).json({message:'Internal Server Error'});
    }
}