import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useQuizContext } from "./QuizContext"; 
import { FaClock, FaPlus, FaEye } from "react-icons/fa";

const Admindashboard = () => {
  const { quizzes } = useQuizContext(); 
  const navigate = useNavigate(); 

  const handleAddQuestion = (quizId) => {
    navigate(`/dashboard/add-questions`, { state: { quizId } }); 
  };

  return (
    <div className="p-6 bg-gray-100 max-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Manage your quizzes</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizzes.map((quiz, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {quiz.quizTitle}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{quiz.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <FaClock className="mr-2" />
              {quiz.timeLimit} minutes
            </div>
            <p className="text-sm text-gray-500 mb-4">Difficulty: {quiz.difficulty}</p>

            <div className="flex gap-3">
              <button
                className="bg-purple-600 text-white px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-purple-700"
                onClick={() => handleAddQuestion(quiz.id)} 
              >
                <FaPlus /> Add Question
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-gray-100">
                <FaEye /> View Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

 export default Admindashboard;



// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { FaClock, FaPlus, FaEye } from "react-icons/fa";

// const Admindashboard = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const response = await axiosInstance.get("/admin/dashboard/quiz/list");
//         setQuizzes(response.data.quizzes);
//       } catch (err) {
//         console.error("Error fetching quizzes:", err.response?.data || err);
//         setError("Failed to load quizzes. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuizzes();
//   }, []);

//   const handleAddQuestion = (quizId) => {
//     navigate(`/dashboard/add-questions`, { state: { quizId } });
//   };

//   if (loading) {
//     return <p className="text-center text-gray-600">Loading quizzes...</p>;
//   }

//   if (error) {
//     return <p className="text-center text-red-500">{error}</p>;
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
//       <p className="text-gray-600 mb-6">Manage your quizzes</p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         {quizzes.map((quiz, idx) => (
//           <div key={idx} className="bg-white p-5 rounded-xl shadow">
//             <h3 className="text-lg font-semibold text-gray-800 mb-1">
//               {quiz.quizTitle}
//             </h3>
//             <p className="text-sm text-gray-500 mb-2">{quiz.description}</p>
//             <div className="flex items-center text-sm text-gray-500 mb-2">
//               <FaClock className="mr-2" />
//               {quiz.timeLimit} minutes
//             </div>
//             <p className="text-sm text-gray-500 mb-4">Difficulty: {quiz.difficulty}</p>

//             <div className="flex gap-3">
//               <button
//                 className="bg-purple-600 text-white px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-purple-700"
//                 onClick={() => handleAddQuestion(quiz.id)}
//               >
//                 <FaPlus /> Add Question
//               </button>
//               <button className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md flex items-center gap-2 hover:bg-gray-100">
//                 <FaEye /> View Test
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Admindashboard;