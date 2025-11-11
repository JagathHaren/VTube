import { Link, useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  console.log(video)

  return (
    <>
      <Link to={`/video/${video?._id}`}>
        <div
          className="w-full cursor-pointer"
        >
          {/* Thumbnail + Duration */}
          <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            {video.duration && (
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                {video.duration}
              </span>
            )}
          </div>

          {/* Video Info */}
          <div className="flex gap-3 mt-2">
            <img
              src={video.channel.logo}
              alt={video.channel.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
              <p className="text-xs text-gray-600">{video.channel?.name}</p>
              <p className="text-xs text-gray-500">
                {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
