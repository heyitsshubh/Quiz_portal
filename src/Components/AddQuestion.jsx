import React, { useState } from "react";
import api from "./axiosInstance"; // Import axiosInstance
import { useLocation } from "react-router-dom"; // Import useLocation to get quizId

const AddQuestions = () => {
  const location = useLocation(); // Access location state
  const { quizId } = location.state || {}; // Get quizId from state

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [points, setPoints] = useState(1); // Points for the question
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        { quizId, 
            questions: [newQuestion] } // Include quizId in the request body
      );

      console.log("Question Saved:", response.data);
      setSuccess("Question added successfully!");

      // Reset form
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOption(0);
      setPoints(1);
      setError("");
    } catch (error) {
      console.error("Error saving question:", error.response?.data || error);
      setError("Failed to save question. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">Add Question</h1>
      <p className="text-gray-600 mb-6">Quiz ID: {quizId}</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Question</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <label className="block text-sm font-medium mb-1">Question</label>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows="3"
          placeholder="Enter your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <label className="block text-sm font-medium mb-2">Options</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="radio"
              name="correctOption"
              className="mr-2 accent-purple-600"
              checked={correctOption === idx}
              onChange={() => setCorrectOption(idx)}
            />
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
          </div>
        ))}

        <label className="block text-sm font-medium mt-4 mb-1">Points</label>
        <input
          type="number"
          className="w-full p-2 border rounded-md mb-4"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          min="1"
        />

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md"
          onClick={handleAddQuestion}
        >
          + Add Question
        </button>
      </div>
    </div>
  );
};

export default AddQuestions;
