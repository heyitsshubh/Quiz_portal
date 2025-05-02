import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaBrain } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance"; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animateLogo, setAnimateLogo] = useState(false);
  const navigate = useNavigate();

  // Add logo animation on load
  useEffect(() => {
    setTimeout(() => setAnimateLogo(true), 300);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const adminResponse = await api.post("/admin/login", formData);

      if (adminResponse.data && adminResponse.data.refreshToken) {
        localStorage.setItem("refreshToken", adminResponse.data.refreshToken);
        localStorage.setItem("accessToken", adminResponse.data.accessToken);
        localStorage.setItem("adminEmail", formData.email);
        localStorage.setItem("role", "admin"); // Store role
        navigate("/dashboard", { replace: true });
        return; 
      }
    } catch (adminError) {
      try {
        const userResponse = await api.post("/auth/signin", formData);

        if (userResponse.data && userResponse.data.refreshToken) {
          localStorage.setItem("refreshToken", userResponse.data.refreshToken);
          localStorage.setItem("accessToken", userResponse.data.accessToken);
          localStorage.setItem("role", "user"); // Store role
          navigate("/userdashboard", { replace: true });
          return;
        }
      } catch (userError) {
        setError(userError.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center px-4 py-12">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      )}

      <div className={`w-full max-w-md bg-purple-950 text-white p-8 rounded-3xl shadow-2xl transition-all duration-300 ${
        animateLogo ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}>
        {/* Logo and header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-md"></div>
            <FaBrain className={`text-white text-5xl mr-2 transition-transform duration-700 ${
              animateLogo ? "transform rotate-0" : "transform rotate-180"
            }`} />
            <h1 className="text-white text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Quiz Master
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-center">Sign In</h2>
          <p className="text-center text-purple-300 mt-1 text-sm">
            Access the quiz management dashboard
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-900 bg-opacity-30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <AiOutlineMail className="absolute top-3 left-3 text-purple-400 group-focus-within:text-purple-300 transition-colors" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-purple-900/50 text-white py-3 px-10 rounded-xl border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-purple-400"
              required
            />
          </div>

          <div className="relative group">
            <RiLockPasswordLine className="absolute top-3 left-3 text-purple-400 group-focus-within:text-purple-300 transition-colors" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-purple-900/50 text-white py-3 px-10 rounded-xl border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-purple-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-purple-400 hover:text-purple-200 transition-colors"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm text-purple-300">
            <label className="flex items-center cursor-pointer group">
              <input type="checkbox" className="mr-2 accent-pink-500 h-4 w-4" />
              <span className="group-hover:text-purple-200 transition-colors">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-95 active:opacity-90 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-md"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-purple-300 mt-6">
          Need a participant account?{" "}
          <span
            onClick={() => !loading && navigate("/signup")}
            className="text-white hover:text-pink-300 underline cursor-pointer font-medium transition-colors"
          >
            Sign up
          </span>
        </p>

        <div className="mt-10 text-xs text-purple-400 text-center">
          © 2025 Quiz Master. All rights reserved.
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
