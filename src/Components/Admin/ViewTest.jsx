import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";
import api from "../../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

const ViewTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

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
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await api.delete(`/admin/dashboard/quiz/${quizId}/question/${questionId}`);
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch (err) {
      console.error("Error deleting question:", err.response?.data || err);
      alert("Failed to delete question.");
    }
  };

  // Image Modal Component
  const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="relative bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <img
            src={imageUrl}
            alt="Question"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </div>
    );
  };

  if (loading) return <p className="text-center text-gray-600">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!questions.length) return <p className="text-center text-gray-500">No questions available.</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#003E8A]">Question List</h2>
        <button
          onClick={() => navigate("/dashboard/add-questions", { state: { quizId } })}
          className="bg-[#003E8A] text-white px-4 py-2 rounded-md hover:bg-[#003E8A]/90 transition"
        >
          Add New Question
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question, index) => (
          <div
            key={question._id || index}
            className="bg-white rounded-xl shadow p-5 relative border border-gray-100"
          >
            <span className="absolute -top-3 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-[#003E8A]/10 text-[#003E8A]">
              Question {index + 1}
            </span>

            <div className="absolute top-3 right-3 flex gap-2 text-gray-500">
              {question.imageUrl && (
                <button
                  onClick={() => setSelectedImage(question.imageUrl)}
                  className="text-gray-500 hover:text-gray-600"
                >
                  <FaImage />
                </button>
              )}
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
                className="hover:text-[#003E8A]"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(question._id)}
                className="hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>

            <div className="mt-5">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                {question.questionText}
              </h3>

              {question.imageUrl && (
                <div className="mb-3">
                  <img
                    src={question.imageUrl}
                    alt="Question"
                    className="w-full h-32 object-cover rounded-md cursor-pointer"
                    onClick={() => setSelectedImage(question.imageUrl)}
                  />
                </div>
              )}

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

              <div className="mt-3 text-right text-sm text-gray-500">
                Points: {question.points || 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ViewTest;



