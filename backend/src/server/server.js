// Import necessary modules
import express, { json } from "express";
import connectDb from "./config/dbconnection.js";
import cors from "cors";
import userKeRoutes from "./routes/userRoutes.js";
import chatKeRoutes from "./routes/chatRoutes.js";
import uploadKeRoutes from './routes/uploadRoutes.js';
import {FRONTEND_URL} from "./constants.js"

// Import Socket.IO
import http from "http";
import { Server } from "socket.io";

// Connect to MongoDB
connectDb();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Set up JSON middleware
app.use(json());
app.use(express.urlencoded({ extended: true }));


// Enable CORS
app.use(
  cors({
    origin: `${FRONTEND_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Use routes
app.use("/api/user", userKeRoutes);
app.use("/api/chat", chatKeRoutes);
app.use("/api/image",uploadKeRoutes);
app.get("/",(req,res)=>{
  res.send("server is working");
})

// Set up Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${FRONTEND_URL}`, // Update to your client URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO event handling
io.on("connection", (socket) => {
  // console.log("A user connected");

  // Example: Handle chat messages
  socket.on("chat message", (msg) => {
    // Broadcast message to all clients
    io.emit("chat message", msg);
  });
  
  socket.on('typing', (data) => {
    io.emit('typing', data);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});