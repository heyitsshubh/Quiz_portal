import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom"; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-purple-950 text-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-1"> Sign In</h2>
        <p className="text-center text-purple-300 mb-6 text-sm">Access the quiz management dashboard</p>

        <form className="space-y-4">
          <div className="relative">
            <AiOutlineMail className="absolute top-3.5 left-3 text-purple-400" size={20} />
            <input
              type="email"
              placeholder="Admin Email"
              className="w-full bg-purple-900 text-white py-2 px-10 rounded-md border border-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="relative">
            <RiLockPasswordLine className="absolute top-3.5 left-3 text-purple-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-purple-900 text-white py-2 px-10 rounded-md border border-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
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
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md hover:opacity-90"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-purple-300 mt-2">
            Need a participant account?{" "}
            <span
              onClick={() => navigate("/signup")} 
              className="text-white hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </form>

        <div className="mt-8 text-xs text-purple-400 text-center">
          © 2025 Quiz Master. All rights reserved.
          <div className="flex justify-center gap-4 mt-1">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Help</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
