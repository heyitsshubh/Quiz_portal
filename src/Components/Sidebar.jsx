import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaEdit, FaChartBar, FaCogs, FaSignOutAlt, FaBrain } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-purple-900 text-white flex flex-col justify-between p-4">
      <div>
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <FaBrain /> Quiz Master
        </h1>
        <nav className="space-y-4">
          <SidebarLink to="/dashboard" icon={<FaHome />} text="Dashboard" />
          <SidebarLink to="/dashboard/quiz-creator" icon={<FaEdit />} text="Quiz Creator" />
          <SidebarLink to="/dashboard/results-dashboard" icon={<FaChartBar />} text="Results Dashboard" />
          <SidebarLink to="/dashboard/quiz-control" icon={<FaCogs />} text="Quiz Control" />
        </nav>
      </div>

      <div className="text-sm space-y-2">
        <div>
          <p className="font-semibold">Admin User</p>
          <p className="text-gray-300 text-xs">admin@quizmaster.com</p>
        </div>
        <button
          className="flex items-center gap-2 text-red-300 hover:text-red-400 mt-4"
          onClick={() => {
            localStorage.clear(); // Clear tokens or user data
            window.location.href = "/"; // Redirect to login page
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
          isActive ? "bg-purple-700" : "hover:bg-purple-800"
        }`
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
}