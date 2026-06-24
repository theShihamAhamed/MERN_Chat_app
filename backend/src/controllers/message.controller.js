import cloudinary from "../lib/cloudinary.js";
import logger from "../lib/logger.js";
import { getReceiverSocketIds, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import {
  isValidImageDataUrl,
  isValidObjectId,
  normalizeMessageText,
} from "../utils/validators.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    })
      .select("-password")
      .lean();
    res.status(200).json({ success: true, filteredUsers });
  } catch (error) {
    logger.error(error, "Error in getAllContacts controller");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { id: userToChatId } = req.params;

    if (!isValidObjectId(userToChatId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid receiver id." });
    }

    const receiverExists = await User.exists({ _id: userToChatId });
    if (!receiverExists) {
      return res
        .status(404)
        .json({ success: false, message: "Receiver not found." });
    }

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: loggedInUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({ success: true, messages });
  } catch (error) {
    logger.error(error, "Error in getMessagesByUserId controller");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const normalizedText = normalizeMessageText(text);

    if (!isValidObjectId(receiverId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid receiver id." });
    }

    if (normalizedText === null) {
      return res
        .status(400)
        .json({ success: false, message: "Message text must be a string." });
    }

    if (normalizedText.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message text must be 2000 characters or less.",
      });
    }

    if (image && !isValidImageDataUrl(image)) {
      return res.status(400).json({
        success: false,
        message: "Image must be a valid PNG, JPG, GIF, or WebP data URL.",
      });
    }

    if (!normalizedText && !image) {
      return res
        .status(400)
        .json({ success: false, message: "Text or image is required." });
    }

    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res
        .status(404)
        .json({ success: false, message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        resource_type: "image",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const message = new Message({
      senderId,
      receiverId,
      text: normalizedText,
      image: imageUrl,
    });

    const newMessage = await message.save();

    const receiverSocketIds = getReceiverSocketIds(receiverId);

    if (receiverSocketIds.length) {
      io.to(receiverSocketIds).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    logger.error(error, "Error in getMessagesByUserId controller");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const chatPartners = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          partnerId: {
            $cond: [
              { $eq: ["$senderId", loggedInUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          latestMessage: {
            _id: "$_id",
            text: "$text",
            image: "$image",
            senderId: "$senderId",
            receiverId: "$receiverId",
            createdAt: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: "$partnerId",
          latestMessage: { $first: "$latestMessage" },
        },
      },
      {
        $sort: { "latestMessage.createdAt": -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$user._id",
          email: "$user.email",
          fullName: "$user.fullName",
          profilePic: "$user.profilePic",
          createdAt: "$user.createdAt",
          updatedAt: "$user.updatedAt",
          latestMessage: 1,
          latestMessageText: "$latestMessage.text",
          latestMessageImage: "$latestMessage.image",
          latestMessageAt: "$latestMessage.createdAt",
          latestMessageSenderId: "$latestMessage.senderId",
          unreadCount: { $literal: 0 },
        },
      },
    ]);

    res.status(200).json({ success: true, chatPartners });
  } catch (error) {
    logger.error(error, "Error in getChatPartners controller");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
