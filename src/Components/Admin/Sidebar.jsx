import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaEdit, FaChartBar, FaSignOutAlt, FaBrain, FaBars, FaTimes } from "react-icons/fa";

export default function Sidebar() {
  const adminEmail = localStorage.getItem("adminEmail");
  const quizId = localStorage.getItem("quizId");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-[#003E8A] p-2 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#003E8A] text-white flex flex-col justify-between p-4 z-40 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:w-64`}
      >
        <div>
          <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
            Quiz Master
          </h1>
          <nav className="space-y-4">
            <SidebarLink to="/dashboard" icon={<FaHome />} text="Dashboard" />
            <SidebarLink to="/dashboard/quiz-creator" icon={<FaEdit />} text="Quiz Creator" />
            <SidebarLink
              to="/dashboard/results-dashboard"
              icon={<FaChartBar />}
              text="Results Dashboard"
            />
          </nav>
        </div>

        <div className="text-sm space-y-2">
          <div>
            <p className="font-semibold">Admin</p>
            <p className="text-gray-300 text-sm">{adminEmail || "admin@quizmaster.com"}</p>
          </div>
          <button
            className="flex items-center gap-2 text-red-300 hover:text-red-400 mt-4 text-lg"
            onClick={() => {
              localStorage.clear();
              if (quizId) {
                localStorage.setItem("quizId", quizId);
              }
              window.location.href = "/";
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}

function SidebarLink({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
          isActive ? "bg-[#003E8A]/80" : "hover:bg-[#003E8A]/90"
        }`
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
}