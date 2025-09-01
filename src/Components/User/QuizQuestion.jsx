
import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useQuizStore } from "../../store/Quizstore";

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2"
        >
          <FaTimes size={24} />
        </button>
        <img
          src={imageUrl}
          alt="Question"
          className="max-w-full h-auto"
          style={{ maxHeight: "80vh" }}
        />
      </div>
    </div>
  );
};

const QuizQuestion = () => {
  const { quizId, questionIndex: indexParam } = useParams();
  const currentIndex = Number(indexParam) || 0;
  const navigate = useNavigate();

  const {
    questionIndex,
    setQuestionIndex,
    userAnswers,
    setUserAnswers,
    timeLeft,
    setTimeLeft,
    timeSinceStart,
    setTimeSinceStart,
    tabSwitchCount,
    incrementTabSwitch,
    selectedOption,
    setSelectedOption,
    resetQuizState, 
  } = useQuizStore();

  const [questionsCache, setQuestionsCache] = useState({});
  const [quizMetadata, setQuizMetadata] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(new Set());
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimerInitialized, setIsTimerInitialized] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isQuizInitialized, setIsQuizInitialized] = useState(false);

  useEffect(() => {
    const initializeQuiz = () => {
      const savedStartTime = localStorage.getItem(`quiz-${quizId}-startTime`);
      const savedQuestionIndex = localStorage.getItem(`quiz-${quizId}-questionIndex`);
      const savedAnswers = localStorage.getItem(`quiz-${quizId}-answers`);
      
      if (!savedStartTime || !savedQuestionIndex || !savedAnswers) {
        localStorage.removeItem(`quiz-${quizId}-startTime`);
        localStorage.removeItem(`quiz-${quizId}-questionIndex`);
        localStorage.removeItem(`quiz-${quizId}-answers`);

        if (resetQuizState) {
          resetQuizState();
        } else {
          setQuestionIndex(0);
          setUserAnswers([]);
          setTimeLeft(0);
          setTimeSinceStart(0);
          setSelectedOption(null);
        }
      }
      
      setIsQuizInitialized(true);
    };

    if (quizId) {
      initializeQuiz();
    }
  }, [quizId]);

  useEffect(() => {
    if (!isQuizInitialized) return;
    
    const idx = parseInt(indexParam, 10);
    if (!isNaN(idx) && idx !== questionIndex) {
      setQuestionIndex(idx);
    }
  }, [indexParam, setQuestionIndex, questionIndex, isQuizInitialized]);

  const fetchQuestion = async (index) => {
    if (questionsCache[index] || loadingQuestions.has(index)) {
      return questionsCache[index];
    }

    setLoadingQuestions(prev => new Set([...prev, index]));
    
    try {
      const res = await api.get(`/quiz/question?quizId=${quizId}&questionIndex=${index}`);
      // console.log(res.data);
      if (res.data.success) {
        const questionData = res.data.data;

        setQuestionsCache(prev => ({
          ...prev,
          [index]: questionData
        }));
        if (!quizMetadata) {
          setQuizMetadata({
            quizTitle: questionData.quizTitle || "Quiz",
            totalQuestions: questionData.totalQuestions || 1,
            timeLimit: questionData.timeLimit
          });
        }
        
        setError("");
        return questionData;
      } else {
        throw new Error(res.data.message || "Failed to load question data");
      }
    } catch (err) {
      console.error("Failed to fetch question:", err);
      setError(err.response?.data?.message || "Failed to load question. Please try again.");
      return null;
    } finally {
      setLoadingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };
  useEffect(() => {
    if (quizId && isQuizInitialized && !questionsCache[questionIndex]) {
      // console.log("Loading initial question:", questionIndex);
      fetchQuestion(questionIndex);
    }
  }, [quizId, questionIndex, isQuizInitialized]);

 
  useEffect(() => {
    if (!quizMetadata || !isQuizInitialized) return;

    const prefetchQuestions = [];
    
   
    const nextIndex = questionIndex + 1;
    if (nextIndex < quizMetadata.totalQuestions && !questionsCache[nextIndex]) {
      prefetchQuestions.push(nextIndex);
    }
    
  
    const prevIndex = questionIndex - 1;
    if (prevIndex >= 0 && !questionsCache[prevIndex]) {
      prefetchQuestions.push(prevIndex);
    }
    

    prefetchQuestions.forEach(index => {
      setTimeout(() => fetchQuestion(index), 100);
    });
  }, [questionIndex, questionsCache, quizMetadata, isQuizInitialized]);

  useEffect(() => {
    if (!quizMetadata || isTimerInitialized || !isQuizInitialized) return;
    
    let timeLimitMinutes = 10;
    if (
      typeof quizMetadata.timeLimit === "number" && quizMetadata.timeLimit > 0
    ) {
      timeLimitMinutes = quizMetadata.timeLimit;
    } else if (
      typeof quizMetadata.timeLimit === "string" &&
      !isNaN(parseInt(quizMetadata.timeLimit, 10)) &&
      parseInt(quizMetadata.timeLimit, 10) > 0
    ) {
      timeLimitMinutes = parseInt(quizMetadata.timeLimit, 10);
    }
    const totalTime = timeLimitMinutes * 60;

    let savedStartTime = localStorage.getItem(`quiz-${quizId}-startTime`);
    let remaining = totalTime;
    let elapsed = 0;
    
    if (savedStartTime) {
      const parsed = new Date(savedStartTime).getTime();
      if (!isNaN(parsed)) {
        elapsed = Math.floor((Date.now() - parsed) / 1000);
        remaining = Math.max(totalTime - elapsed, 0);
     
        if (remaining <= 0) {
          console.log("Timer expired, resetting for fresh attempt");
          localStorage.removeItem(`quiz-${quizId}-startTime`);
          localStorage.removeItem(`quiz-${quizId}-questionIndex`);
          localStorage.removeItem(`quiz-${quizId}-answers`);
          savedStartTime = null;
          remaining = totalTime;
          elapsed = 0;
        }
      } else {
        savedStartTime = null;
      }
    }

    if (!savedStartTime) {
      const now = new Date();
      localStorage.setItem(`quiz-${quizId}-startTime`, now.toISOString());
    }

    console.log("Timer initialized:", { remaining, elapsed, totalTime });
    setTimeLeft(remaining);
    setTimeSinceStart(elapsed);
    setIsTimerInitialized(true);
  }, [quizMetadata, isTimerInitialized, quizId, setTimeLeft, setTimeSinceStart, isQuizInitialized]);

  useEffect(() => {
    if (!isTimerInitialized || !isQuizInitialized || timeLeft <= 0 || isNaN(timeLeft)) return;
    
    const interval = setInterval(() => {
      useQuizStore.setState((state) => {
        const currentTimeLeft = Number(state.timeLeft);
        const currentElapsed = Number(state.timeSinceStart);

        if (isNaN(currentTimeLeft) || isNaN(currentElapsed)) {
          clearInterval(interval);
          return { timeLeft: 0, timeSinceStart: currentElapsed };
        }

        if (currentTimeLeft <= 1) {
          clearInterval(interval);
          if (Object.keys(questionsCache).length > 0) {
            submitQuiz();
          }
          return { timeLeft: 0, timeSinceStart: currentElapsed + 1 };
        }

        return {
          timeLeft: currentTimeLeft - 1,
          timeSinceStart: currentElapsed + 1,
        };
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTimerInitialized, timeLeft, isQuizInitialized, questionsCache]);

  useEffect(() => {
    if (!isQuizInitialized) return;
    
    const savedAnswers = JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`) || "[]");
    if (savedAnswers.length > 0) {
      setUserAnswers(savedAnswers);
    }
  }, [quizId, setUserAnswers, isQuizInitialized]);

  
  useEffect(() => {
    if (!isQuizInitialized) return;
    
    localStorage.setItem(`quiz-${quizId}-questionIndex`, questionIndex);
    navigate(`/quiz/${quizId}/${questionIndex}`, { replace: true });
  }, [questionIndex, quizId, navigate, isQuizInitialized]);

  useEffect(() => {
    if (!isQuizInitialized) return;
    
    localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(userAnswers));
  }, [userAnswers, quizId, isQuizInitialized]);


  useEffect(() => {
    if (!questionsCache[questionIndex] || !isQuizInitialized) return;
    
    const savedAnswers = JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`) || "[]");
    if (savedAnswers[questionIndex]) {
      setSelectedOption(savedAnswers[questionIndex].selectedOption);
    } else {
      setSelectedOption(null);
    }
  }, [questionIndex, quizId, questionsCache, setSelectedOption, isQuizInitialized]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && questionsCache[questionIndex] && !isSubmitting && isQuizInitialized) {
        incrementTabSwitch();
        if (tabSwitchCount === 0) {
          toast.warn("Don't switch the tab! The quiz will be auto-submitted if you switch again.", {
            autoClose: 3000,
          });
        } else if (tabSwitchCount >= 1) {
          toast.error("You switched tabs again. The quiz will now be auto-submitted.", {
            autoClose: 3000,
          });
          submitQuiz();
        }
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [questionsCache, questionIndex, isSubmitting, tabSwitchCount, incrementTabSwitch, isQuizInitialized]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleNextOrSubmit = async () => {
    const currentQuestion = questionsCache[currentIndex];
    if (!currentQuestion) return;

    if (selectedOption !== null) {
      const updated = [...userAnswers];
      updated[currentIndex] = {
        questionId: currentQuestion.questionData._id,
        selectedOption,
      };
      setUserAnswers(updated);
    }

    if (currentIndex + 1 >= quizMetadata.totalQuestions) {
      submitQuiz();
    } else {
      const nextIndex = currentIndex + 1;
      if (!questionsCache[nextIndex]) {
        await fetchQuestion(nextIndex);
      }
      navigate(`/quiz/${quizId}/${nextIndex}`);
    }
  };

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      if (!questionsCache[prevIndex]) {
        await fetchQuestion(prevIndex);
      }
      navigate(`/quiz/${quizId}/${prevIndex}`);
    }
  };

  const handleQuestionClick = async (index) => {
    if (!questionsCache[index]) {
      await fetchQuestion(index);
    }
    navigate(`/quiz/${quizId}/${index}`);
  };

  const submitQuiz = async () => {
    if (isSubmitting) return;
    
    const currentQuestion = questionsCache[questionIndex];
    if (!currentQuestion || !currentQuestion.questionData) {
      setError("Quiz data not loaded. Cannot submit.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const finalAnswers = [...userAnswers];
      if (selectedOption !== null && !finalAnswers[questionIndex]) {
        finalAnswers[questionIndex] = {
          questionId: currentQuestion.questionData._id,
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
        localStorage.removeItem(`quiz-${quizId}-startTime`);
        localStorage.removeItem(`quiz-${quizId}-questionIndex`);
        localStorage.removeItem(`quiz-${quizId}-answers`);

        toast.success("Quiz submitted successfully!");

        setTimeout(() => {
          navigate("/quiz-submission-success", {
            state: {
              score: response.data.data.score,
              totalPoints: response.data.data.totalPoints,
              totalQuestions: quizMetadata.totalQuestions,
            },
          });
        }, 1200);
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
      setError(err.response?.data?.message || err.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestionData = questionsCache[questionIndex];
  const isCurrentQuestionLoading = loadingQuestions.has(questionIndex);


  if (!isQuizInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Initializing quiz...</p>
      </div>
    );
  }

  if (!quizMetadata) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading quiz...</p>
      </div>
    );
  }

  if (!currentQuestionData && !isCurrentQuestionLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Failed to load question. Please refresh the page.</p>
      </div>
    );
  }

  if (isCurrentQuestionLoading || !currentQuestionData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading question...</p>
      </div>
    );
  }

  const { quizTitle = "Quiz", totalQuestions = 1 } = quizMetadata;
  const { questionData = {} } = currentQuestionData;
  const { questionText = "", options = [], imageUrl = null } = questionData;
  const canSubmit = timeSinceStart >= 600;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-[#003E8A] text-white px-10 py-6 flex justify-between items-center text-4xl font-bold">
        <h1>{quizTitle}</h1>
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
                    ? "bg-[#003E8A] hover:bg-[#003E8A]/90"
                    : "bg-gray-300 hover:bg-gray-300"
                } ${questionIndex === index ? "ring-2 ring-[#003E8A] ring-opacity-20" : ""}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="max-w-6xl mx-auto mt-14 bg-white shadow-lg rounded-2xl p-6">
            <div className="flex justify-between mb-4 text-gray-500 text-lg">
              <span>Question {questionIndex + 1} of {totalQuestions}</span>
              <span className="flex items-center gap-2 text-[#003E8A] font-semibold">
                <FaClock size={16} />
                {formatTime(timeLeft)}
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-6">{questionText}</h2>

            {imageUrl && (
              <div className="mb-6 relative group">
                <img
                  src={imageUrl}
                  alt="Question"
                  className="max-w-full h-auto rounded-lg shadow-md cursor-pointer transition-all hover:opacity-95"
                  style={{ maxHeight: "400px" }}
                  onClick={() => setSelectedImage(imageUrl)}
                />
                <button
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <FaSearch className="text-gray-700" size={16} />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-5">
              {options.length > 0 ? (
                options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`border px-4 py-4 rounded-lg cursor-pointer flex items-center gap-4 text-lg transition hover:border-[#003E8A] ${
                      selectedOption === idx
                        ? "border-[#003E8A] bg-[#003E8A]/5"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={idx}
                      checked={selectedOption === idx}
                      onChange={() => setSelectedOption(idx)}
                      className="form-radio text-[#003E8A] scale-125 accent-[#003E8A]"
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
                className={`flex items-center gap-3 px-6 py-2 rounded-md text-lg font-semibold ${
                  questionIndex === totalQuestions - 1
                    ? canSubmit
                      ? "bg-[#003E8A] text-white hover:bg-[#003E8A]/90 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#003E8A] text-white hover:bg-[#003E8A]/90 cursor-pointer"
                }`}
                onClick={handleNextOrSubmit}
                disabled={questionIndex === totalQuestions - 1 && !canSubmit}
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

      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};

export default QuizQuestion;
