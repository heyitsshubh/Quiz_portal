import React, { useState } from "react";
import { FaClock, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const QuizQuestion = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const questionData = {
    title: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Machine Learning",
      "Hyperlink and Text Markup Language",
      "Home Tool Markup Language",
    ],
    current: 1,
    total: 3,
    timeRemaining: "30:00",
    quizTitle: "Introduction to Programming",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-purple-700 text-white px-10 py-6 flex justify-between items-center text-xl font-semibold">
        <h1>{questionData.quizTitle}</h1>
        <div className="flex items-center gap-2 text-lg font-medium">
          <FaClock size={18} />
          <span>{questionData.timeRemaining}</span>
        </div>
      </nav>

      {/* Question Card */}
      <div className="max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between mb-4 text-gray-500 text-lg">
          <span>Question {questionData.current} of {questionData.total}</span>
          <span className="flex items-center gap-2 text-purple-600 font-semibold">
            <FaClock size={16} />
            {questionData.timeRemaining}
          </span>
        </div>

        <h2 className="text-3xl font-bold mb-6">{questionData.title}</h2>

        <div className="flex flex-col gap-5">
          {questionData.options.map((option, idx) => (
            <label
              key={idx}
              className={`border px-4 py-4 rounded-lg cursor-pointer flex items-center gap-4 text-lg transition hover:border-purple-500 ${
                selectedOption === idx
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="option"
                value={idx}
                checked={selectedOption === idx}
                onChange={() => setSelectedOption(idx)}
                className="form-radio text-purple-600 scale-125"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-10">
          <button
            className="flex items-center gap-3 bg-gray-100 text-gray-500 px-5 py-2 rounded-md text-lg font-medium cursor-not-allowed"
            disabled
          >
            <FaArrowLeft />
            Previous
          </button>

          <button
            className={`flex items-center gap-3 px-6 py-2 rounded-md text-lg font-semibold transition ${
              selectedOption !== null
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-purple-200 text-white cursor-not-allowed"
            }`}
            disabled={selectedOption === null}
          >
            Next
            <FaArrowRight />
          </button>
        </div>
      </div>

    </div>
  );
};

export default QuizQuestion;


