import { Schema, model } from "mongoose";
const userSchema = new Schema({
  userId: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  contactnumber: {
    type: String,
  },
  password: {
    type: String,
  },
  photographUri: {
    type: String,
  },
  status:{
    type:String,
  },
  contacts:{
    type:Array,
  },
},{timestamps:true});
export default model("User", userSchema);
