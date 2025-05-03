import React, { useState } from "react";
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../utils/axiosInstance";

export default function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: "",
    teamLeaderName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.teamName) return setErrorMsg("Team Name is required.");
    if (!formData.teamLeaderName) return setErrorMsg("Team Leader Name is required.");
    if (!formData.email) return setErrorMsg("Email Address is required.");
    if (!formData.studentId) return setErrorMsg("Student ID is required.");
    if (!formData.password) return setErrorMsg("Password is required.");
    if (!formData.confirmPassword) return setErrorMsg("Confirm Password is required.");

    if (!/^\d{6,8}$/.test(formData.studentId)) {
      return setErrorMsg("Enter a valid student ID.");
    }

    const emailStudentId = formData.email.split("@")[0];
    if (!emailStudentId.includes(formData.studentId)) {
      return setErrorMsg("Email must contain your student ID.");
    }

    if (!formData.email.endsWith("@akgec.ac.in")) {
      return setErrorMsg("Enter your college email.");
    }

    if (!formData.studentId.startsWith("24") && !formData.studentId.startsWith("23")) {
      return setErrorMsg("Leader student ID is invalid.");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return setErrorMsg(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }

    if (formData.password !== formData.confirmPassword) {
      return setErrorMsg("Passwords do not match.");
    }

    if (!captchaVerified) {
      return setErrorMsg("Please complete the reCAPTCHA verification.");
    }

    try {
      const response = await api.post("/auth/signup", formData);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/userdashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setErrorMsg = (msg) => {
    setError(msg);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center px-4">
      {loading && (
        <div className="fixed inset-0 bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-8 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-purple-950 p-6 sm:p-8 rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <h1 className="text-white text-4xl sm:text-5xl font-bold">Quiz Master</h1>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 sm:mb-4">Sign Up</h2>
        <p className="text-sm text-purple-200 text-center mb-4 sm:mb-6">
          Create your team account to participate in quizzes
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField icon={<FaUsers />} placeholder="Team Name" name="teamName" value={formData.teamName} onChange={handleChange} />
          <InputField icon={<FaUser />} placeholder="Team Leader Name" name="teamLeaderName" value={formData.teamLeaderName} onChange={handleChange} />
          <InputField icon={<FaEnvelope />} placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
          <InputField icon={<FaIdBadge />} placeholder="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} />
          <InputField icon={<FaLock />} placeholder="Password" type="password" name="password" value={formData.password} onChange={handleChange} isPassword />
          <InputField icon={<FaLock />} placeholder="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} isPassword />

          {/* 👇 ReCAPTCHA component */}
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey="6LeD9iwrAAAAALR6Hio8cGHTyM0C_4oAS5cGzXCj" // <-- Replace this
              onChange={() => setCaptchaVerified(true)}
              onExpired={() => setCaptchaVerified(false)}
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-xl hover:opacity-90 transition cursor-pointer">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ icon, placeholder, type = "text", name, value, onChange, isPassword }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300">
        {icon}
      </span>
      <input
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-purple-900 text-white py-2 px-10 rounded-md border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      {isPassword && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 cursor-pointer"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  );
}

