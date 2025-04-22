import React, { useState } from "react";
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
  const navigate = useNavigate();

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
        console.log(" Refresh Token:", adminResponse.data.refreshToken);
        console.log(" Access Token:", adminResponse.data.accessToken);
        localStorage.setItem("refreshToken", adminResponse.data.refreshToken);
          localStorage.setItem("accessToken", adminResponse.data.accessToken);
          localStorage.setItem("adminEmail", formData.email);
        navigate("/dashboard");
        return; 
      }
    } catch (adminError) {
      try {
    
        const userResponse = await api.post("/auth/signin", formData);

        if (userResponse.data && userResponse.data.refreshToken) {
          console.log("User Refresh Token:", userResponse.data.refreshToken);
          console.log("User Access Token:", userResponse.data.accessToken);
          localStorage.setItem("refreshToken", userResponse.data.refreshToken);
          localStorage.setItem("accessToken", userResponse.data.accessToken);
          navigate("/userdashboard");
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
    <div className="relative min-h-screen bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center px-4">
      {loading && (
        <div className="fixed inset-0 bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-8 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}

      <div className={`max-w-md w-full bg-purple-950 text-white p-8 rounded-2xl shadow-xl ${loading ? "blur-sm" : ""}`}>
        <div className="flex items-center justify-center mb-6">
          <FaBrain className="text-white text-5xl mr-2" />
          <h1 className="text-white text-4xl font-bold">Quiz Master</h1>
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">Sign In</h2>
        <p className="text-center text-purple-300 mb-6 text-sm">
          Access the quiz management dashboard
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <AiOutlineMail className="absolute top-3 left-3 text-purple-300" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-purple-900 text-white py-2 px-10 rounded-md border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="relative">
            <RiLockPasswordLine className="absolute top-3 left-3 text-purple-300" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-purple-900 text-white py-2 px-10 rounded-md border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3.5 right-3 text-purple-400"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm text-purple-300">
            <label>
              <input type="checkbox" className="mr-1 accent-pink-500" />
              Remember me
            </label>
            {/* <a
              href="#"
              className="hover:underline"
              onClick={() => navigate("/forgot")}
            >
              Forgot password?
            </a> */}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md hover:opacity-90"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-purple-300 mt-2">
          Need a participant account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-white hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>

        <div className="mt-8 text-xs text-purple-400 text-center">
          © 2025 Quiz Master. All rights reserved.
          <div className="flex justify-center gap-4 mt-1">
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
