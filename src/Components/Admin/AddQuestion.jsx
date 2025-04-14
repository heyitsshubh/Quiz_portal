import React, { useState, useEffect } from "react";
import api from "../axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import SuccessBox from "../SuccessBox";

const AddQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { quizId, mode, questionData } = location.state || {};

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [points, setPoints] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    // Pre-fill fields in edit mode
    if (mode === "edit" && questionData) {
      setQuestion(questionData.questionText);
      setOptions(questionData.options);
      setCorrectOption(questionData.correctOption);
      setPoints(questionData.points || 1);
    }
  }, [mode, questionData]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOrEditQuestion = async () => {
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
      if (mode === "edit" && questionData?._id) {
        await api.put(
          `/admin/dashboard/quiz/${quizId}/question/${questionData._id}`,
          newQuestion
        );
        setSuccess(true);
      } else {
      
        await api.put(`/admin/dashboard/quiz/questions`, {
          _id: quizId,
          questions: [newQuestion],
        });
        setSuccess(true);

      
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectOption(0);
        setPoints(1);
      }

      setError("");
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
        <h1 className="text-2xl font-bold text-purple-700 mb-5">
          {mode === "edit" ? "Edit Question" : "Add Question"}
        </h1>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">
            {mode === "edit" ? "Update this question" : "Add New Question"}
          </h2>

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
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition cursor-pointer"
            onClick={handleAddOrEditQuestion}
          >
            {mode === "edit" ? "Update Question" : "+ Add Question"}
          </button>
        </div>
      </div>

      {success && (
        <SuccessBox
          message={mode === "edit" ? "Question updated successfully!" : "Question added successfully!"}
        />
      )}
    </div>
  );
};

export default AddQuestions;

