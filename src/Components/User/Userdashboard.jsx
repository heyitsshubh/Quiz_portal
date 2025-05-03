import React, { useEffect, useState } from "react";
import { 
  FaClock, FaBrain, FaSearch, FaStar, FaArrowRight, 
  FaTrophy, FaGraduationCap, FaChartLine 
} from "react-icons/fa";
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
        const quizList = Array.isArray(response.data.data) ? response.data.data : [];
        setQuizzes(quizList);
      } catch (err) {
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003E8A]/10 to-white flex flex-col">
      <header className="bg-gradient-to-r from-[#003E8A] via-[#003E8A]/90 to-[#003E8A]/80 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center md:justify-between">
            <div className="flex items-center gap-3">
               {/* <div className="bg-white/10 p-2 rounded-lg">
                <FaBrain size={28} className="text-[#003E8A]/30" />
              </div> */}
              <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-white">Quiz Master</span>
            </div>
          </div>
        </div>
      </header>

  <div className="bg-white shadow-md border-b border-[#003E8A]/10">
  <div className="container mx-auto px-5 py-5">
    <div className="flex flex-col md:flex-row justify-center items-center gap-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-[#003E8A]/10 rounded-lg">
          <FaGraduationCap className="text-[#003E8A] text-lg" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Quizzes</p>
          <p className="font-bold text-gray-800 text-xl">{quizzes.length}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-green-100 rounded-lg">
          <FaTrophy className="text-green-600 text-lg" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="font-bold text-gray-800 text-xl">0</p>
        </div>
      </div>
    </div>
  </div>
</div>

      <main className="flex-1 container mx-auto px-6 py-10 flex flex-col items-center ">
  <div className="text-center max-w-3xl mx-auto mb-10">
    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#003E8A] to-[#003E8A]/70 mb-4">Available Quizzes</h2>
    <p className="text-gray-600">Select a quiz below to begin your assessment journey</p>
  </div>

  {loading ? (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-20 h-20 border-4 border-gray-200 border-t-[#003E8A] rounded-full animate-spin mb-6"></div>
      <p className="text-gray-600 text-lg">Loading available quizzes...</p>
    </div>
  ) : error ? (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-xl mx-auto shadow-sm">
      <div className="flex">
        <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-700 font-medium">{error}</p>
      </div>
      <div className="mt-3 ml-9">
        <button 
          onClick={() => window.location.reload()} 
          className="text-red-600 hover:text-red-800 font-medium text-sm underline"
        >
          Try Again
        </button>
      </div>
    </div>
  ) : quizzes.length === 0 ? (
    <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-xl mx-auto border border-gray-100">
      <div className="inline-flex items-center justify-center bg-gray-100 w-20 h-20 rounded-full mb-6">
        <FaSearch className="text-gray-400 text-3xl" />
      </div>
      <p className="text-gray-700 text-xl font-medium">No quizzes available at this time.</p>
      <p className="text-gray-500 mt-3 mb-6">Check back soon for new challenges!</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-6 py-2 bg-[#003E8A]/10 text-[#003E8A] rounded-full font-medium hover:bg-[#003E8A]/20 transition"
      >
        Refresh
      </button>
    </div>
  ) : (
    <div className="flex justify-center w-full">
    <div className="w-full max-w-[1024px] mx-auto">
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 gap-10 w-full place-items-center">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white p-10 pt-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col transform hover:-translate-y-1 w-full max-w-[480px]"
            >
              <div className="h-3 bg-gradient-to-r from-[#003E8A] to-[#003E8A]/80 rounded-t-xl -mx-10 -mt-6 mb-8"></div>
              
              {/* <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wide text-[#003E8A] bg-[#003E8A]/10 rounded-full px-4 py-1.5">
                  {quiz.category || "General Knowledge"}
                </span>
              </div> */}
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{quiz.title}</h3>
              
              <div className="bg-[#003E8A]/5 rounded-lg p-5 mb-6">
                <p className="text-gray-700 text-sm flex-grow line-clamp-3">
                  {quiz.description || "No description provided for this quiz."}
                </p>
              </div>
        
              <div className="flex justify-between items-center mb-8 border-t border-b border-gray-100 py-4">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <FaClock className="text-blue-600" />
                  </div>
                  <span>{quiz.timeLimit || "N/A"} minutes</span>
                </div>
        
                <span className={`text-xs font-semibold px-4 py-2 rounded-full ${
                  quiz.difficulty?.toLowerCase() === 'easy' ? 'bg-green-100 text-green-700 border border-green-200' :
                  quiz.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                  quiz.difficulty?.toLowerCase() === 'hard' ? 'bg-red-100 text-red-700 border border-red-200' :
                  'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                  {quiz.difficulty || "Unknown"} Level
                </span>
              </div>
        
              <button
                className="w-full bg-gradient-to-r from-[#003E8A] to-[#003E8A]/90 hover:from-[#003E8A]/90 hover:to-[#003E8A] text-white font-medium py-4 rounded-lg transition shadow hover:shadow-lg flex items-center justify-center space-x-3"
                onClick={() => navigate(`/terms`, { state: { quiz } })} 
              >
                <span className="text-base cursor-pointer">Start Quiz</span>
                <FaArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )}
</main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              {/* <FaBrain className="text-[#003E8A]" /> */}
              <span className="text-gray-700 font-medium">Quiz Master</span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Quiz Master | All Rights Reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Userdashboard;



