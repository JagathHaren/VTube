export default function VideoSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="w-full aspect-video bg-gray-300 rounded-lg"></div>

      {/* Info placeholder */}
      <div className="flex gap-3 mt-2">
        {/* Avatar placeholder */}
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>

        {/* Text placeholders */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
