// import React, { useEffect, useState } from "react";
// import {
//   FaClock,
//   FaArrowLeft,
//   FaArrowRight,
//   FaSearch,
//   FaTimes,
// } from "react-icons/fa";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../utils/axiosInstance";

// const ImageModal = ({ imageUrl, onClose }) => {
//   if (!imageUrl) return null;
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="relative bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2"
//         >
//           <FaTimes size={24} />
//         </button>
//         <img
//           src={imageUrl}
//           alt="Question"
//           className="max-w-full h-auto"
//           style={{ maxHeight: "80vh" }}
//         />
//       </div>
//     </div>
//   );
// };

// const QuizQuestion = () => {
//   const { quizId, questionIndex: indexParam } = useParams();
//   const navigate = useNavigate();
//   const [questionIndex, setQuestionIndex] = useState(parseInt(indexParam) || 0);
//   const [quizData, setQuizData] = useState(null);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [error, setError] = useState("");
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [timeSinceStart, setTimeSinceStart] = useState(0);
//   const [isTimerInitialized, setIsTimerInitialized] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [tabSwitchCount, setTabSwitchCount] = useState(0); 
  

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         const res = await api.get(`/quiz/question?quizId=${quizId}&questionIndex=${questionIndex}`);
//         if (res.data.success) {
//           setQuizData(res.data.data);
//           setError("");
//         } else {
//           setError(res.data.message || "Failed to load question data");
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load question. Please try again.");
//       }
//     };
//     if (quizId) fetchQuestion();
//   }, [quizId, questionIndex]);

//   useEffect(() => {
//     if (!quizData || isTimerInitialized || !quizData.timeLimit) return;
//     const totalTime = parseInt(quizData.timeLimit, 10) * 60;
//     if (isNaN(totalTime)) return;

//     let savedStartTime = localStorage.getItem(`quiz-${quizId}-startTime`);
//     let remaining = totalTime;
//     let elapsed = 0;
//     if (savedStartTime) {
//       const parsed = new Date(savedStartTime).getTime();
//       if (!isNaN(parsed)) {
//         elapsed = Math.floor((Date.now() - parsed) / 1000);
//         remaining = Math.max(totalTime - elapsed, 0);
//       } else {
//         savedStartTime = null;
//       }
//     }

//     if (!savedStartTime) {
//       const now = new Date();
//       localStorage.setItem(`quiz-${quizId}-startTime`, now.toISOString());
//     }

//     setTimeLeft(remaining);
//     setTimeSinceStart(elapsed);
//     setIsTimerInitialized(true);
//   }, [quizData, isTimerInitialized, quizId]);

//   useEffect(() => {
//     if (!isTimerInitialized || timeLeft <= 0) return;
//     const interval = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           submitQuiz();
//           return 0;
//         }
//         return prev - 1;
//       });
//       setTimeSinceStart((prev) => prev + 1);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [timeLeft, isTimerInitialized]);

//   useEffect(() => {
//     const savedIndex = parseInt(localStorage.getItem(`quiz-${quizId}-questionIndex`), 10);
//     const savedAnswers = JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`) || "[]");
//     if (!isNaN(savedIndex)) setQuestionIndex(savedIndex);
//     if (savedAnswers.length > 0) setUserAnswers(savedAnswers);
//   }, [quizId]);

//   useEffect(() => {
//     localStorage.setItem(`quiz-${quizId}-questionIndex`, questionIndex);
//   }, [questionIndex, quizId]);

//   useEffect(() => {
//     localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(userAnswers));
//   }, [userAnswers, quizId]);

//   useEffect(() => {
//     navigate(`/quiz/${quizId}/${questionIndex}`, { replace: true });
//   }, [questionIndex, quizId, navigate]);

