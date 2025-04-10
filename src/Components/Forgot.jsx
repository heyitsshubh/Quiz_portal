import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa'; 

const Forgot = () => {
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    alert('If this email exists in our system, a reset link has been sent to your email.');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-800 to-purple-900">
      <div className="text-center p-8 bg-purple-950 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-4">Forgot Password?</h1>
        <p className="text-sm text-white mb-6">
          Don't worry! It happens. Please enter the email address linked with your account.
        </p>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-purple-300" size={18} /> {/* Email Icon */}
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-purple-900 text-white py-2 pl-10 pr-4 rounded-md border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-md hover:opacity-90"
          >
            Send Email
          </button>
        </form>

        <p
          onClick={() => navigate('/')}
          className="text-sm text-purple-500 mt-4 cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default Forgot;