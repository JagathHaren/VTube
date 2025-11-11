import Video from "../models/videoModel.js";
import { uploadToCloudinary } from "../utils/uploadCloudinary.js";
// @desc Upload a new video
export const createVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({ message: "Video and thumbnail are required" });
    }
    // Upload thumbnail (image)
    const thumbnailUpload = await uploadToCloudinary(
      req.files.thumbnail[0].buffer,
      "thumbnails",
      "image"
    );

    // Upload video
    const videoUpload = await uploadToCloudinary(
      req.files.video[0].buffer,
      "videos",
      "video"
    );

    const video = new Video({
      title,
      description,
      url: videoUpload.secure_url,
      thumbnail: thumbnailUpload.secure_url,
      channel: req.channel._id, // from middleware
    });

    await video.save();
    res.status(201).json({ message: "Video uploaded ✅", video });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video", error: error.message });
  }
};


// @desc Get all videos (with counts)
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("channel", "name owner subscribers logo")
      .sort({ createdAt: -1 });

    const formatted = videos.map(video => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      channel: video.channel,
      category: video.category,
      views: video.views,
      subscribersCount: video.channel?.subscribers?.length || 0,
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length,
      createdAt: video.createdAt
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error: error.message });
  }
};


// @desc Get single video by ID (public)
// @desc Get single video by ID (with views + likes/dislikes count)
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "name owner subscribers logo");

    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json({
      _id: video._id,
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnail: video.thumbnail,
      channel: video.channel,
      category: video.category,
      views: video.views,  // just return current count
      subscribersCount: video.channel?.subscribers?.length || 0,
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length,
      createdAt: video.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching video", error: error.message });
  }
};

export const increaseView = async (req,res) =>{
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.views += 1;
    await video.save();

    res.json({ views: video.views });
  } catch (error) {
    res.status(500).json({ message: "Error incrementing view", error: error.message });
  }
}


// @desc Update video (only channel owner)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("channel");
    if (!video) return res.status(404).json({ message: "Video not found" });

    // ownership check
    if (video.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this video" });
    }

    const updates = {};

    // handle text updates
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;

    // handle file uploads
    if (req.files?.thumbnail) {
      const thumb = await uploadToCloudinary(
        req.files.thumbnail[0].buffer,
        "thumbnails",
        "image"
      );
      updates.thumbnail = thumb.secure_url;
    }

    if (req.files?.video) {
      const uploadedVideo = await uploadToCloudinary(
        req.files.video[0].buffer,
        "videos",
        "video"
      );
      updates.url = uploadedVideo.secure_url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json({ message: "Video updated ✅", updatedVideo });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ message: "Error updating video", error: error.message });
  }
};

// @desc Delete video (only channel owner)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("channel");

    if (!video) return res.status(404).json({ message: "Video not found" });

    // check ownership
    if (video.channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    await video.deleteOne();
    res.json({ message: "Video deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video", error: error.message });
  }
};

// @desc Like a video
// @desc Like a video (with toggle)
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    // If already liked → remove (toggle off)
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter(id => id.toString() !== userId);
    } else {
      // Remove from dislikes if present
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
      video.likes.push(userId);
    }

    await video.save();
    res.json({
      message: "Like action completed ✅",
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error liking video", error: error.message });
  }
};

// @desc Dislike a video (with toggle)
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    // If already disliked → remove (toggle off)
    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
    } else {
      // Remove from likes if present
      video.likes = video.likes.filter(id => id.toString() !== userId);
      video.dislikes.push(userId);
    }

    await video.save();
    res.json({
      message: "Dislike action completed ✅",
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error disliking video", error: error.message });
  }
};

// @desc Get all videos for a specific channel
export const getChannelVideos = async (req, res) => {
  try {
    const channelId = req.params.channelId;

    const videos = await Video.find({ channel: channelId })
      .populate("channel", "name owner")
      .sort({ createdAt: -1 });
    const formatted = videos.map(video => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      channel: video.channel,
      category: video.category,
      views: video.views,
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length,
      createdAt: video.createdAt
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching channel videos", error: error.message });
  }
};

// @desc Search & filter videos
export const searchVideos = async (req, res) => {
  try {
    const { title, category } = req.query;
    let query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" }; // case-insensitive search
    }

    if (category) {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate("channel", "name owner")
      .sort({ createdAt: -1 });

    const formatted = videos.map(video => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      category: video.category,
      channel: video.channel,
      views: video.views,
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length,
      createdAt: video.createdAt
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error searching videos", error: error.message });
  }
};