//   useEffect(() => {
//     const savedAnswers = JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`) || "[]");
//     if (savedAnswers[questionIndex]) {
//       setSelectedOption(savedAnswers[questionIndex].selectedOption);
//     } else {
//       setSelectedOption(null);
//     }
//   }, [questionIndex, quizId]);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden && quizData && !isSubmitting) {
//         setTabSwitchCount((prev) => prev + 1); // Increment tab switch count

//         if (tabSwitchCount === 0) {
//           alert("⚠️ Don't switch the tab! The quiz will be auto-submitted if you switch again.");
//         } else if (tabSwitchCount >= 1) {
//           alert("You switched tabs again. The quiz will now be auto-submitted.");
//           submitQuiz(); // Auto-submit the quiz
//         }
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, [quizData, isSubmitting, tabSwitchCount]);

//   const formatTime = (seconds) => {
//     const min = Math.floor(seconds / 60);
//     const sec = seconds % 60;
//     return `${min}:${sec < 10 ? "0" : ""}${sec}`;
//   };

//   const handleNextOrSubmit = () => {
//     if (selectedOption !== null) {
//       const updated = [...userAnswers];
//       updated[questionIndex] = {
//         questionId: quizData.questionData._id,
//         selectedOption,
//       };
//       setUserAnswers(updated);
//     }
//     if (questionIndex + 1 >= quizData.totalQuestions) {
//       submitQuiz();
//     } else {
//       setQuestionIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     setQuestionIndex((prev) => Math.max(prev - 1, 0));
//   };

//   const handleQuestionClick = (index) => {
//     setQuestionIndex(index);
//   };

//   const submitQuiz = async () => {
//     if (isSubmitting) return;
//     if (!quizData || !quizData.questionData) {
//       setError("Quiz data not loaded. Cannot submit.");
//       return;
//     }

//     setIsSubmitting(true);
//     setError("");

//     try {
//       const finalAnswers = [...userAnswers];
//       if (selectedOption !== null && !finalAnswers[questionIndex]) {
//         finalAnswers[questionIndex] = {
//           questionId: quizData.questionData._id,
//           selectedOption,
//         };
//       }

//       const filtered = finalAnswers
//         .filter((a) => a !== undefined && a !== null)
//         .map((ans) => ({
//           questionId: ans.questionId,
//           selectedOption: ans.selectedOption,
//         }));

//       const response = await api.post("/quiz/submit", {
//         _id: quizId,
//         answers: filtered,
//       });

//       if (response.data.success) {
//         localStorage.removeItem(`quiz-${quizId}-startTime`);
//         localStorage.removeItem(`quiz-${quizId}-questionIndex`);
//         localStorage.removeItem(`quiz-${quizId}-answers`);

//         navigate("/quiz-submission-success", {
//           state: {
//             score: response.data.data.score,
//             totalPoints: response.data.data.totalPoints,
//             totalQuestions: quizData.totalQuestions,
//           },
//         });
//       } else {
//         throw new Error(response.data.message || "Submission failed");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || "Submission failed.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!quizData || !quizData.questionData) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <p className="text-xl text-gray-500">Loading question...</p>
//       </div>
//     );
//   }

//   const { quizTitle = "Quiz", totalQuestions = 1, questionData = {} } = quizData;
//   const { questionText = "", options = [], imageUrl = null } = questionData;
//   const canSubmit = timeSinceStart >= 900;

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <nav className="bg-[#003E8A] text-white px-10 py-6 flex justify-between items-center text-4xl font-bold">
//         <h1>{quizTitle}</h1>
//       </nav>

//       <div className="flex flex-1">
//         <aside className="hidden md:block w-54 bg-gray-50 text-white p-4">
//           <div className="grid grid-cols-3 gap-2">
//             {Array.from({ length: totalQuestions }).map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleQuestionClick(index)}
//                 className={`w-12 h-12 flex items-center justify-center rounded-md text-sm font-bold cursor-pointer ${
//                   userAnswers[index]
//                     ? "bg-[#003E8A] hover:bg-[#003E8A]/90"
//                     : "bg-gray-300 hover:bg-gray-300"
//                 } ${questionIndex === index ? "ring-2 ring-[#003E8A] ring-opacity-20" : ""}`}
//               >
//                 {index + 1}
//               </button>
//             ))}
//           </div>
//         </aside>

