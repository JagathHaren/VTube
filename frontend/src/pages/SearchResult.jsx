import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function SearchResults() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query") || "";
  console.log(query)
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `/api/videos/search?title=${query}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) return <p className="p-6">Searching...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-lg font-semibold mb-4">
        Search results for: <span className="text-red-600">{query}</span>
      </h1>

      {results.length === 0 && <p>No videos found.</p>}

      <div className="space-y-4">
        {results.map((video) => (
          <Link
            to={`/video/${video._id}`}
            key={video._id}
            className="flex gap-4 p-2 border rounded-lg hover:bg-gray-50"
          >
            <div className="w-48 h-28 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-500">
                {video.channel?.name} • {video.views} views
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {video.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
