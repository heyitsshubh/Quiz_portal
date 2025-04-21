import React from "react";
import { FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuizSubmissionSuccess = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    navigate("/"); // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar */}
      <div className="bg-purple-700 text-white px-10 py-4 text-2xl font-semibold">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full " />
          Quiz Master
        </span>
      </div>

      {/* Center Card */}
      <div className="flex justify-center items-center mt-20 px-4">
        <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-xl text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Congratulations!</h1>
          <p className="text-gray-600 text-lg mb-6">
            Your quiz has been submitted successfully.
          </p>
          <button
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md text-lg font-medium flex items-center gap-2 mx-auto"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSubmissionSuccess;
