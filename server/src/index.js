import express from "express"
import connnectDb from "../config/dbconnection.js";

connnectDb();
const app = express();
const port = 3000;

app.get("/",(req,res)=>{
    res.send("Server is running");
})

app.listen(port,()=>{
    console.log("Server is runnig");
})