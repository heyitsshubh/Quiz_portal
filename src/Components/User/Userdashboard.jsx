import React, { useEffect, useState } from "react";
import { FaClock, FaBrain } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance"; 

const Userdashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get("/quiz/available");
        console.log("Quiz API Response:", response.data);

        const quizList = Array.isArray(response.data.data) ? response.data.data : [];
        setQuizzes(quizList);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-700 text-white px-6 py-4 shadow-md flex items-center ">
        <span className="text-xl font-bold flex items-center gap-2">
          <FaBrain size={20} />
          Quiz Master
        </span>
      </nav>

    
      <main className="px-8 py-10">
        <h2 className="text-3xl font-bold mb-6  text-purple-700 ">Available Quizzes</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading quizzes...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : quizzes.length === 0 ? (
          <p className="text-center text-gray-500">No quizzes available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {quiz.description || "No description"}
                </p>

                <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <FaClock />
                  {quiz. timeLimit|| "Duration N/A"}minutes
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Difficulty: {quiz.difficulty || "N/A"}
                </p>

                <button
                  className="w-full bg-purple-600 text-white font-medium py-2 rounded-md hover:bg-purple-700 transition cursor-pointer"
                  onClick={() => navigate(`/quiz/${quiz._id}/0`)}
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Userdashboard;