//         <div className="flex-1">
//           <div className="max-w-6xl mx-auto mt-14 bg-white shadow-lg rounded-2xl p-6">
//             <div className="flex justify-between mb-4 text-gray-500 text-lg">
//               <span>Question {questionIndex + 1} of {totalQuestions}</span>
//               <span className="flex items-center gap-2 text-[#003E8A] font-semibold">
//                 <FaClock size={16} />
//                 {formatTime(timeLeft)}
//               </span>
//             </div>

//             <h2 className="text-3xl font-bold mb-6">{questionText}</h2>

//             {imageUrl && (
//               <div className="mb-6 relative group">
//                 <img
//                   src={imageUrl}
//                   alt="Question"
//                   className="max-w-full h-auto rounded-lg shadow-md cursor-pointer transition-all hover:opacity-95"
//                   style={{ maxHeight: "400px" }}
//                   onClick={() => setSelectedImage(imageUrl)}
//                 />
//                 <button
//                   className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
//                   onClick={() => setSelectedImage(imageUrl)}
//                 >
//                   <FaSearch className="text-gray-700" size={16} />
//                 </button>
//               </div>
//             )}

//             <div className="flex flex-col gap-5">
//               {options.length > 0 ? (
//                 options.map((option, idx) => (
//                   <label
//                     key={idx}
//                     className={`border px-4 py-4 rounded-lg cursor-pointer flex items-center gap-4 text-lg transition hover:border-[#003E8A] ${
//                       selectedOption === idx
//                         ? "border-[#003E8A] bg-[#003E8A]/5"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="option"
//                       value={idx}
//                       checked={selectedOption === idx}
//                       onChange={() => setSelectedOption(idx)}
//                       className="form-radio text-[#003E8A] scale-125 accent-[#003E8A]"
//                     />
//                     <span>{option}</span>
//                   </label>
//                 ))
//               ) : (
//                 <p className="text-red-600">No options available for this question.</p>
//               )}
//             </div>

//             <div className="flex justify-between items-center mt-10">
//               <button
//                 className={`flex items-center gap-3 px-5 py-2 rounded-md cursor-pointer text-lg font-medium ${
//                   questionIndex > 0
//                     ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 }`}
//                 onClick={handlePrevious}
//                 disabled={questionIndex === 0}
//               >
//                 <FaArrowLeft />
//                 Previous
//               </button>

//               <button
//                 className={`flex items-center gap-3 px-6 py-2 rounded-md text-lg font-semibold ${
//                   questionIndex === totalQuestions - 1
//                     ? canSubmit
//                       ? "bg-[#003E8A] text-white hover:bg-[#003E8A]/90 cursor-pointer"
//                       : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-[#003E8A] text-white hover:bg-[#003E8A]/90 cursor-pointer"
//                 }`}
//                 onClick={handleNextOrSubmit}
//                 disabled={questionIndex === totalQuestions - 1 && !canSubmit}
//               >
//                 {questionIndex === totalQuestions - 1 ? "Submit" : "Save"}
//                 {questionIndex < totalQuestions - 1 && <FaArrowRight />}
//               </button>
//             </div>

//             {error && (
//               <div className="mt-6 text-red-600 bg-red-100 p-3 rounded-md">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {selectedImage && (
//         <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
//       )}
//     </div>
//   );
// };

