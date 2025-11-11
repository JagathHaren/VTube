import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateChannel() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null); // channel logo file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-medium">
          You must be logged in to create a channel.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("token"));

    if (!name.trim()) {
      setError("Channel name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (logo) formData.append("logo", logo); // attach logo file

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create channel");

      const data = await res.json();
      navigate(`/channel/${data?.channel?._id}`); // redirect to channel page
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-24 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create Your Channel</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        {/* Channel Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Channel Name</label>
          <input
            type="text"
            placeholder="Enter channel name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            placeholder="Tell viewers about your channel"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Channel Logo */}
        <div>
          <label className="block text-sm font-medium mb-1">Channel Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Channel"}
        </button>
      </form>
    </div>
  );
}
