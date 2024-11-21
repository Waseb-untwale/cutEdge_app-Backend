const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already exists" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters long" });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });
      await newUser.save();
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        sameSite: "strict", 
      });

      res.status(201).json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;    
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }     
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid password" });
      }
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        sameSite: "strict",
      });

      res.status(200).json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updatePassword: async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
      const user = await Users.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Old password is incorrect" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: "New passwords do not match" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();
      res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = await Users.findById(req.user.id); 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user profile with new name and email
      const updatedUser = await Users.findByIdAndUpdate(
        req.user.id,
        { name, email },
        { new: true }
      );
  
      res.status(200).json({ message: "Profile updated successfully", updatedUser });
      console.log("Profile updated successfully");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating profile" });
    }
  },
  
  getProfile: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Error fetching user profile" });
    }
  },

  getProfileById: async(req,res)=>{

    try{
      const userId = req.params.id;
      const user = await Users.findById(userId)
      if(!user){
        return res.status(404).json({msg:"User not found"})
      }
      res.json(user)
    }
    catch(err){
      console.error(err.message)
      res.status(500).json({msg:"Server Error"})
    }
  },

  logout: async(req,res)=>{
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Log Out" });
    } catch (err) {}
  }

};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d", 
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", 
  });
};

module.exports = userCtrl;
