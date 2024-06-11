// import {Server} from "socket.io"
// import http from "http"
import express,{json} from "express"
import connnectDb from "./config/dbconnection.js";
import cors from "cors"
import userKeRoutes from "./routes/userRoutes.js"
import session from "express-session"
import MongoStore from "connect-mongo"


connnectDb();
const app = express();
const port = 3001;

app.use(json());
app.use(session({
    secret: 'U2FsdGVkX1+gvqvXLk8VcSx7+xHJbbEX3uQyEzzRfKM=', // Change this to a strong, unique key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://sharmavs9205:ruddo@chat-app.o637uex.mongodb.net/' }),
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true,
    allowedHeaders: ["Content-Type", "Authorization"],
}))

// const server = http.createServer(app); 
// const io = new Server(server);

//socket.io routes 
// io.on('connection',(socket)=>{
//      console.log("A new user connected",socket.id);
// });
// the routes below are handling the http requests but for handling socket.io requests we use socket.io

app.use('/api/user',userKeRoutes);
app.get("/",(req,res)=>{
    res.send("Server is running");
})

app.listen(port,()=>{
    console.log("Server is runnig");
})