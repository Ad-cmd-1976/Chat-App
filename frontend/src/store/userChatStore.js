import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import { userAuthStore } from "./userAuthStore";

export const userChatStore=create((set,get)=>({
    users:[],
    messages:[],
    selectedUser:null,
    isMessagesLoading:false,
    isUsersLoading:false,

    getUsers:async ()=>{
        set({isUsersLoading:true});
        try{
            const res=await axiosInstance.get('/message/users');
            set({users:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isUsersLoading:false});
        }
    },

    getMessages: async (user_id)=>{
        set({isMessagesLoading:true});
        try{
            const res=await axiosInstance.get(`/message/${user_id}`);
            set({messages:res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage:async (messageData)=>{
        const {selectedUser,messages}=get();
        try{
            const res=await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});
        }
        catch(error){
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages:()=>{
        const {selectedUser}=get();
        if(!selectedUser) return;
        const socket=userAuthStore.getState().socket;

        // todo : optimize this one
        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId!==selectedUser._id) return;
            set({messages:[...get().messages,newMessage]});
        })
    },

    unsubscribeFromMessages:()=>{
        const socket = userAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setselectedUser:(selectedUser)=>set({selectedUser})
}))