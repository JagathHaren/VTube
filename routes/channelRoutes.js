import express from "express";
import {
  createChannel,
  getChannels,
  getChannelById,
  updateChannel,
  deleteChannel,
   getSubscribers,
   toggleSubscribe,
   getChannelByUserId
} from "../controllers/channelController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

// Public routes
router.get("/", getChannels);
router.get("/:id", getChannelById);

// Protected routes
router.post("/", protect,upload.single("logo"), createChannel);
router.put("/:id", protect, updateChannel);
router.delete("/:id", protect, deleteChannel);


// Subscription routes
router.post("/:id/subscribe", protect, toggleSubscribe);

// Subscribers list
router.get("/:id/subscribers", protect, getSubscribers);

router.get("/user/:userId", getChannelByUserId)

export default router;
