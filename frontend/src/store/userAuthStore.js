import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';
import io from 'socket.io-client'

const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:8080":"/";

export const userAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    socket:null,

    isCheckingAuth:true,

    onlineUsers:[],

    checkAuth:async()=>{
        try{
            const res=await axiosInstance.get('/auth/check');
            set({authUser:res.data});
            get().connectSocket();
        }
        catch(error){
            console.log("Error in checkAuth function",error.message);
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
    
    signup:async (formData)=>{
        set({isSigningUp:true});
        try{
            const res=await axiosInstance.post('/auth/signup',formData);
            set({authUser:res.data});
            toast.success("Account Created Successfully!");
            get().connectSocket();
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isSigningUp:false});
        }
    },
    
    login:async (formData)=>{
        set({isLoggingIn:true});
        try{
            const res=await axiosInstance.post('/auth/login',formData);
            set({authUser:res.data});
            toast.success("Logged in Successfully!");
            get().connectSocket();
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isLoggingIn:false});
        }
    },
    
    logout:async ()=>{
        try{
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success("Logged Out Successfully!");
            get().disconnectSocket();
        }
        catch(error){
            toast.error(error.response.data.message);
        }
    },
    
    updateProfile:async (data)=>{
        set({isUpdatingProfile:true});
        try{
            const res=await axiosInstance.put('/auth/update-profile',data);
            set({authUser:res.data});
            toast.success("Profile Updated Successfully!");
        }
        catch(error){
            console.log("Error in updateProfile function");
            toast.error(error.response.data.message);
        }
        finally{
            set({isUpdatingProfile:false})
        }
    },
    
    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || (get().socket && get().socket.connected)) return;

        const newSocket = io(BASE_URL, {
            query:{
                userId:authUser?._id,
            },
            withCredentials: true, // Ensure cookies are sent if needed
            transports: ["websocket"], // Ensure better compatibility
        });

        newSocket.on("getOnlineUsers",(userIds)=>{
            console.log("Received online users:", userIds);
            set({onlineUsers:userIds});
        })

        set({ socket: newSocket });
    },

    disconnectSocket:()=>{
        const {socket}=get();
        if(socket){
            socket.disconnect();
            set({socket:null});
        }
    },
}))