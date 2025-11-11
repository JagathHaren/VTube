import dotenv from "dotenv";
import mongoose from "mongoose";
import Video from "./models/videoModel.js";
import Channel from "./models/channelModel.js";

dotenv.config();
const videos = [
  {
    title: "MERN Stack Crash Course",
    description: "Learn MERN stack basics in one video!",
    url: "https://example.com/videos/mern1.mp4",
    thumbnail: "https://example.com/thumbs/mern1.jpg",
    category: "Programming",
    views: 120
  },
  {
    title: "React Hooks Explained",
    description: "A deep dive into useState and useEffect.",
    url: "https://example.com/videos/react-hooks.mp4",
    thumbnail: "https://example.com/thumbs/react-hooks.jpg",
    category: "Programming",
    views: 95
  },
  {
    title: "MongoDB Beginner Tutorial",
    description: "Introduction to MongoDB Atlas and CRUD operations.",
    url: "https://example.com/videos/mongo-basics.mp4",
    thumbnail: "https://example.com/thumbs/mongo-basics.jpg",
    category: "Database",
    views: 80
  },
  {
    title: "Top 10 JavaScript Tricks",
    description: "Cool JS tricks every dev should know.",
    url: "https://example.com/videos/js-tricks.mp4",
    thumbnail: "https://example.com/thumbs/js-tricks.jpg",
    category: "Programming",
    views: 200
  },
  {
    title: "Gaming Highlights 2025",
    description: "Best gaming moments of the year.",
    url: "https://example.com/videos/gaming2025.mp4",
    thumbnail: "https://example.com/thumbs/gaming2025.jpg",
    category: "Gaming",
    views: 500
  },
  {
    title: "Daily Yoga for Beginners",
    description: "Simple yoga routine for flexibility and focus.",
    url: "https://example.com/videos/yoga.mp4",
    thumbnail: "https://example.com/thumbs/yoga.jpg",
    category: "Health",
    views: 300
  },
  {
    title: "Travel Vlog: Paris",
    description: "Exploring the Eiffel Tower and more.",
    url: "https://example.com/videos/paris.mp4",
    thumbnail: "https://example.com/thumbs/paris.jpg",
    category: "Travel",
    views: 250
  },
  {
    title: "Top 5 Coding Keyboards",
    description: "Best mechanical keyboards for programmers.",
    url: "https://example.com/videos/keyboards.mp4",
    thumbnail: "https://example.com/thumbs/keyboards.jpg",
    category: "Tech",
    views: 180
  },
  {
    title: "How to Cook Pasta Like a Chef",
    description: "Delicious pasta recipe step by step.",
    url: "https://example.com/videos/pasta.mp4",
    thumbnail: "https://example.com/thumbs/pasta.jpg",
    category: "Food",
    views: 220
  },
  {
    title: "AI Trends in 2025",
    description: "What’s next for Artificial Intelligence?",
    url: "https://example.com/videos/ai-trends.mp4",
    thumbnail: "https://example.com/thumbs/ai-trends.jpg",
    category: "Tech",
    views: 400
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected ✅");

    // Pick an existing channel (replace with real ID)
    const channelId = "68be63c1df7db616ee52471d";
    const channel = await Channel.findById(channelId);
    if (!channel) {
      console.log("❌ Channel not found. Create a channel first.");
      process.exit();
    }

    // Attach channelId to all videos
    const videosWithChannel = videos.map(v => ({ ...v, channel: channel._id }));

    // Insert videos
    await Video.insertMany(videosWithChannel);
    console.log("✅ Videos inserted successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
