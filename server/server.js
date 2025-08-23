import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import {connectDB} from "./lib/db.js";
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*"}
    })

export const userSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("User disconnected:", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
     
    
})



//midleware
app.use(express.json({limit: '4mb'}));
// ✅ IMPROVED CORS
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], 
    credentials: true
}));

app.use("/api/status",(req, res) => res.send("Server is running!"));
app.use("/api/auth",userRouter);
app.use("/api/messages", messageRouter);

//Mongodb

await connectDB();

if(process.env.NODE_ENV !== "production"){
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});}

export default server;
