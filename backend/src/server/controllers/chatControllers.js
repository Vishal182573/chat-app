import Chat from "../models/chatModel.js";
import User from "../models/userModel.js"
import asyncHandler from "express-async-handler";

const addChat = asyncHandler(async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    if (!userId1 || !userId2) {
      return res.status(400).json({ message: "Bad request" });
    }

    const chat = await Chat.findOne({
      $or: [
        { userId1: userId1, userId2: userId2 },
        { userId1: userId2, userId2: userId1 },
      ],
    });

    if (chat) {
      return res.status(201).json(chat); 
    } else {
      const newChat = new Chat({
        userId1: userId1,
        userId2: userId2,
        messages: [],
      });

      const createdChat = await newChat.save();

      if (!createdChat) {
        return res.status(500).json({ message: "Internal Server Error" });
      } else {
        return res.status(201).json(createdChat);
      }
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



const updateChat = asyncHandler(async (req, res) => {
  try {
    const { userId1, userId2, message } = req.body;
    
    if (!userId1 || !userId2 || !message || message === "") {
      return res.status(400).json({ message: "Bad request" });
    }

    // Find the chat document
    const chat = await Chat.findOne({
      $or: [
        { userId1: userId1, userId2: userId2 },
        { userId1: userId2, userId2: userId1 },
      ],
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Push new message to the messages array
    chat.messages.unshift({
      userId: userId1,
      userId2:userId2,
      message: message,
      seen: false,
    });

    // Save the updated chat document
    const updatedChat = await chat.save();
    if (!updatedChat) {
      return res.status(500).json({ message: "Failed to update chat" });
    }

    return res.status(201).json(updateChat);
  } catch (err) {
    console.error("Error updating chat:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


export { addChat,updateChat };