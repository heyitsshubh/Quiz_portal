import React, { createContext, useState, useContext } from "react";

// Create the context
const QuizContext = createContext();

// Custom hook to use the QuizContext
export const useQuizContext = () => useContext(QuizContext);

// Provider component
export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]); // Store all quizzes

  const addQuiz = (quiz) => {
    setQuizzes((prevQuizzes) => [...prevQuizzes, quiz]);
  };

  return (
    <QuizContext.Provider value={{ quizzes, addQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};