// export default QuizQuestion;

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
import { useQuizStore } from "../../store/quizStore";

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
  const { quizId } = useParams();
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
  } = useQuizStore();

  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimerInitialized, setIsTimerInitialized] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/quiz/question?quizId=${quizId}&questionIndex=${questionIndex}`);
        if (res.data.success) {
          setQuizData(res.data.data);
          setError("");
        } else {
          setError(res.data.message || "Failed to load question data");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load question. Please try again.");
      }
    };
    if (quizId) fetchQuestion();
  }, [quizId, questionIndex]);

  // ...existing code...

useEffect(() => {
    if (!quizData || isTimerInitialized) return;
    let timeLimitMinutes = 10;
    if (
      quizData.timeLimit !== undefined &&
      quizData.timeLimit !== null &&
      !isNaN(Number(quizData.timeLimit)) &&
      Number(quizData.timeLimit) > 0
    ) {
      timeLimitMinutes = Number(quizData.timeLimit);
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
      } else {
        savedStartTime = null;
      }
    }

    if (!savedStartTime) {
      const now = new Date();
      localStorage.setItem(`quiz-${quizId}-startTime`, now.toISOString());
    }

    setTimeLeft(remaining || 0);
    setTimeSinceStart(elapsed || 0);
    setIsTimerInitialized(true);
  }, [quizData, isTimerInitialized, quizId]);

  useEffect(() => {
    if (!isTimerInitialized || timeLeft <= 0 || isNaN(timeLeft)) return;
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
          submitQuiz();
          return { timeLeft: 0, timeSinceStart: currentElapsed + 1 };
        }

        return {
          timeLeft: currentTimeLeft - 1,
          timeSinceStart: currentElapsed + 1,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerInitialized, timeLeft]);

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`) || "[]");
    if (savedAnswers.length > 0) setUserAnswers(savedAnswers);
  }, [quizId]);

  useEffect(() => {
    localStorage.setItem(`quiz-${quizId}-questionIndex`, questionIndex);
  }, [questionIndex, quizId]);

  useEffect(() => {
    localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(userAnswers));
  }, [userAnswers, quizId]);

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`) || "[]");
    if (savedAnswers.length > 0) setUserAnswers(savedAnswers);
  }, [quizId, setUserAnswers]);

  useEffect(() => {
    localStorage.setItem(`quiz-${quizId}-questionIndex`, questionIndex);
  }, [questionIndex, quizId]);

  useEffect(() => {
    localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(userAnswers));
  }, [userAnswers, quizId]);

  useEffect(() => {
    if (!quizData) return;
    const savedAnswers = JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`) || "[]");
    if (savedAnswers[questionIndex]) {
      setSelectedOption(savedAnswers[questionIndex].selectedOption);
    } else {
      setSelectedOption(null);
    }
  }, [questionIndex, quizId, quizData, setSelectedOption]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && quizData && !isSubmitting) {
        incrementTabSwitch();
        if (tabSwitchCount === 0) {
          alert("⚠️ Don't switch the tab! The quiz will be auto-submitted if you switch again.");
        } else if (tabSwitchCount >= 1) {
          alert("You switched tabs again. The quiz will now be auto-submitted.");
          submitQuiz();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [quizData, isSubmitting, tabSwitchCount, incrementTabSwitch]);

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
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handlePrevious = () => {
    setQuestionIndex(Math.max(questionIndex - 1, 0));
  };

  const handleQuestionClick = (index) => {
    setQuestionIndex(index);
  };

  const submitQuiz = async () => {
    if (isSubmitting) return;
    if (!quizData || !quizData.questionData) {
      setError("Quiz data not loaded. Cannot submit.");
      return;
    }

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
        localStorage.removeItem(`quiz-${quizId}-startTime`);
        localStorage.removeItem(`quiz-${quizId}-questionIndex`);
        localStorage.removeItem(`quiz-${quizId}-answers`);

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
      setError(err.response?.data?.message || err.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quizData || !quizData.questionData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading question...</p>
      </div>
    );
  }

  const { quizTitle = "Quiz", totalQuestions = 1, questionData = {} } = quizData;
  const { questionText = "", options = [], imageUrl = null } = questionData;
  const canSubmit = timeSinceStart >= 900;

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
                {questionIndex === totalQuestions - 1 ? "Submit" : "Save"}
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




