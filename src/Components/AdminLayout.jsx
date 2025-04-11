import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom"; // Outlet renders child routes

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet /> {/* Render child routes here */}
      </div>
    </div>
  );
}