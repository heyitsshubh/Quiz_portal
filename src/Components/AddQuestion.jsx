import React, { useState, useEffect } from "react";
import api from "./axiosInstance"; // Import axiosInstance
import { useLocation } from "react-router-dom"; // Import useLocation to get quizId
import SuccessBox from "./SuccessBox"; // Import SuccessBox component

const AddQuestions = () => {
  const location = useLocation(); // Access location state
  const { quizId } = location.state || {}; // Get quizId from state

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [points, setPoints] = useState(1); // Points for the question
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // State for success box

  // Prevent scrolling when the component is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling on unmount
    };
  }, []);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddQuestion = async () => {
    if (!question || options.some((opt) => opt === "")) {
      setError("Please fill out all fields and options.");
      return;
    }

    const newQuestion = {
      questionText: question,
      options,
      correctOption,
      points,
    };

    try {
      // Send the question to the backend
      const response = await api.put(
        `/admin/dashboard/quiz/questions`,
        { quizId, questions: [newQuestion] } // Include quizId in the request body
      );

      console.log("Question Saved:", response.data);
      setSuccess(true); // Show success box

      // Reset form
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOption(0);
      setPoints(1);
      setError("");

      // Hide success box after 2 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving question:", error.response?.data || error);
      setError("Failed to save question. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-start justify-center bg-gray-100 pt-8">
      <div className="max-w-3xl w-full p-8 bg-white shadow-lg rounded-lg overflow-auto">
        <h1 className="text-2xl font-bold text-purple-700 mb-5">Add Question</h1>
        <p className="text-gray-600 mb-6">
          Quiz ID: <span className="font-semibold">{quizId}</span>
        </p>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">Add New Question</h2>

          {error && <p className="text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="Enter your question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="correctOption"
                  className="accent-purple-600"
                  checked={correctOption === idx}
                  onChange={() => setCorrectOption(idx)}
                />
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Points</label>
            <input
              type="number"
              className="w-24 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              min="1"
            />
          </div>

          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition"
            onClick={handleAddQuestion}
          >
            + Add Question
          </button>
        </div>
      </div>

      {/* Show SuccessBox when a question is added successfully */}
      {success && <SuccessBox message="Question added successfully!" />}
    </div>
  );
};

export default AddQuestions;
