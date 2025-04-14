import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Auth/Signup";
import Login from "./Auth/Login";
import Forgot from "./Auth/Forgot";
import Userdashboard from "./Userdashboard";
import Admindashboard from "./Admin/Admindashboard";
import QuizCreator from "./Admin/Quizcreate";
// import ResultsDashboard from "./ResultsDashboard";
import AdminLayout from "./Admin/AdminLayout";
import AddQuestions from "./Admin/AddQuestion";
import ViewTest from "./Admin/ViewTest";
import QuizQuestion from "./QuizQuestion";
import { QuizProvider } from "./Admin/QuizContext";

function App() {
  return (
    <QuizProvider>
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/userdashboard" element={<Userdashboard />} />
        <Route path="quiz/:id" element={<QuizQuestion />} />
        <Route path="/dashboard/*" element={<AdminLayout />}>
        <Route index element={<Admindashboard />} /> 
        <Route path="quiz-creator" element={<QuizCreator />} />
        <Route path="add-questions" element={<AddQuestions />} />
        <Route path="view-test" element={<ViewTest />} />
        {/* <Route path="results-dashboard" element={<ResultsDashboard />} /> */}
        </Route>
      </Routes>
    </Router>
    </QuizProvider>
  );
}

export default App;
