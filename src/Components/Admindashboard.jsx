import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./axiosInstance"; // Import axiosInstance
import { FaClock, FaPlus, FaEye } from "react-icons/fa";

const Admindashboard = () => {
  const [quizzes, setQuizzes] = useState([]); // State to store quizzes
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate();

  // Fetch quizzes from the API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/admin/dashboard/quiz/details");
        console.log("API Response:", response.data); // Debugging log

        // Handle single quiz object or array of quizzes
        const quizzesData = response.data.data
          ? [response.data.data] // Wrap single object in an array
          : response.data.quizzes || []; // Use quizzes array if available

        // Transform the data
        const transformedQuizzes = quizzesData.map((quiz) => ({
          quizTitle: quiz.title || "Untitled Quiz", // Fallback to default if title is missing
          description: quiz.description || "No description available",
          timeLimit: quiz.timeLimit || 0,
          difficulty: quiz.difficulty || "Unknown",
          id: quiz._id || quiz.id, // Use `_id` or `id` as the unique identifier
        }));

        setQuizzes(transformedQuizzes);
        console.log("Transformed Quizzes:", transformedQuizzes); // Debugging log
      } catch (err) {
        console.error("Error fetching quizzes:", err.response?.data || err);
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchQuizzes();
  }, []);

  const handleAddQuestion = (quizId) => {
    navigate(`/dashboard/add-questions`, { state: { quizId } });
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading quizzes...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (quizzes.length === 0) {
    return <p className="text-center text-gray-500">No quizzes available.</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Manage your quizzes</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizzes.map((quiz, idx) => (
          <div key={quiz.id || idx} className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {quiz.quizTitle}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{quiz.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <FaClock className="mr-2" />
              {quiz.timeLimit} minutes
            </div>
            <p className="text-sm text-gray-500 mb-4">Difficulty: {quiz.difficulty}</p>

            <div className="flex gap-3">
              <button
                className="bg-purple-600 text-white px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-purple-700"
                onClick={() => handleAddQuestion(quiz.id)}
              >
                <FaPlus /> Add Question
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-gray-100">
                <FaEye /> View Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admindashboard;
