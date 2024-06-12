import asyncHandler from "express-async-handler";
import User from "../models/userModel.js"


const LoginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({message:"Email or Password is missing"});
    const user = await User.findOne({
        email,
        password,
    });
    if(!user) return res.status(404).json({message:"user not found"});
    else{
    user.status="Online";
    const updateUser = await user.save();
    req.session.user = {email: user.email};
    if(updateUser)  return res.status(201).json(user); 
    }
});

const logoutUser = asyncHandler(async(req,res)=>{
    req.session.destroy(err => {
      if (err) {
          return res.status(500).send('Unable to logout');
      }
      return res.status(201).json({message:'Logged out successfully'});
  });
})

const RegisterUser = asyncHandler(async(req,res)=>{
    const {username,email,contactNumber,password,photographUri} = req.body;
    if(!contactNumber || !email || !username || !password || !photographUri) return res.status(400).json({message:"Bad Request"});
    const userExists =await User.findOne({email});
    if(userExists) return res.status(400).json({message:"User already Exists"});
    const userId = `U-${Math.floor(1000 + Math.random() * 9000)}`;
    const user = new User({
        userId,
        username,
        email,
        contactNumber,
        password,
        photographUri:"V",
        status:"Offline",
        contacts:[],
    })
    const createdUser = await user.save();
    return res.status(201).json(createdUser.userId);
});

const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find({});
    res.status(201).json(users);
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    const user = await User.findOne({
      email,
    });
  
    if (user) {
      return res.status(201).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
});

const getUsersByPrefix = asyncHandler(async (req, res) => {
  const { prefix } = req.query;

  try {
      let users;
      if (prefix) {
          // Use a regular expression to find users whose username starts with the given prefix
          users = await User.find({ username: { $regex: '^' + prefix, $options: 'i' } });
      } else {
          // If no prefix is provided or prefix is an empty string, return all users
          users = await User.find({});
      }
      res.status(201).json(users);
  } catch (error) {
      // Handle any errors that occur during the database query
      res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

const getUserEmail = asyncHandler(async(req,res)=>{
  res.status(201).send(req.session.user);
})

const addUserToContact = asyncHandler(async(req,res)=>{
  const {userId1,userId2} = req.body;

  if(!userId1 || !userId2){
    return res.status(400).json({message:"userId required"});
  }
  const user = await User.findOne({userId:userId1});

  if(!user){
    return res.status(404).json({message:"User not found"});
  }
  const isPresent = user.contacts.includes(userId2);

  if(isPresent){
    return res.status(201).json({message:"User already in list"});
  }else {
    user.contacts.push(userId2);
    const updateContactsList = await user.save();
    return res.status(201).json(updateContactsList);
  }
})

const getContacts = asyncHandler(async(req,res)=>{
  const {userId} = req.query;

  if(!userId){
    return res.status(400).json({message:"User id is must"});
  }

  try {
    const user = await User.findOne({ userId });

    if(!user){
      return res.status(404).json({message:"User not found"});
    } else {
      const contacts = await User.find({ userId: { $in: user.contacts } });

      return res.status(201).json({contacts:contacts});
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const getUsersByIds = asyncHandler(async (req, res) => {
  try {
      const { userIds } = req.body;

      if (!userIds || !Array.isArray(userIds)) {
          return res.status(400).json({ message: "Bad request: userIds must be an array of strings" });
      }

      const users = await User.find({ userId: { $in: userIds } });

      return res.status(201).json(users);
  } catch (err) {
      console.error("Error in getUsersByIds controller:", err);
      return res.status(500).json({ message: "Internal Server Error" });
  }
});


export {
    LoginUser,
    RegisterUser,
    getAllUsers,
    getCurrentUser,
    getUsersByPrefix,
    getUserEmail,
    addUserToContact,
    getContacts,
    getUsersByIds,
    logoutUser,
};