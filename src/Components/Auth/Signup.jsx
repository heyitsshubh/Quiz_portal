import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaUser,
  FaEnvelope,
  FaIdBadge,
  // FaLock,
  // FaEye,
  // FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import ReCAPTCHA from "react-google-recaptcha";
import api from "../../utils/axiosInstance";
import bgquiz from "../../assets/bgquiz.jpeg";

export default function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamLeaderName: "",
    email: "",
    studentId: "",
    // password: "",
    // confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [captchaVerified, setCaptchaVerified] = useState(false);
  // const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setErrorMsg = (msg) => {
  setLoading(false);
  toast.error(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

  if (!formData.teamLeaderName) return setErrorMsg("Name is required.");
    if (!formData.email) return setErrorMsg("Email Address is required.");
    if (!formData.studentId) return setErrorMsg("Student ID is required.");
    // if (!formData.password) return setErrorMsg("Password is required.");
    // if (!formData.confirmPassword) return setErrorMsg("Confirm Password is required.");

    if (!/^\d{6,8}(-d)?$/.test(formData.studentId)) {
      return setErrorMsg("Enter a valid student ID.");
    }

    const emailStudentId = formData.email.split("@")[0];
    const studentIdPattern = formData.studentId.replace(/-d$/, "");
    if (!emailStudentId.includes(studentIdPattern)) {
      return setErrorMsg("Email must contain your student ID.");
    }

    if (!formData.email.endsWith("@akgec.ac.in")) {
      return setErrorMsg("Enter your college email.");
    }

    if (!formData.studentId.startsWith("24") && !formData.studentId.startsWith("23")) {
      return setErrorMsg("Leader student ID is invalid.");
    }

    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(formData.password)) {
    //   return setErrorMsg(
    //     "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    //   );
    // }

    // if (formData.password !== formData.confirmPassword) {
    //   return setErrorMsg("Passwords do not match.");
    // }

    // if (!captchaVerified || !recaptchaToken) {
    //   return setErrorMsg("Please complete the reCAPTCHA verification.");
    // }

    try {
      const response = await api.post("/auth/signup", {
        ...formData,
        // recaptchaToken,
      });

      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("accessToken", response.data.accessToken);

      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }

  toast.success("Signup successful!");
setTimeout(() => {
  navigate("/userdashboard", { replace: true });
}, 1200);
    } catch (err) {
  const errorMsg = err.response?.data?.message || "Signup failed. Please try again.";
  // setError(errorMsg);
  toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-2"
      style={{
        backgroundImage: `url(${bgquiz})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      {loading && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 bg-black/30">
          <div className="w-16 h-16 border-8 border-gray-300 border-t-[#003E8A] rounded-full animate-spin"></div>
        </div>
      )}

  <div className="bg-[#003E8A]/45 p-10 rounded-xl w-full max-w-md shadow-2xl mx-auto flex flex-col justify-center items-center" style={{ aspectRatio: '1 / 1', minHeight: '500px', minWidth: '500px' }}>
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <h1 className="text-white text-4xl sm:text-5xl font-bold">Quiz Master</h1>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 sm:mb-4">
          Sign Up
        </h2>
        <p className="text-sm text-blue-200 text-center mb-4 sm:mb-6">
          Create your team account to participate in quizzes
        </p>

        {error && (
          <p className="text-red-300 text-center mb-4 bg-red-900/30 p-2 rounded">
            {error}
          </p>
        )}

  <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <InputField
            icon={<FaUsers />}
            placeholder="Name"
            name="teamLeaderName"
            value={formData.teamLeaderName}
            onChange={handleChange}
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
          {/* <InputField
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
          /> */}

          {/* <div className="sm:col-span-2 flex justify-center mt-2">
            <ReCAPTCHA
              sitekey="6LdTDS0rAAAAABU0t5ADxll6NJ3ZT03f_wPaLesv"
              onChange={(token) => {
                setCaptchaVerified(true);
                setRecaptchaToken(token);
              }}
              onExpired={() => {
                setCaptchaVerified(false);
                setRecaptchaToken("");
              }}
              theme="dark"
            />
          </div> */}

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="relative w-full mt-2 group overflow-hidden bg-gradient-to-r from-sky-400 to-[#003E8A] hover:from-sky-500 hover:to-[#003E8A] text-white font-bold py-4 rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-sky-500/20"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/30 to-transparent transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"></span>
              <span className="relative flex items-center justify-center gap-2">
                <span className="text-lg group-hover:mr-1 transition-all duration-300">
                  Sign Up
                </span>
                <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({
  icon,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  isPassword,
}) {
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