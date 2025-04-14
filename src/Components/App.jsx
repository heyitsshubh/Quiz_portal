import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Auth/Signup";
import Login from "./Auth/Login";
import Forgot from "./Auth/Forgot";
import Userdashboard from "./Userdashboard";
import Admindashboard from "./Admindashboard";
import QuizCreator from "./Quizcreate";
// import ResultsDashboard from "./ResultsDashboard";
// import QuizControl from "./QuizControl";
import AdminLayout from "./AdminLayout";
import AddQuestions from "./AddQuestion";
import ViewTest from "./ViewTest";
import { QuizProvider } from "./QuizContext";

function App() {
  return (
    <QuizProvider>
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/userdashboard" element={<Userdashboard />} />
        <Route path="/dashboard/*" element={<AdminLayout />}>
        <Route index element={<Admindashboard />} /> 
        <Route path="quiz-creator" element={<QuizCreator />} />
        <Route path="add-questions" element={<AddQuestions />} />
        <Route path="view-test" element={<ViewTest />} />
          {/* <Route path="results-dashboard" element={<ResultsDashboard />} />
          <Route path="quiz-control" element={<QuizControl />} /> */}
        </Route>
      </Routes>
    </Router>
    </QuizProvider>
  );
}

export default App;
