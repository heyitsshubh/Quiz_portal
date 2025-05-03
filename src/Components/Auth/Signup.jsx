import React, { useState } from "react";
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../utils/axiosInstance";
import conatus from "../../assets/Conats.png";

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
  const [recaptchaToken, setRecaptchaToken] = useState(""); // ✅ Token state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setErrorMsg = (msg) => {
    setError(msg);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validations
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

    if (!captchaVerified || !recaptchaToken) {
      return setErrorMsg("Please complete the reCAPTCHA verification.");
    }

    try {
      const response = await api.post("/auth/signup", {
        ...formData,
        recaptchaToken, // ✅ Sending token
      });

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
    <div className="relative min-h-screen bg-gradient-to-br from-[#003E8A] to-[#003E8A]/90 flex flex-col items-center justify-center px-4">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10 flex items-center">
        <div className="h-12 w-12 sm:h-30 sm:w-40 flex items-center justify-center shadow-lg mr-3 overflow-hidden">
          <img
            src={conatus}
            alt="Quiz Master Logo"
            className="h-full w-full object-contain p-1"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-8 border-gray-300 border-t-[#003E8A] rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-[#003E8A]/95 p-6 sm:p-8 rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <h1 className="text-white text-4xl sm:text-5xl font-bold">Quiz Master</h1>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 sm:mb-4">Sign Up</h2>
        <p className="text-sm text-blue-200 text-center mb-4 sm:mb-6">
          Create your team account to participate in quizzes
        </p>

        {error && <p className="text-red-300 text-center mb-4 bg-red-900/30 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField icon={<FaUsers />} placeholder="Team Name" name="teamName" value={formData.teamName} onChange={handleChange} />
          <InputField icon={<FaUser />} placeholder="Team Leader Name" name="teamLeaderName" value={formData.teamLeaderName} onChange={handleChange} />
          <InputField icon={<FaEnvelope />} placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
          <InputField icon={<FaIdBadge />} placeholder="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} />
          <InputField icon={<FaLock />} placeholder="Password" type="password" name="password" value={formData.password} onChange={handleChange} isPassword />
          <InputField icon={<FaLock />} placeholder="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} isPassword />

          <div className="flex justify-center mt-6">
            <ReCAPTCHA
              sitekey="6LdTDS0rAAAAABU0t5ADxll6NJ3ZT03f_wPaLesv"
              onChange={(token) => {
                setCaptchaVerified(true);
                setRecaptchaToken(token); // ✅ Capture token
              }}
              onExpired={() => {
                setCaptchaVerified(false);
                setRecaptchaToken(""); // ❌ Token expired
              }}
              theme="dark"
            />
          </div>

          <button 
            type="submit" 
            disabled={!captchaVerified}
            className={`relative w-full mt-4 group overflow-hidden ${
              captchaVerified 
                ? "bg-gradient-to-r from-sky-400 to-[#003E8A] hover:from-sky-500 hover:to-[#003E8A]" 
                : "bg-gray-600"
            } text-white font-bold py-4 rounded-xl transition-all duration-300 ${
              captchaVerified ? "cursor-pointer shadow-lg hover:shadow-sky-500/20" : "opacity-60 cursor-not-allowed"
            }`}
          >
            {captchaVerified && (
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/30 to-transparent transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"></span>
            )}
            
            <span className="relative flex items-center justify-center gap-2">
              <span className={`text-lg ${captchaVerified ? "group-hover:mr-1 transition-all duration-300" : ""}`}>Sign Up</span>
              {captchaVerified && <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ icon, placeholder, type = "text", name, value, onChange, isPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 z-10">
        {icon}
      </span>
      <input
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-[#003E8A]/40 text-white py-2.5 px-10 rounded-lg border ${
          isFocused ? "border-white border-2" : "border-white/50"
        } focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-blue-200/70`}
      />
      {isPassword && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 cursor-pointer z-10"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  );
}

