import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// router.use(arcjetProtection);

router.post("/send/:id", verifyToken, sendMessage);

router.get("/contacts", verifyToken, getAllContacts);
router.get("/chats", verifyToken, getChatPartners);
router.get("/:id", verifyToken, getMessagesByUserId);

export default router;
