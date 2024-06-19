import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email or Password is missing" });
  const user = await User.findOne({
    email,
    password,
  });
  if (!user) return res.status(404).json({ message: "user not found" });
  else {
    user.status = "Online";
    const updateUser = await user.save();
    if (updateUser) return res.status(201).json(user);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email:email });
    user.status = "Offline";
    const updatedUser = await user.save();
    if (!updatedUser){
      return res.status(500).json({ message: "Internal server Error" });
    }
    return res.status(201).json({message:"Logout Sucessfull"})
  } catch (err) {
    return res.status(500).json({ message: "Inernal server error" });
  }
});

const RegisterUser = asyncHandler(async (req, res) => {
  const { username, email, contactNumber, password, photographUri } = req.body;
  if (!contactNumber || !email || !username || !password || !photographUri)
    return res.status(400).json({ message: "Bad Request" });
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already Exists" });
  const userId = `U-${Math.floor(1000 + Math.random() * 9000)}`;
  const user = new User({
    userId,
    username,
    email,
    contactNumber,
    password,
    photographUri: "V",
    status: "Offline",
    contacts: [],
  });
  const createdUser = await user.save();
  return res.status(201).json(createdUser.userId);
});


const getUsersByPrefix = asyncHandler(async (req, res) => {
  const { prefix } = req.query;

  try {
    let users;
    if (prefix) {
      // Use a regular expression to find users whose username starts with the given prefix
      users = await User.find({
        username: { $regex: "^" + prefix, $options: "i" },
      });
    } else {
      // If no prefix is provided or prefix is an empty string, return all users
      users = await User.find({});
    }
    res.status(201).json(users);
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


const addUserToContact = asyncHandler(async (req, res) => {
  const { userId1, userId2 } = req.body;

  if (!userId1 || !userId2) {
    return res.status(400).json({ message: "userId required" });
  }
  const user1 = await User.findOne({ userId: userId1 });
  const user2 = await User.findOne({ userId: userId2 });

  if (!user1 || !user2) {
    return res.status(404).json({ message: "User not found" });
  }
  const isPresent1 = user1.contacts.includes(userId2);
  const isPresent2 = user2.contacts.includes(userId1);

  if (isPresent1 || isPresent2) {
    return res.status(201).json({ message: "User already in list" });
  } else {
    user1.contacts.push(userId2);
    user2.contacts.push(userId1);
    const updateContactsList1 = await user1.save();
    const updateContactsList2 = await user2.save();
    return res.status(201).json({updateContactsList1,updateContactsList2});
  }
});

const getContacts = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "User id is must" });
  }

  try {
    const user = await User.findOne({ email});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    return res.status(201).json(user.contacts);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

const getUsersByIds = asyncHandler(async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res
        .status(400)
        .json({ message: "Bad request: userIds must be an array of strings" });
    }

    const users = await User.find({ userId: { $in: userIds } });

    return res.status(201).json(users);
  } catch (err) {
    console.error("Error in getUsersByIds controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  if (!req.body || !req.body.email) {
    return res.status(400).json({ message: "Bad request" });
  }

  const { email, username, contactnumber, password, photographUri } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.username = username || user.username;
    user.contactnumber = contactnumber || user.contactnumber;
    user.password = password || user.password; // Make sure to handle password hashing if necessary
    user.photographUri = photographUri || user.photographUri;

    await user.save();

    res.status(201).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export {
  LoginUser,
  RegisterUser,
  getUsersByPrefix,
  addUserToContact,
  getContacts,
  getUsersByIds,
  logoutUser,
  updateUser,
};