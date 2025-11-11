import Channel from "../models/channelModel.js";

// Ensure logged-in user owns the channel
export const isChannelOwner = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to upload to this channel" });
    }
    req.channel = channel; // attach channel info to request
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
