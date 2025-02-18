import json from 'jsonwebtoken';
import dotenv from 'dotenv'
export const generatetoken=(userid,res)=>{
    const token=json.sign({userid},process.env.JWT_SECRET,{expiresIn:'7d'});
    res.cookie("jwt",token,{
        maxAge:24*7*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV!=="development"
    })
    return token;
}