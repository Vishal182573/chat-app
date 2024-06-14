import { model,Schema } from "mongoose";

// Define the message schema
const messageSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  userId2:{
    type:String,
    required:true,
  },
  message: {
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  },
});

// Define the main schema
const chatSchema = new Schema({
  userId1: {
    type: String,
    required: true,
  },
  userId2: {
    type: String,
    required: true,
  },
  messages: [messageSchema]
});

// Create the model
const Chat = model('Chat', chatSchema);
export default Chat;
