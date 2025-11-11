import { useState, useEffect } from "react";
import {
  MdSearch,
  MdVideoCall,
  MdNotifications,
  MdAccountCircle,
  MdMenu,
  MdOutlineCancel,
  MdOutlineCloudUpload,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";

export default function Navbar({ toggleSidebar }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userChannel, setUserChannel] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const token = JSON.parse(localStorage.getItem("token"));

  // 🔹 Fetch user channel if logged in
  useEffect(() => {
    const fetchChannel = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/channels/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setUserChannel(data || null);
        }
      } catch (err) {
        console.error("Error fetching user channel:", err);
      }
    };
    fetchChannel();
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query)}`);
    setQuery("");
    setMobileSearch(false); // close overlay after searching
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/"); // redirect home
    window.location.reload();
  };

  // 🔹 Handle video upload
  const handleUploadVideo = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      setUploading(true);
      const res = await fetch(`/api/videos/${userChannel._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Video upload failed");
      await res.json();
      setUploadOpen(false);
      form.reset();
      alert("Video uploaded ✅");
      navigate(`/channel/${userChannel._id}`);
    } catch (err) {
      console.error(err.message);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <header className="w-full flex items-center justify-between px-4 py-2 bg-white shadow-md fixed top-0 left-0 z-50">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            onClick={toggleSidebar}
          >
            <MdMenu size={24} />
          </button>
          <span
            className="text-red-600 text-xl md:text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/pic.svg" width={100} height={80} alt="logo"/>
          </span>
        </div>

        {/* Center: Search bar (desktop only) */}
        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex flex-1 max-w-xl mx-4 items-center border border-gray-300 rounded-full overflow-hidden"
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 outline-none text-sm md:text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-3 md:px-4  bg-gray-100 h-full p-2 hover:bg-gray-200 hover:cursor-pointer"
          >
            <MdSearch size={20} />
          </button>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4 relative">
          {/* Mobile search toggle */}
          <button
            className="sm:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setMobileSearch(true)}
          >
            <MdSearch size={22} />
          </button>

          {/* Upload video */}
          <button
            className="hover:text-red-600"
            onClick={() => {
              if (!user) return navigate("/login");
              if (!userChannel) return navigate("/createChannel");
              setUploadOpen(true);
            }}
          >
            <MdVideoCall size={24} />
          </button>

          {!user ? (
            // --- Not logged in ---
            <Link to="/register">
              <button className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300">
                <MdAccountCircle size={22} />
              </button>
            </Link>
          ) : (
            // --- Logged in ---
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <MdAccountCircle size={28} />
                )}
                <span className="hidden md:block font-medium">
                  {user.username}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  {!userChannel && (
                    <Link
                      to="/createChannel"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Create Channel
                    </Link>
                  )}

                  {userChannel && (
                    <Link
                      to={`/channel/${userChannel._id}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Channel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* --- Mobile Search Overlay --- */}
      {mobileSearch && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-slide-down">
          <div className="flex items-center px-4 py-2 border-b shadow">
            <button
              onClick={() => setMobileSearch(false)}
              className="mr-3 text-gray-600"
            >
              <MdOutlineCancel size={24} />
            </button>
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex items-center border border-gray-300 rounded-full overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 outline-none text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className=" bg-gray-100 h-full p-4 overflow-hidden hover:bg-gray-200"
              >
                <MdSearch size={30} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Upload Modal --- */}
      {uploadOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-50">
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
                <label htmlFor="thumbnail">Select thumbnail file</label>
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
    </>
  );
}
