import { useNavigate } from "react-router-dom";

export default function SuggestedVideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/video/${video._id}`)}
      className="flex gap-3 mb-4 flex-col cursor-pointer p-2"
    >
      {/* Thumbnail + duration */}
      <div className="relative w-full h-30 rounded-lg overflow-hidden bg-gray-200">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {video.duration && (
          <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
        <p className="text-xs text-gray-600">{video.channel?.name}</p>
        <p className="text-xs text-gray-500">
          {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
