import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosInstance";
import { FaClock, FaPlus, FaEye,FaLockOpen } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import SuccessBox from "../SuccessBox";

const Admindashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/admin/dashboard/quizzes");
        let quizzesData = [];

        if (Array.isArray(response.data.data)) {
          quizzesData = response.data.data;
        } else if (response.data.data) {
          quizzesData = [response.data.data];
        } else {
          quizzesData = response.data.quizzes || [];
        }

        const transformedQuizzes = quizzesData.map((quiz) => ({
          quizTitle: quiz.title || "Untitled Quiz",
          description: quiz.description || "No description available",
          timeLimit: quiz.timeLimit || 0,
          difficulty: quiz.difficulty || "Unknown",
          id: quiz._id || quiz.id,
          status: quiz.status || "pending", 
        }));

        setQuizzes(transformedQuizzes);
      } catch (err) {
        console.error("Error fetching quizzes:", err.response?.data || err);
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAddQuestion = (quizId) => {
    navigate(`/dashboard/add-questions`, { state: { quizId } });
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await api.delete(`/admin/dashboard/quiz/details?_id=${quizId}`);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000); 
    } catch (error) {
      console.error("Error deleting quiz:", error.response?.data || error);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  const handleActivateQuiz = async (quizId) => {
    try {
      const res = await api.patch("/admin/dashboard/quiz/status", {
        _id: quizId,
        status: "active",
      });

      if (res.data.success) {
        setQuizzes((prev) =>
          prev.map((quiz) => (quiz.id === quizId ? { ...quiz, status: "active" } : quiz))
        );
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500); 
      } else {
        alert(res.data.message || "Failed to activate quiz.");
      }
    } catch (error) {
      console.error("Activation failed:", error.response?.data || error);
      alert("Error activating quiz. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading quizzes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (quizzes.length === 0) return <p className="text-center text-gray-500">No quizzes available.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Manage your quizzes</p>

      {showSuccess && <SuccessBox message="Quiz deleted successfully!" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizzes.map((quiz, idx) => (
          <div key={`${quiz.id}-${idx}`} className="bg-white p-5 rounded-xl shadow relative">
            <button
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer"
              title="Delete Quiz"
              onClick={() => handleDeleteQuiz(quiz.id)}
            >
              <FiTrash2 size={18} />
            </button>

            <h3 className="text-lg font-semibold text-gray-800 mb-1">{quiz.quizTitle}</h3>
            <p className="text-sm text-gray-500 mb-2">{quiz.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <FaClock className="mr-2" />
              {quiz.timeLimit} minutes
            </div>
            <p className="text-sm text-gray-500 mb-4">Difficulty: {quiz.difficulty}</p>

            <div className="flex gap-3 flex-wrap">
              <button
                className="bg-purple-600 text-white px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-purple-700 cursor-pointer"
                onClick={() => handleAddQuestion(quiz.id)}
              >
                <FaPlus /> Add Question
              </button>
              <button
                className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/dashboard/view-test`, { state: { quizId: quiz.id } })}
              >
                <FaEye /> View Test
              </button>
              {quiz.status !== "active" && (
                <button
                  className="border border-purple-500 text-purple-600 px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-purple-50 cursor-pointer"
                  onClick={() => handleActivateQuiz(quiz.id)}
                >
                 <FaLockOpen/> Activate
                </button>
              )}
            </div>

            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-xs ${quiz.status === "active" ? 'bg-purple-200 text-purple-800' : 'bg-red-300 text-yellow-800'}`}>
                {quiz.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admindashboard;





