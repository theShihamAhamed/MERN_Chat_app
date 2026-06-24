import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import logger from "../lib/logger.js";
import { sendWelcomeEmail } from "../utils/email/emailHandler.js";
import cloudinary from "../lib/cloudinary.js";
import { CLIENT_URLS } from "../lib/config.js";
import { getAuthCookieOptions } from "../utils/authCookie.js";
import { isValidImageDataUrl } from "../utils/validators.js";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    //Normalizing inputs
    const normalizedFullName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email already exists", field: "email" });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      fullName: normalizedFullName,
    });

    const savedUser = await user.save();

    generateTokenAndSetCookie(res, user._id);

    sendWelcomeEmail(savedUser.email, savedUser.fullName, CLIENT_URLS[0]).catch(
      (error) => logger.warn(error, "Welcome email failed")
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    logger.error(error, "Error in signup controller");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Normalizing Email
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid credentials",
          field: "root",
        });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = (_, res) => {
  res.clearCookie("token", getAuthCookieOptions());
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "Profile pic is required" });

    if (!isValidImageDataUrl(profilePic)) {
      return res.status(400).json({
        success: false,
        message: "Profile pic must be a valid PNG, JPG, GIF, or WebP data URL.",
      });
    }

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      resource_type: "image",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    logger.error(error, "Error in update profile controller");
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
