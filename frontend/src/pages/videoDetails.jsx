import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdThumbUp, MdThumbDown } from "react-icons/md";
import SuggestedVideoCard from "../components/SuggestedVideoCard";
import AuthModal from "../components/AuthModal";

export default function VideoDetail() {
  const { id } = useParams(); // videoId
  const { user } = useSelector((state) => state.auth);

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [suggested, setSuggested] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));

  // --- Fetch video, comments, suggested ---
  const fetchVideoData = async () => {
    try {
      const resVideo = await fetch(`/api/videos/${id}`);
      const videoData = await resVideo.json();
      setVideo(videoData);

      const resComments = await fetch(`/api/comments/${id}`);
      setComments(await resComments.json());

      const resSuggested = await fetch("/api/videos");
      const suggestedData = await resSuggested.json();
      setSuggested(suggestedData.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Error fetching video detail:", err);
    }
  };
  useEffect(() => {
    fetchVideoData();
  }, [id]);

  // --- Restore subscription state ---
  useEffect(() => {
    if (video?.channel?._id) {
      const storedSubs = JSON.parse(localStorage.getItem("subscriptions")) || [];
      setIsSubscribed(storedSubs.includes(video.channel._id));
    }
  }, [video]);

  // --- Protected wrapper ---
  const handleProtectedAction = (callback) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    callback();
  };

  // --- Views increment ---
  const handlePlay = async () => {
    try {
      await fetch(`/api/videos/${id}/view`, { method: "PATCH" });
    } catch (err) {
      console.error("Error incrementing view:", err);
    }
  };

  // --- Like / Dislike ---
  const handleLike = async () => {
    try {
      await fetch(`/api/videos/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVideoData(); // refresh
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDislike = async () => {
    try {
      await fetch(`/api/videos/${id}/dislike`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVideoData();
    } catch (err) {
      console.error(err.message);
    }
  };

  // --- Subscribe / Unsubscribe ---
  const handleSubscribe = async () => {
    try {
      await fetch(`/api/channels/${video?.channel?._id}/subscribe`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsSubscribed((prev) => {
        const newState = !prev;

        // update localStorage
        let subs = JSON.parse(localStorage.getItem("subscriptions")) || [];
        if (newState) {
          if (!subs.includes(video.channel._id)) subs.push(video.channel._id);
        } else {
          subs = subs.filter((cid) => cid !== video.channel._id);
        }
        localStorage.setItem("subscriptions", JSON.stringify(subs));

        return newState;
      });

      fetchVideoData();
    } catch (err) {
      console.error(err.message);
    }
  };

  // --- Comments ---
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return alert("Enter your comment ✌️");

    try {
      await fetch(`/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      setNewComment("");
      const res = await fetch(`/api/comments/${id}`);
      setComments(await res.json());
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!video) return <p className="p-6">Loading video...</p>;

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 mt-16">
      {/* --- LEFT: Main Video Section --- */}
      <div className="flex-1">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src={video.url}
            controls
            className="w-full h-full"
            onPlay={handlePlay}
          />
        </div>

        {/* Title */}
        <h1 className="mt-4 text-lg font-semibold">{video.title}</h1>
        <p className="text-sm text-gray-500">
          {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
        </p>

        {/* Like / Dislike */}
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => handleProtectedAction(handleLike)}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <MdThumbUp size={20} /> {video.likesCount}
          </button>
          <button
            onClick={() => handleProtectedAction(handleDislike)}
            className="flex items-center gap-1 hover:text-red-600"
          >
            <MdThumbDown size={20} /> {video.dislikesCount}
          </button>
        </div>

        {/* Channel Info + Subscribe */}
        <div className="flex items-center justify-between mt-4 border-b pb-3">
          <Link to={`/channel/${video?.channel?._id}`}>
            <div className="flex items-center gap-3">
              <img
                src={video?.channel?.logo}
                alt={video?.channel?.name || "Channel Logo"}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow bg-gray-100"
              />
              <div>
                <p className="font-semibold">{video.channel?.name}</p>
                <p className="text-sm text-gray-500">
                  {video?.subscribersCount ?? 0} subscribers
                </p>
              </div>
            </div>
          </Link>
          <button
            onClick={() => handleProtectedAction(handleSubscribe)}
            className={`px-4 py-2 rounded-full ${isSubscribed
                ? "bg-gray-300 text-black hover:bg-gray-400"
                : "bg-red-600 text-white hover:bg-red-700"
              }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Description */}
        {video.description && (
          <div className="mt-4 bg-gray-100 rounded-lg p-3">
            <p>{video.description}</p>
          </div>
        )}

        {/* Comments */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleProtectedAction(() => handleAddComment(e))
            }}
            className="flex items-center gap-2 mb-4"
          >
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c._id} className="p-2 border-b">
                <p className="font-semibold">{c.user?.username || "Anonymous"}</p>
                <p>{c.text}</p>
                {user && user.id === c.user?._id && (
                  <button
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT: Suggested Videos --- */}
      <aside className="w-full lg:w-80">
        <h2 className="font-semibold text-lg mb-3">Suggested Videos</h2>
        {suggested.map((vid) => (
          <SuggestedVideoCard key={vid._id} video={vid} />
        ))}
      </aside>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
