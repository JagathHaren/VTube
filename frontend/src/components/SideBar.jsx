import { NavLink } from "react-router-dom";
import {
  MdHome,
  MdVideoLibrary,
  MdSubscriptions,
  MdHistory,
  MdWatchLater,
} from "react-icons/md";

const menu = [
  { name: "Home", icon: <MdHome size={22} />, path: "/" },
  { name: "Short", icon: <MdVideoLibrary size={22} />, path: "/short" }, // better for short videos
  { name: "Subscription", icon: <MdSubscriptions size={22} />, path: "/subscription" },
  { name: "History", icon: <MdHistory size={22} />, path: "/history" },
  { name: "Watch Later", icon: <MdWatchLater size={22} />, path: "/watchLater" },
];


export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 h-screen w-56 bg-white border-r border-gray-200 shadow-sm p-4 z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <nav className="flex flex-col gap-3">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                  isActive ? "bg-gray-200 font-semibold" : ""
                }`
              }
            >
              {item.icon}
              {/* 🔹 FIX: Show name on mobile when drawer is open, always show on lg */}
              <span className={`${isOpen ? "inline" : "hidden lg:inline"}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
