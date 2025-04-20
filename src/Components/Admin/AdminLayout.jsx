import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom"; 

export default function AdminLayout() {
  return (
    <div className="flex flex-col md:flex-row bg-purple-900">
      <Sidebar />
      <div className="md:ml-64 w-full h-screen overflow-y-auto bg-gray-100 p-4">
        <Outlet />
      </div>
    </div>
  );
}
