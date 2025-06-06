import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { connectdb } from './lib/db.js';
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import cors from 'cors'
import {app,server} from './lib/socket.js'
import path from 'path';
dotenv.config();

const port=process.env.PORT || 8080;
const __dirname=path.resolve();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/api/auth',authRoute);
app.use('/api/message',messageRoute);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}


server.listen(port,()=>{
    console.log(`Listening at port ${port}`);
    connectdb();
})