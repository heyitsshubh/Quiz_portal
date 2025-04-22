import { FaClock, FaCheckCircle, FaSyncAlt, FaArrowLeft, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quiz = location.state?.quiz; // Retrieve quiz object from state

  // Debugging: Log the quiz object
  console.log("Quiz object:", quiz);

  const handleStartQuiz = () => {
    if (quiz && quiz._id) {
      navigate(`/quiz/${quiz._id}/0`);
    } else {
      console.error("Quiz ID is missing");
      alert("Quiz ID is not available. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-800 to-purple-900 flex flex-col items-center px-4 py-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-red-500 hover:text-red-500 mb-2 self-start cursor-pointer"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-4xl text-center flex flex-col justify-between">
        <div>
          <div className="text-4xl text-blue-500 mb-2">📋</div>
          <h1 className="text-xl font-bold mb-2">Quiz Rules</h1>
          <p className="text-gray-600 mb-4">
            Please read these rules carefully before starting the quiz
          </p>

          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3 bg-blue-100 p-3 rounded-lg">
              <FaClock className="text-blue-500 mt-1" />
              <div>
                <p className="font-semibold">Time Limit</p>
                <p className="text-sm">{quiz?.timeLimit || "N/A"} minutes</p>
              </div>
            </li>

            <li className="flex items-start gap-3 bg-green-100 p-3 rounded-lg">
              <FaCheckCircle className="text-green-500 mt-1" />
              <div>
                <p className="font-semibold">No Negative Marking</p>
                <p className="text-sm">Don't worry about wrong answers – there's no penalty for incorrect responses.</p>
              </div>
            </li>

            <li className="flex items-start gap-3 bg-purple-100 p-3 rounded-lg">
              <FaSyncAlt className="text-purple-500 mt-1" />
              <div>
                <p className="font-semibold">One Attempt Only</p>
                <p className="text-sm">You can attempt the quiz only once. Make sure you're well prepared.</p>
              </div>
            </li>

            <li className="flex items-start gap-3 bg-orange-100 p-3 rounded-lg">
              <FaExclamationCircle className="text-orange-500 mt-1" />
              <div>
                <p className="font-semibold">Auto-Submit</p>
                <p className="text-sm">The quiz will be automatically submitted when the time limit expires.</p>
              </div>
            </li>

            <li className="flex items-start gap-3 bg-gray-100 p-3 rounded-lg">
              <FaInfoCircle className="text-gray-500 mt-1" />
              <div>
                <p className="font-semibold">Additional Information</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Ensure you have a stable internet connection</li>
                  <li>Don’t refresh or close the browser during the quiz</li>
                  <li>You can review your answers before final submission</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <button
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold cursor-pointer rounded-xl hover:opacity-90 transition w-full"
          onClick={handleStartQuiz}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Terms;
