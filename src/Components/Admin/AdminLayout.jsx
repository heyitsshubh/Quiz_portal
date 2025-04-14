import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom"; 

export default function AdminLayout() {
  return (
    <div className="flex bg-purple-900 ">
      <Sidebar />
      <div className="ml-64 w-full h-screen overflow-y-auto bg-gray-100 p-4">
      <Outlet /> 
      </div>
    </div>
  );
}