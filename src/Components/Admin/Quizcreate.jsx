import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../../utils/axiosInstance"; 
import { useQuizContext } from "./QuizContext";
import SuccessBox from "../User/SuccessBox"; 

const QuizCreator = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [difficulty, setDifficulty] = useState("Medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addQuiz } = useQuizContext();
  const navigate = useNavigate(); 

  const handleSave = async () => {
    if (!quizTitle || !description || !timeLimit || !difficulty) {
      setError("All fields are required. Please fill out the form.");
      return;
    }

    setError("");
    setLoading(true);

    const quizData = {
      title: quizTitle,
      description,
      timeLimit,
      difficulty: difficulty.toLowerCase(),
    };

    try {
      const response = await api.put("/admin/dashboard/quiz/details", quizData);

      console.log("API Response:", response.data);

      addQuiz(quizData);

      setShowSuccess(true);

      setQuizTitle("");
      setDescription("");
      setTimeLimit(30);
      setDifficulty("Medium");

      setTimeout(() => {
        setShowSuccess(false); 
        navigate("/dashboard");
      }, 2000);
    } catch (apiError) {
      console.error("API Error:", apiError.response?.data || apiError);
      setError(apiError.response?.data?.message || "Failed to save quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
      <h1 className="text-3xl font-bold text-[#003E8A] mb-2">Quiz Creator</h1>
      <p className="text-gray-600 mb-6">
        Create engaging quizzes for your students or audience
      </p>

      <div className="border-b mb-6">
        <button className="text-[#003E8A] border-b-2 border-[#003E8A] px-4 py-2 font-medium">
          Details
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter the basic information about your quiz.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}
    
        <div className="mb-4">
          <label className="block mb-1 font-medium">Quiz Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#003E8A]"
            placeholder="Enter quiz title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#003E8A]"
            rows="4"
            placeholder="Enter quiz description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Time Limit (minutes)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#003E8A]"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Difficulty Level</label>
          <div className="flex gap-6 mt-2">
            {["Easy", "Medium", "Hard"].map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={() => setDifficulty(level)}
                  className="accent-[#003E8A]"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#003E8A] text-white px-6 py-2 rounded-md hover:bg-[#003E8A]/90 transition"
          disabled={loading}
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Saving..." : "Save Details"}
        </button>
      </div>

      {showSuccess && <SuccessBox message="Quiz details saved successfully!" />}
    </div>
  );
};

export default QuizCreator;
