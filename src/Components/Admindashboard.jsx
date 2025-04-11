import React from "react";
import { useQuizContext } from "./QuizContext"; // Import QuizContext
import { FaClock, FaPlus, FaEye } from "react-icons/fa";

const Admindashboard = () => {
  const { quizzes } = useQuizContext(); // Access quizzes from context

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Manage your quizzes</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizzes.map((quiz, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {quiz.quizTitle}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{quiz.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <FaClock className="mr-2" />
              {quiz.timeLimit} minutes
            </div>
            <p className="text-sm text-gray-500 mb-4">Difficulty: {quiz.difficulty}</p>

            {/* Add Question and View Test Buttons */}
            <div className="flex gap-3">
              <button className="bg-purple-600 text-white px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-purple-700">
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