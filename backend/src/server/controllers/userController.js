import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email or Password is missing" });
    const user = await User.findOne({
      email,
    });
    if (!user) return res.status(404).json({ message: "user not found" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Create and return JWT
    const payload = {
      email: user.email,
    };
    user.status = "Online";
    await user.save();
    jwt.sign(
      payload,
      "U2FsdGVkX1+gvqvXLk8VcSx7+xHJbbEX3uQyEzzRfKM=",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const RegisterUser = asyncHandler(async (req, res) => {
  const { username, email, contactNumber, password, photographUri } = req.body;
  
  if (!contactNumber || !email || !username || !password || !photographUri) {
    return res.status(400).json({ message: "Bad Request" });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Generate a userId (example: U-1234)
  const userId = `U-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password,10);

    // Create new user with hashed password
    const user = new User({
      userId,
      username,
      email,
      contactNumber,
      password: hashedPassword, // Store hashed password
      photographUri,
      status: "Offline",
      contacts: [],
    });

    // Save user to database
    const createdUser = await user.save();

    // Respond with userId (or any other relevant response)
    return res.status(201).json(createdUser.userId);
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
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
    return res.status(201).json({ updateContactsList1, updateContactsList2 });
  }
});

const getContacts = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User id is must" });
  }

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const contacts = await User.find({ userId: { $in: user.contacts } });

      return res.status(201).json({ contacts: contacts });
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
