import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SuggestedVideoCard from "../components/SuggestedVideoCard";
import {
  MdUpload,
  MdOutlineCancel,
  MdOutlineCloudUpload,
  MdDelete,
  MdEdit,
} from "react-icons/md";

export default function ChannelPage() {
  const { id } = useParams(); // channelId
  const { user } = useSelector((state) => state.auth);

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [editVideo, setEditVideo] = useState(null);
  const [updating, setUpdating] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));

  // --- Fetch channel + videos ---
  const fetchChannelData = async () => {
    try {
      setLoading(true);
      const resChannel = await fetch(`/api/channels/${id}`);
      const channelData = await resChannel.json();
      setChannel(channelData);

      const resVideos = await fetch(`/api/videos/channel/${id}`);
      setVideos(await resVideos.json());

      if (channelData.isSubscribed) setIsSubscribed(true);
    } catch (err) {
      console.error("Error fetching channel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [id]);

  // --- Subscribe / Unsubscribe ---
  const handleSubscribe = async () => {
    if (!user) {
      alert("Please login to subscribe");
      return;
    }
    try {
      const res = await fetch(`/api/channels/${id}/subscribe`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to subscribe/unsubscribe");

      setIsSubscribed((prev) => !prev);
      setChannel((prev) => ({
        ...prev,
        subscribersCount: isSubscribed
          ? prev.subscribersCount - 1
          : prev.subscribersCount + 1,
      }));
    } catch (err) {
      console.error(err);
      alert("Subscription failed");
    }
  };

  // --- Upload Video ---
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      setUploading(true);
      const res = await fetch(`/api/videos/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Video upload failed");
      await res.json();
      setUploadOpen(false);
      form.reset();
      fetchChannelData();
    } catch (err) {
      console.error(err.message);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  // --- Delete Video ---
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error(err.message);
      alert("Failed to delete video");
    }
  };

  // --- Update Video ---
  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("token"))
    const form = e.target;
    const formData = new FormData(form);
    console.log(editVideo?._id)
    try {
      setUpdating(true);
      const res = await fetch(`/api/videos/${editVideo?._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Update failed");
      await res.json();
      setEditVideo(null);
      fetchChannelData();
    } catch (err) {
      console.error(err.message);
      alert("Failed to update video");
    } finally {
      setUpdating(false);
    }
  };


  if (loading) return <p className="p-6">Loading channel...</p>;
  if (!channel) return <p className="p-6 text-red-500">Channel not found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20">
      {/* --- Channel Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-sm">
            <img
              src={channel.logo || "/default-logo.png"}
              alt={channel.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {channel.name}
            </h1>
            <p className="text-gray-500 text-sm">
              {channel.subscribersCount.toLocaleString()} subscribers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && user.id === channel.owner._id && (
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              <MdUpload size={20} /> Upload
            </button>
          )}
          <button
            onClick={handleSubscribe}
            className={`px-4 py-2 rounded-full transition ${isSubscribed
              ? "bg-gray-300 text-black hover:bg-gray-400"
              : "bg-red-600 text-white hover:bg-red-700"
              }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>

      {/* --- Videos Section --- */}
      <h2 className="mt-6 text-lg font-semibold">Videos</h2>
      {videos.length === 0 ? (
        <p className="text-gray-500">No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {videos.map((vid) => (
            <div key={vid._id} className="relative border rounded-lg shadow-sm">
              <SuggestedVideoCard video={vid} />

              {user && user.id === channel.owner._id && (
                <div className="flex gap-2 p-2">
                  <button
                    onClick={() => setEditVideo(vid)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-md"
                  >
                    <MdEdit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(vid._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md"
                  >
                    <MdDelete size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* --- Upload Modal --- */}
      {uploadOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setUploadOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <MdOutlineCancel size={24} />
            </button>

            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MdOutlineCloudUpload size={22} className="text-blue-600" /> Upload
              Video
            </h2>

            <form onSubmit={handleUploadVideo} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Video Title"
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                placeholder="Description"
                rows="3"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="video">Select video file</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  required
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <label htmlFor="video">Select thumbnail file</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>


              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {editVideo && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setEditVideo(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <MdOutlineCancel size={24} />
            </button>

            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MdEdit size={22} className="text-yellow-500" /> Edit Video
            </h2>

            <form onSubmit={handleUpdateVideo} className="space-y-4">
              <input
                type="text"
                name="title"
                defaultValue={editVideo.title}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <textarea
                name="description"
                defaultValue={editVideo.description}
                rows="3"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="thumbnail">Select thumbnail file</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <label htmlFor="video">Select video file</label>
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditVideo(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
