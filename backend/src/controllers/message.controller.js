import cloudinary from "../lib/cloudinary.js";
import logger from "../lib/logger.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

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

    if (!text && !image) {
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
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const newMessage = await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
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

    const partners = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        },
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
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: "$partnerId",
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      {
        $sort: { lastMessageAt: -1 },
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
          password: 0,
          "user.password": 0,
        },
      },
    ]);

    const chatPartners = partners.map((p) => p.user);

    res.status(200).json({ success: true, chatPartners });
  } catch (error) {
    logger.error(error, "Error in getChatPartners controller");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
