import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './Signup';
import Login from './Login';
import Forgot from './Forgot';
import Userdashboard from './Userdashboard';
import Admindashboard from './Admindashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/userdashboard" element={<Userdashboard />} />
        <Route path="/admindashboard" element={<Admindashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
