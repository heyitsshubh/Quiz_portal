import React, { useEffect, useState } from "react";
import { FaClock, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const QuizQuestion = () => {
  const { quizId, questionIndex: indexParam } = useParams();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(parseInt(indexParam) || 0);
  const [quizData, setQuizData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerInitialized, setIsTimerInitialized] = useState(false);

  // 🧠 Load question and timer logic
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/quiz/question?quizId=${quizId}&questionIndex=${questionIndex}`);
        if (res.data.success) {
          console.log("Fetched quizData:", res.data.data);
          setQuizData(res.data.data);
          setError("");
        } else {
          setError(res.data.message || "Failed to load question data");
        }
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.response?.data?.message || "Failed to load question. Please try again.");
      }
    };

    if (quizId) fetchQuestion();
  }, [quizId, questionIndex]);

  // 🕒 Timer init logic
  useEffect(() => {
    if (!quizData || isTimerInitialized || !quizData.timeLimit) return;
  
    const totalTime = parseInt(quizData.timeLimit, 10) * 60;
  
    if (isNaN(totalTime)) {
      console.error("Invalid timeLimit:", quizData.timeLimit);
      return;
    }
  
    let savedStartTime = localStorage.getItem(`quiz-${quizId}-startTime`);
    let startTime = Date.now(); // fallback
    let remaining = totalTime;
  
    if (savedStartTime) {
      const parsed = new Date(savedStartTime).getTime();
      if (!isNaN(parsed)) {
        const elapsed = Math.floor((Date.now() - parsed) / 1000);
        remaining = Math.max(totalTime - elapsed, 0);
        console.log(`⏳ Valid savedStartTime. Elapsed: ${elapsed}s. Remaining: ${remaining}s`);
      } else {
        console.warn("⚠️ Invalid savedStartTime. Replacing it.");
        savedStartTime = null;
      }
    }
  
    if (!savedStartTime) {
      const newStart = new Date().toISOString();
      localStorage.setItem(`quiz-${quizId}-startTime`, newStart);
      console.log("🆕 Start time saved:", newStart);
    }
  
    setTimeLeft(remaining);
    setIsTimerInitialized(true);
  }, [quizData, isTimerInitialized, quizId]);
  

  // 🕑 Countdown tick
  useEffect(() => {
    if (!isTimerInitialized || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isTimerInitialized]);

  // 💾 Restore localStorage
  useEffect(() => {
    const savedIndex = parseInt(localStorage.getItem(`quiz-${quizId}-questionIndex`), 10);
    const savedAnswers = JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`) || "[]");

    if (!isNaN(savedIndex)) setQuestionIndex(savedIndex);
    if (savedAnswers.length > 0) setUserAnswers(savedAnswers);
  }, [quizId]);

  useEffect(() => {
    localStorage.setItem(`quiz-${quizId}-questionIndex`, questionIndex);
  }, [questionIndex, quizId]);

  useEffect(() => {
    localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(userAnswers));
  }, [userAnswers, quizId]);

  useEffect(() => {
    navigate(`/quiz/${quizId}/${questionIndex}`, { replace: true });
  }, [questionIndex, quizId, navigate]);

  // Restore selected option when question changes
  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`) || "[]");
    if (savedAnswers[questionIndex]) {
      setSelectedOption(savedAnswers[questionIndex].selectedOption);
    } else {
      setSelectedOption(null);
    }
  }, [questionIndex, quizId]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleNextOrSubmit = () => {
    if (selectedOption !== null) {
      const updated = [...userAnswers];
      updated[questionIndex] = {
        questionId: quizData.questionData._id,
        selectedOption,
      };
      setUserAnswers(updated);
    }

    if (questionIndex + 1 >= quizData.totalQuestions) {
      submitQuiz();
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleQuestionClick = (index) => {
    setQuestionIndex(index);
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const finalAnswers = [...userAnswers];
      if (selectedOption !== null && !finalAnswers[questionIndex]) {
        finalAnswers[questionIndex] = {
          questionId: quizData.questionData._id,
          selectedOption,
        };
      }

      const filtered = finalAnswers
        .filter((a) => a !== undefined && a !== null)
        .map((ans) => ({
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
        }));

      const response = await api.post("/quiz/submit", {
        _id: quizId,
        answers: filtered,
      });

      if (response.data.success) {
        navigate("/quiz-submission-success", {
          state: {
            score: response.data.data.score,
            totalPoints: response.data.data.totalPoints,
            totalQuestions: quizData.totalQuestions,
          },
        });
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || err.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quizData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading question...</p>
      </div>
    );
  }

  const { quizTitle = "Quiz", totalQuestions = 1, questionData = {} } = quizData;
  const { questionText = "", options = [] } = questionData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-purple-700 text-white px-10 py-6 flex justify-between items-center text-4xl font-bold">
        <h1>{quizTitle}</h1>
        <div className="flex items-center gap-2 text-lg font-medium">
          <FaClock size={18} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="hidden md:block w-54 bg-gray-50 text-white p-4">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(index)}
                className={`w-12 h-12 flex items-center justify-center rounded-md text-sm font-bold cursor-pointer ${
                  userAnswers[index]
                    ? "bg-purple-700 hover:bg-purple-600"
                    : "bg-gray-300 hover:bg-gray-300"
                } ${questionIndex === index ? "ring-2 ring-purple-700 ring-opacity-20" : ""}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="max-w-7xl mx-auto mt-14 bg-white shadow-lg rounded-2xl p-6">
            <div className="flex justify-between mb-4 text-gray-500 text-lg">
              <span>
                Question {questionIndex + 1} of {totalQuestions}
              </span>
              <span className="flex items-center gap-2 text-purple-600 font-semibold">
                <FaClock size={16} />
                {formatTime(timeLeft)}
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-6">{questionText}</h2>

            <div className="flex flex-col gap-5">
              {options.length > 0 ? (
                options.map((option, idx) => (
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
                      className="form-radio text-purple-600 scale-125 accent-purple-600"
                    />
                    <span>{option}</span>
                  </label>
                ))
              ) : (
                <p className="text-red-600">No options available for this question.</p>
              )}
            </div>

            <div className="flex justify-between items-center mt-10">
              <button
                className={`flex items-center gap-3 px-5 py-2 rounded-md cursor-pointer text-lg font-medium ${
                  questionIndex > 0
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                onClick={handlePrevious}
                disabled={questionIndex === 0}
              >
                <FaArrowLeft />
                Previous
              </button>

              <button
                className="flex items-center gap-3 px-6 py-2 rounded-md text-lg font-semibold bg-purple-600 text-white hover:bg-purple-700"
                onClick={handleNextOrSubmit}
              >
                {questionIndex === totalQuestions - 1 ? "Submit" : "Next"}
                {questionIndex < totalQuestions - 1 && <FaArrowRight />}
              </button>
            </div>

            {error && (
              <div className="mt-6 text-red-600 bg-red-100 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;



