import UserModel from "../models/user.model.js";
import MessageModel from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar= async (req,res)=>{
    try{
        const loggedInUserId=req.user._id;
        const filteredUsers=await UserModel.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("Error in getUsersForSidebar controller",error.message);
        res.status(500).json({message:'Internal Server Error'});
    }
}

export const getMessages= async (req,res)=>{
    try{
        const {id:userToChatId}=req.params;
        const loggedInUserId=req.user._id;
        // console.log(userToChatId.slice(1),loggedInUserId);
        const message=await MessageModel.find({
            $or:[
                {senderId:loggedInUserId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:loggedInUserId}
            ]
        })
        // console.log(message);
        res.status(200).json(message);
    }
    catch(error){
        console.log("Error in getUsersForSidebar getMessages controller",error.message);
        res.status(500).json({error:'Internal Server Error'});
    }
}

export const sendMessage=async (req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new MessageModel({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image:imageUrl
        });
        await newMessage.save();
        // todo: realtime using socket.io
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller from getUsersForSideBar.controller.js",error.message);
        res.status(400).json({error:'Internal Server Error'});
    }
}