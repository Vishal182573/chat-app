import { connect as _connect } from "mongoose";

const connnectDb = async()=>{
    try{
        const connect = await _connect("mongodb+srv://sharmavs9205:ruddo@chat-app.o637uex.mongodb.net/");
        console.log("Db connected",connect.connection.host,connect.connection.name);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default connnectDb;