import express from "express";
import { addComment, getComments, updateComment, deleteComment } from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Comments on videos
router.post("/:videoId", protect, addComment);
router.get("/:videoId", getComments);
router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);


export default router;
