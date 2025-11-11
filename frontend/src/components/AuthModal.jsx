import { useNavigate } from "react-router-dom";

export default function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold mb-3">Sign in required</h2>
        <p className="text-sm text-gray-600 mb-4">
          You need to log in to like, dislike, or subscribe.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              navigate("/login");
            }}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Login
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/register");
            }}
            className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100"
          >
            Register
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
