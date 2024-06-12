import Chat from "../models/chatModel.js"
import asyncHandler from "express-async-handler"

const addChat = asyncHandler(async (req, res) => {
    try {
        const { userId1, userId2 } = req.body;
        if (!userId1 || !userId2) {
            return res.status(400).json({ message: "Bad request" });
        }
        // Search for chat document where userId1 and userId2 can be in either order
        const chat = await Chat.findOne({
            userId1:userId1,
            userId2:userId2,
        });
        if (!chat) {
            // Create new chat if not found
            const newChat = new Chat({
                userId1: userId1,
                userId2: userId2,
                messages: [{
                    userId: userId1,
                    message: "Hello",
                    seen: false,
                }],
            });

            Createdchat = await newChat.save();
            if (!Createdchat) {
                return res.status(500).json({ message: "Internal Server Error" });
            }else{
                return res.status(201).json(Createdchat.messages);
            }
        }
        return res.status(201).json(chat.messages);
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export {
    addChat,
}