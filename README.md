# 📺 Wetube

**Wetube** is a full-stack video-sharing platform inspired by YouTube 🎥.  
It allows users to create channels, upload videos, like/dislike content, subscribe to channels, and interact via comments — all while showcasing your skills as a developer.  

---

## ✨ Features

- 🔐 **Authentication** – Login, register, and secure routes with JWT.  
- 👤 **User Channels** – Each user can create their own channel.  
- 📤 **Video Uploads** – Upload videos and thumbnails with **Multer + Cloudinary + Streamifier**.  
- 🎬 **Video Player** – Stream videos with proper like/dislike handling.  
- ❤️ **Engagement** – Commenting, deleting comments, likes & dislikes.  
- 🔔 **Subscriptions** – Subscribe/Unsubscribe to channels with subscriber count tracking.  
- 👁 **View Count** – Auto-increment views when a video is played.  
- 🔎 **Search** – Find videos by title or category.  
- 📱 **Responsive UI** – Built with **React + TailwindCSS** for mobile-first design.  

---

## 🛠️ Tech Stack

**Frontend**  
- ⚛️ React.js  
- 🎨 TailwindCSS  
- 🗂 Redux Toolkit (State Management)  
- 🔗 React Router DOM  

**Backend**  
- 🟢 Node.js + Express  
- 🗄 MongoDB (Mongoose ODM)  
- ☁️ Cloudinary (Media storage)  
- 📦 Multer + Streamifier (File handling)  
- 🔑 JWT Authentication  

---

## 📡 Backend API Endpoints

Here are the core backend APIs for **CVtube**:

| **Module**   | **Endpoint**                          | **Method** | **Use Case**                                                                 |
|--------------|---------------------------------------|------------|-------------------------------------------------------------------------------|
| **Auth**     | `/api/auth/register`                  | `POST`     | Register a new user (username, email, password).                             |
|              | `/api/auth/login`                     | `POST`     | Login user and issue JWT.                                                    |
|              | `/api/auth/logout`                    | `POST`     | Logout and clear session.                                                    |
|              | `/api/auth/me`                        | `GET`      | Get the current authenticated user.                                          |
| **Channels** | `/api/channels`                       | `POST`     | Create a channel (only once per user).                                       |
|              | `/api/channels/:id`                   | `GET`      | Get channel details by ID.                                                   |
|              | `/api/channels/:id/subscribe`         | `POST`     | Subscribe/Unsubscribe from a channel.                                        |
|              | `/api/channels/user/:userId`          | `GET`      | Get channel info for a specific user (used for “My Channel”).                |
| **Videos**   | `/api/videos/:channelId`              | `POST`     | Upload a video with thumbnail (Multer + Cloudinary).                         |
|              | `/api/videos`                         | `GET`      | Get all videos (for homepage, suggestions).                                  |
|              | `/api/videos/:id`                     | `GET`      | Get single video details.                                                    |
|              | `/api/videos/:id`                     | `PUT`      | Update video info (title, description, thumbnail, video).                    |
|              | `/api/videos/:id`                     | `DELETE`   | Delete a video (only by channel owner).                                      |
|              | `/api/videos/:id/like`                | `POST`     | Like a video (toggle).                                                       |
|              | `/api/videos/:id/dislike`             | `POST`     | Dislike a video (toggle).                                                    |
|              | `/api/videos/:id/view`                | `PATCH`    | Increment view count.                                                        |
|              | `/api/videos/channel/:channelId`      | `GET`      | Get all videos for a specific channel.                                       |
| **Comments** | `/api/comments/:videoId`              | `GET`      | Get all comments for a video.                                                |
|              | `/api/comments/:videoId`              | `POST`     | Add a comment to a video.                                                    |
|              | `/api/comments/:commentId`            | `DELETE`   | Delete a comment (only by comment owner).                                    |
| **Search**   | `/api/search?title=...&cat=...`       | `GET`      | Search videos by title and/or category.                                      |

---

- ✅ All protected routes require **JWT token** in `Authorization: Bearer <token>` header.  
- ✅ Video & thumbnail uploads handled via **Multer + Cloudinary + Streamifier**.  
--

## 🎨 Frontend Routes & Components

| **Route**                | **Component**         | **Use Case**                                                                 |
|---------------------------|-----------------------|-------------------------------------------------------------------------------|
| `/`                       | `Home.jsx`           | Displays all videos in a responsive grid (with skeletons & error handling).  |
| `/search?query=...`       | `SearchResults.jsx`  | Shows videos filtered by search input (title/category).                       |
| `/video/:id`              | `VideoDetail.jsx`    | Watch video, like/dislike, subscribe, view count, and comments section.       |
| `/register`               | `Register.jsx`       | User registration with Redux + API integration.                              |
| `/login`                  | `Login.jsx`          | User login (with JWT persistence in localStorage).                           |
| `/createChannel`          | `CreateChannel.jsx`  | Create a channel (only once per user, with Cloudinary logo upload).           |
| `/channel/:id`            | `ChannelPage.jsx`    | Channel details, videos, subscribe/unsubscribe, upload/edit/delete videos.   |
| `/profile`                | `Profile.jsx`        | Shows user profile details (username, email, profilePic).                     |
| `/protected`              | `ProtectedRoute.jsx` | Wrapper for routes that require login (redirects if not authenticated).      |

---

## 🌟 Key Components

| **Component**            | **Description**                                                                 |
|---------------------------|---------------------------------------------------------------------------------|
| `Navbar.jsx`             | Responsive navbar with search, video upload modal, user dropdown, and dark mode.|
| `Sidebar.jsx`            | Collapsible sidebar with categories (mobile drawer + desktop collapse).         |
| `AuthModal.jsx`          | Popup modal for login/register when guests try to like/dislike/subscribe.       |
| `SuggestedVideoCard.jsx` | Small card used in suggested videos and channel videos.                         |
| `VideoCard.jsx`          | Main video card used in Home page grid.                                         |
| `LoadingSkeleton.jsx`    | Shimmer effect placeholder while loading videos.                                |

---

- ✅ All API calls are connected with **Redux Toolkit** (auth, subscriptions, etc.).  
- ✅ **JWT token** is stored in `localStorage` for persistence.  
- ✅ Responsive UI with **TailwindCSS + React Icons**.  
- ✅ Upload modals use **Multer + Cloudinary** integrated with backend APIs.  
---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 16)  
- MongoDB instance (local or Atlas)  
- Cloudinary account  

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/JagathHaren/VTube
   cd CVtube
   <!-- it backend -->
   npm install 
   <!-- for frontend -->
   cd frontend
   npm install
   ```
### .env
- MONGO_URI=your_mongodb_connection
- JWT_SECRET=your_secret_key
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret

# GitHub: https://github.com/JagathHaren/VTube