import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Auth/Signup";
import Login from "./Auth/Login";
import Forgot from "./Auth/Forgot";
import Userdashboard from "./User/Userdashboard";
import Admindashboard from "./Admin/Admindashboard";
import QuizCreator from "./Admin/Quizcreate";
import Resultdashboard from "./Admin/Resultboard";
import Results from "./Admin/Result";
import AdminLayout from "./Admin/AdminLayout";
import AddQuestions from "./Admin/AddQuestion";
import ViewTest from "./Admin/ViewTest";
import QuizQuestion from "./User/QuizQuestion";
import Terms from "./User/Terms";
import QuizSubmissionSuccess from "./User/QuizSubmissionSuccess";
import { QuizProvider } from "./Admin/QuizContext";

function App() {
  return (
    <QuizProvider>
    <Router>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/" element={<SignupForm />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/userdashboard" element={<Userdashboard />} />
        <Route path="/quiz/:quizId/:questionIndex" element={<QuizQuestion />} />
        <Route path="quiz-submission-success" element={<QuizSubmissionSuccess />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/dashboard/*" element={<AdminLayout />}>
        <Route index element={<Admindashboard />} /> 
        <Route path="quiz-creator" element={<QuizCreator />} />
        <Route path="add-questions" element={<AddQuestions />} />
        <Route path="view-test" element={<ViewTest />} />
        <Route path="results-dashboard" element={<Resultdashboard/>} />                
        <Route path="results/:quizId" element={<Results />} />
        </Route>
      </Routes>
    </Router>
    </QuizProvider>
  );
}

export default App;
