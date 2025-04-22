import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

const ViewTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quizId) {
        setError("Quiz ID not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/admin/dashboard/quiz", {
          params: { _id: quizId },
        });

        const fetchedQuestions = response.data.data?.questions || [];
        setQuestions(fetchedQuestions);
      } catch (err) {
        console.error("Error fetching questions:", err.response?.data || err);
        setError("Failed to load questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const handleDelete = async (questionId) => {
    try {
      await api.delete(`/admin/dashboard/quiz/${quizId}/question/${questionId}`);
      setQuestions(prev => prev.filter(q => q._id !== questionId));
    } catch (err) {
      console.error("Error deleting question:", err.response?.data || err);
      alert("Failed to delete question.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!questions.length) return <p className="text-center text-gray-500">No questions available.</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-purple-700">Question List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-5 relative border border-gray-100"
          >
            <span
              className={`absolute -top-3 left-4 px-3 py-1 text-xs font-semibold rounded-full ${
                question.type === "Multiple Choice"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-pink-100 text-pink-600"
              }`}
            >
              {question.type || "Question"}
            </span>

            <div className="absolute top-3 right-3 flex gap-2 text-gray-500">
              <button
                onClick={() =>
                  navigate("/dashboard/add-questions", {
                    state: {
                      mode: "edit",
                      quizId,
                      questionData: question,
                    },
                  })
                }
              >
                <FaEdit className="hover:text-blue-600" />
              </button>
              <button onClick={() => handleDelete(question._id)}>
                <FaTrash className="hover:text-red-600" />
              </button>
            </div>

            <h3 className="text-base font-semibold mt-5 text-gray-800 mb-3">
              {question.questionText}
            </h3>

            <div className="space-y-2 text-sm">
              {question.options.map((option, idx) => {
                const isCorrect = idx === question.correctOption;
                const optionLabel = String.fromCharCode(65 + idx);
                return (
                  <div
                    key={idx}
                    className={`flex items-center px-3 py-2 rounded-md border ${
                      isCorrect
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "text-gray-700 border-gray-200"
                    }`}
                  >
                    <span className="font-bold mr-2">{optionLabel}.</span>
                    <span>{option}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewTest;



