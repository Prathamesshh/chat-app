import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersforSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getUsersforSidebar controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId:myId,          receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; 
    
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}