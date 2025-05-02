import React, { useState } from "react";
import { FaUsers, FaUser, FaEnvelope, FaIdBadge, FaLock, FaEye, FaEyeSlash, FaBrain } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    // Validate required fields
    if (!formData.teamName) {
      setError("Team Name is required.");
      setLoading(false);
      return;
    }
  
    if (!formData.teamLeaderName) {
      setError("Team Leader Name is required.");
      setLoading(false);
      return;
    }
  
    if (!formData.email) {
      setError("Email Address is required.");
      setLoading(false);
      return;
    }
  
    if (!formData.studentId) {
      setError("Student ID is required.");
      setLoading(false);
      return;
    }
  
    if (!formData.password) {
      setError("Password is required.");
      setLoading(false);
      return;
    }
  
    if (!formData.confirmPassword) {
      setError("Confirm Password is required.");
      setLoading(false);
      return;
    }
  
    // Additional validations
    if (!/^\d{6,8}$/.test(formData.studentId)) {
      setError("Enter a valid student ID.");
      setLoading(false);
      return;
    }
  
    const emailStudentId = formData.email.split("@")[0];
    if (!emailStudentId.includes(formData.studentId)) {
      setError("Email must contain your student ID.");
      setLoading(false);
      return;
    }
  
    if (!formData.email.endsWith("@akgec.ac.in")) {
      setError("Enter your college email.");
      setLoading(false);
      return;
    }
  
    if (!formData.studentId.startsWith("24") && !formData.studentId.startsWith("23")) {
      setError("Leader student ID is invalid.");
      setLoading(false);
      return;
    }
  
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      setLoading(false);
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center px-4">
      {loading && (
        <div className="fixed inset-0 bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-8 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-purple-950 p-6 sm:p-8 rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          {/* <FaBrain className="text-white text-4xl sm:text-5xl mr-2" /> */}
          <h1 className="text-white text-4xl sm:text-5xl font-bold">Quiz Master</h1>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 sm:mb-4">Sign Up</h2>
        <p className="text-sm text-purple-200 text-center mb-4 sm:mb-6">
          Create your team account to participate in quizzes
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={<FaUsers />}
            placeholder="Team Name"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
          />
          <InputField
            icon={<FaUser />}
            placeholder="Team Leader Name"
            name="teamLeaderName"
            value={formData.teamLeaderName}
            onChange={handleChange}
            required
          />
          <InputField
            icon={<FaEnvelope />}
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            icon={<FaIdBadge />}
            placeholder="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
          />
          <InputField
            icon={<FaLock />}
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isPassword
          />
          <InputField
            icon={<FaLock />}
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            isPassword
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            Sign Up
          </button>
        </form>

        {/* <p className="text-center text-purple-200 text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-white underline cursor-pointer"
          >
            Sign in
          </span>
        </p>

        <div className="text-white text-xs mt-6 text-center opacity-50">
          © 2025 Quiz Master
        </div> */}
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
