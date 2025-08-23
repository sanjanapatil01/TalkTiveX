import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudanary.js";
import {io,userSocketMap} from "../server.js";


//get all user
export const getUserForSidebar = async (req, res) => {
    try {
        const userID=req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userID } }).select("-password");

        //count number mesg not seen
        const unseenMessages={}
        const promise=filteredUsers.map(async (user) => {
            const unseenCount = await Message.find({senderID: userID, receiverId: user._id, seen: false});
            if(unseenCount.length>0){
                unseenMessages[user._id] = unseenCount.length;
            }
        })
        await Promise.all(promise);
        res.json({success: true, users: filteredUsers, unseenMessages});
    } catch (error) {
        console.error("Error fetching users:", error);
        res.json({ success: false, message:error.message });
    }
}
//get all for selected user
export const getMessages = async (req, res) => {
    try{
        const{id:selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId}, { seen: true } 
        );
        res.json({ success: true, messages });

    }catch (error) {
        console.error("Error fetching messages:", error);
        res.json({ success: false, message: error.message });
    }
}
//api to mark message as seen
export const markMessageAsSeen = async (req, res) => {
    try{
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true, message: "Message marked as seen" });

    }catch (error) {
        console.error("Error marking message as seen:", error);
        res.json({ success: false, message: error.message });
    }

}
//send message to slected user
export const sendMessage = async (req, res) => {
    try{
        const {text,image}=req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage=await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl 
        });

        //emit message to receiver
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.json({ success: true,newMessage });


    }catch (error) {
        console.error("Error sending message:", error);
        res.json({ success: false, message: error.message });
    }
}

