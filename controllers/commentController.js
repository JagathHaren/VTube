import Comment from "../models/commentModel.js";
import Video from "../models/videoModel.js";

// @desc Add a comment to a video
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const videoId = req.params.videoId;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = new Comment({
      text,
      user: req.user.id,
      video: videoId
    });

    await comment.save();
    res.status(201).json({ message: "Comment added ✅", comment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// @desc Get all comments for a video
export const getComments = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const comments = await Comment.find({ video: videoId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

// @desc Update a comment (only comment owner)
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    res.json({ message: "Comment updated ✅", comment });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

// @desc Delete a comment (only comment owner)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};
