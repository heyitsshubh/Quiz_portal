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

  useEffect(() => {
    navigate(`/quiz/${quizId}/${questionIndex}`, { replace: true });
  }, [questionIndex, quizId, navigate]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(
          `/quiz/question?quizId=${quizId}&questionIndex=${questionIndex}`
        );

        if (res.data.success) {
          setQuizData(res.data.data);
          const savedAnswer = userAnswers[questionIndex];
          setSelectedOption(savedAnswer ? savedAnswer.selectedOption : null);
          setError("");

          if (!isTimerInitialized && res.data.data.timeLimit) {
            setTimeLeft(res.data.data.timeLimit * 60);
            setIsTimerInitialized(true);
          }
        } else {
          setError(res.data.message || "Failed to load question data");
        }
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.response?.data?.message || "Failed to load question. Please try again.");
      }
    };

    if (quizId) {
      fetchQuestion();
    }
  }, [quizId, questionIndex, userAnswers, isTimerInitialized]);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleNextOrSubmit = () => {
    if (selectedOption !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[questionIndex] = {
        questionId: quizData.questionData._id,
        selectedOption,
      };
      setUserAnswers(newAnswers);
    }

    if (questionIndex + 1 >= quizData.totalQuestions) {
      submitQuiz();
    } else {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
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
      const answersToSubmit = [...userAnswers];
      if (selectedOption !== null && !answersToSubmit[questionIndex]) {
        answersToSubmit[questionIndex] = {
          questionId: quizData.questionData._id,
          selectedOption,
        };
      }

      if (!quizId) {
        throw new Error("Quiz ID is missing");
      }

      const filteredAnswers = answersToSubmit
        .filter((a) => a !== undefined && a !== null)
        .map((answer) => ({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
        }));

      if (filteredAnswers.length === 0) {
        throw new Error("No valid answers to submit");
      }

      const submissionData = {
        _id: quizId,
        answers: filteredAnswers,
      };

      console.log("Submitting quiz with:", submissionData);

      const response = await api.post("/quiz/submit", submissionData);

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
      console.error("Submission error:", {
        error: err,
        response: err.response,
        data: err.response?.data,
      });

      setError(
        err.response?.data?.message || err.message || "Submission failed. Please try again."
      );
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

  const {
    quizTitle = "Quiz",
    totalQuestions = 1,
    questionData = {},
  } = quizData;

  const { questionText = "", options = [] } = questionData;

  return (
<div className="min-h-screen bg-gray-50 flex flex-col">
  {/* Full-Width Navbar */}
  <nav className="bg-purple-700 text-white px-10 py-6 flex justify-between items-center text-4xl font-bold">
    <h1>{quizTitle}</h1>
    <div className="flex items-center gap-2 text-lg font-medium">
      <FaClock size={18} />
      <span>{formatTime(timeLeft)}</span>
    </div>
  </nav>

  <div className="flex flex-1">
    {/* Sidebar - Hidden for screens smaller than 768px */}
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
            } ${
              questionIndex === index ? "ring-2 ring-purple-700 ring-opacity-20" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </aside>

    {/* Main Content */}
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
            className={`flex items-center gap-3 px-6 py-2 rounded-md cursor-pointer text-lg font-semibold transition hover:bg-purple-500 ${
              questionIndex === totalQuestions - 1
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
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



