import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";
import Home from "./pages/Home";
import VideoDetail from "./pages/videoDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResult";
import CreateChannel from "./pages/CreateChannel";
import ChannelPage from "./pages/ChannelPage";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="flex">
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 lg:ml-56 mt-14 p-4 bg-gray-50 min-h-screen transition-all">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/createChannel" element={<CreateChannel />} />
            <Route path="/channel/:id" element={<ChannelPage />} />
            <Route path="/short" element={<h1>Shorts Page</h1>} />
            <Route path="/subscription" element={<h1>Subscription Page</h1>} />
            <Route path="/history" element={<h1>History Page</h1>} />
            <Route path="/watchLater" element={<h1>Watch Later Page</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
