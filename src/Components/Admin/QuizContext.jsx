import React, { createContext, useState, useContext } from "react";

const QuizContext = createContext();

export const useQuizContext = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]); 

  const addQuiz = (quiz) => {
    setQuizzes((prevQuizzes) => [...prevQuizzes, quiz]);
  };

  return (
    <QuizContext.Provider value={{ quizzes, addQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};