import React from "react";
import { FaClock, FaBrain } from "react-icons/fa";

const quizzes = [
  {
    title: "Introduction to Programming",
    description: "Learn the basics of programming concepts",
    time: "30 minutes",
    difficulty: "Beginner",
  },
  {
    title: "Data Structures",
    description: "Explore common data structures and their applications",
    time: "45 minutes",
    difficulty: "Intermediate",
  },
  {
    title: "Web Development Fundamentals",
    description: "Master the core concepts of web development",
    time: "60 minutes",
    difficulty: "Intermediate",
  },
  {
    title: "Advanced Algorithms",
    description: "Deep dive into complex algorithmic concepts",
    time: "90 minutes",
    difficulty: "Advanced",
  },
];

const Userdashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-purple-700 text-white px-6 py-4 shadow-md flex items-center">
        <span className="text-xl font-bold flex items-center gap-2">
          <FaBrain size={20} />
          Quiz Master
        </span>
      </nav>

      {/* Main Content */}
      <main className="px-8 py-10">
        <h2 className="text-2xl font-semibold mb-6">Available Quizzes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>

              <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                <FaClock />
                {quiz.time}
              </div>
              <p className="text-sm text-gray-600 mb-4">Difficulty: {quiz.difficulty}</p>

              <button className="w-full bg-purple-600 text-white font-medium py-2 rounded-md hover:bg-purple-700 transition">
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </main>

    
    </div>
  );
};

export default Userdashboard;


