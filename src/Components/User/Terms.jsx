import React, { useState, useEffect } from "react";
import { 
  FaClock, FaCheckCircle, FaSyncAlt, FaArrowLeft, 
  FaExclamationCircle, FaInfoCircle, FaChevronRight,
  FaTrophy, FaBookOpen, FaUserAlt, FaShieldAlt
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quiz = location.state?.quiz;
  const [animate, setAnimate] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const handleStartQuiz = () => {
    if (quiz && quiz._id) {
      navigate(`/quiz/${quiz._id}/0`);
    } else {
      console.error("Quiz ID is missing");
      alert("Quiz ID is not available. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003E8A] to-[#003E8A]/90 flex flex-col items-center py-8 px-4 md:px-8">
      {/* Back button with improved styling */}
      {/* <div className="w-full max-w-5xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300"
        >
          <FaArrowLeft />
          <span>Back to Quizzes</span>
        </button>
      </div> */}

      <div className={`w-full max-w-5xl flex flex-col md:flex-row gap-6 transition-all duration-500 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-full md:w-1/3 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#003E8A] to-[#003E8A]/70 rounded-full flex items-center justify-center shadow-lg">
              <FaBookOpen size={20} />
            </div>
            <h2 className="text-2xl font-bold">Quiz Details</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-white/60 text-sm uppercase tracking-wider mb-1">Title</h3>
              <p className="text-xl font-medium">{quiz?.title || "Untitled Quiz"}</p>
            </div>

            <div>
              <h3 className="text-white/60 text-sm uppercase tracking-wider mb-1">Description</h3>
              <p className="text-base">{quiz?.description || "No description provided"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-white/60 text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                  <FaClock size={12} />
                  Time Limit
                </h3>
                <p className="text-xl font-medium">{quiz?.timeLimit || "N/A"} min</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="text-white/60 text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                  <FaTrophy size={12} />
                  Difficulty
                </h3>
                <p className="text-xl font-medium">{quiz?.difficulty || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-[#003E8A] to-[#003E8A]/90 py-5 px-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaShieldAlt />
              Quiz Rules & Guidelines
            </h1>
          </div>
          <div className="p-6 overflow-auto flex-grow">
            <p className="text-gray-600 mb-6 text-center">
              Please read and agree to these rules before starting the quiz
            </p>

            <ul className="space-y-4 text-left">
              <li className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500 transition-all duration-300 hover:shadow-md">
                <FaClock className="text-blue-500 text-lg mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Time Limit</p>
                  <p className="text-gray-600">You will have <span className="font-medium text-blue-600">{quiz?.timeLimit || "N/A"} minutes</span> to complete this quiz. A timer will show your remaining time.</p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-green-50 p-4 rounded-xl border-l-4 border-green-500 transition-all duration-300 hover:shadow-md">
                <FaCheckCircle className="text-green-500 text-lg mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">No Negative Marking</p>
                  <p className="text-gray-600">Don't worry about wrong answers – there's no penalty for incorrect responses.</p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-[#003E8A]/5 p-4 rounded-xl border-l-4 border-[#003E8A] transition-all duration-300 hover:shadow-md">
                <FaSyncAlt className="text-[#003E8A] text-lg mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">One Attempt Only</p>
                  <p className="text-gray-600">You can attempt the quiz only once. Make sure you're well prepared.</p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-orange-50 p-4 rounded-xl border-l-4 border-orange-500 transition-all duration-300 hover:shadow-md">
                <FaExclamationCircle className="text-orange-500 text-lg mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Auto-Submit</p>
                  <p className="text-gray-600">The quiz will be automatically submitted when the time limit expires or if you change tabs/windows.</p>
                </div>
              </li>

              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border-l-4 border-gray-500 transition-all duration-300 hover:shadow-md">
                <FaInfoCircle className="text-gray-500 text-lg mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Additional Information</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-1">
                    <li>Ensure you have a stable internet connection</li>
                    <li>Don't refresh or close the browser during the quiz</li>
                    <li>You can review your answers before final submission</li>
                   
                  </ul>
                </div>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="agree-terms" 
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="w-5 h-5 text-[#003E8A] rounded focus:ring-[#003E8A]"
                style={{ accentColor: "#003E8A" }}
              />
              <label htmlFor="agree-terms" className="text-gray-700">
                I have read and agree to the quiz rules
              </label>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <button
              className={`w-full py-3 px-6 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                agreed 
                  ? "bg-gradient-to-r from-[#003E8A] to-[#003E8A]/90 hover:from-[#003E8A]/90 hover:to-[#003E8A] shadow-lg hover:shadow-[#003E8A]/20" 
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleStartQuiz}
              disabled={!agreed}
            >
              <span>Start Quiz</span>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
