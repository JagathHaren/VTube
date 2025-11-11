import Channel from "../models/channelModel.js";
import { uploadToCloudinary } from "../utils/uploadCloudinary.js";
//creating a channel
export const createChannel = async (req, res) => {
  try {
    const { name, description, banner } = req.body;

    // ✅ check if channel already exists
    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return res.status(400).json({ message: "Channel name already taken" });
    }

    let logoUrl = null;

    // ✅ if user uploaded a logo
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "channel_logos", "image");
      logoUrl = uploadResult.secure_url;
    }

    const channel = new Channel({
      name,
      description,
      banner,
      logo: logoUrl,         // store uploaded logo
      owner: req.user.id,    // logged-in user
    });

    await channel.save();

    res.status(201).json({ message: "Channel created ✅", channel });
  } catch (error) {
    res.status(500).json({ message: "Error creating channel", error: error.message });
  }
};

// @desc Get all channels (with subscriber count)
export const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find().populate("owner", "username email");

    // add subscribersCount for each channel
    const formatted = channels.map(channel => ({
      _id: channel._id,
      name: channel.name,
      description: channel.description,
      banner: channel.banner,
      owner: channel.owner,
      subscribersCount: channel.subscribers.length
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching channels", error: error.message });
  }
};


// @desc Get single channel by ID (with subscriber count)
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("owner", "username email");
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    res.json({
      _id: channel._id,
      name: channel.name,
      description: channel.description,
      banner: channel.banner,
      logo: channel.logo,
      owner: channel.owner,
      subscribersCount: channel.subscribers.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching channel", error: error.message });
  }
};


// @desc Update channel (only owner can update)
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Channel updated ✅", updatedChannel });
  } catch (error) {
    res.status(500).json({ message: "Error updating channel", error: error.message });
  }
};

// deleting channel
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await channel.deleteOne();
    res.json({ message: "Channel deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting channel", error: error.message });
  }
};

export const toggleSubscribe = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const isSubscribed = channel.subscribers.includes(req.user.id);

    if (isSubscribed) {
      // Unsubscribe
      channel.subscribers = channel.subscribers.filter(
        subId => subId.toString() !== req.user.id
      );
      await channel.save();
      return res.json({
        message: "Unsubscribed successfully ✅",
        subscribersCount: channel.subscribers.length,
        subscribed: false,
      });
    } else {
      // Subscribe
      channel.subscribers.push(req.user.id);
      await channel.save();
      return res.json({
        message: "Subscribed successfully ✅",
        subscribersCount: channel.subscribers.length,
        subscribed: true,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error toggling subscription", error: error.message });
  }
};


// @desc Get list of subscribers for a channel
export const getSubscribers = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("subscribers", "username email");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.json({
      channel: channel.name,
      subscribersCount: channel.subscribers.length,
      subscribers: channel.subscribers
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscribers", error: error.message });
  }
};


export const getChannelByUserId = async (req,res) =>{
  try {
    const channel = await Channel.findOne({ owner: req.params.userId });
    if (!channel) {
      return res.status(404).json({ message: "No channel found" });
    }
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

