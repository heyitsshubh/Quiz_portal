import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "./axiosInstance"; // Your API instance

const QuizResultsDashboard = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [scoreData, setScoreData] = useState([]);
  const [teamResults, setTeamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const quizId = localStorage.getItem("lastQuizId");

    if (!quizId) {
      setError("Quiz ID not found. Please make sure a quiz has been submitted.");
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await api.get(`/admin/dashboard/results?_id=${quizId}`);
        const data = response.data;

        if (data.success) {
          setQuizTitle(data.quizTitle);

          const distribution = data.scoreDistribution;
          const chartData = Object.keys(distribution).map((key) => ({
            name: key,
            teams: distribution[key],
            fill: distribution[key] > 0 ? "#fecaca" : "#e5e7eb",
          }));
          setScoreData(chartData);
          setTeamResults(data.teamResults);
        } else {
          setError("Failed to fetch results.");
        }
      } catch (err) {
        console.error("Error fetching results:", err.response?.data || err);
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch the quiz results based on the stored quiz ID
    fetchResults();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchResults, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (loading) {
    return <p className="text-center text-gray-600">Loading results...</p>;
  }

  // Error state
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-purple-800 mb-6">{quizTitle} Results Dashboard</h1>
      <p className="text-gray-600 mb-8">View team performance and score distribution</p>
      <div className="grid grid-cols-1 md:grid-rows-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Score Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, "dataMax + 1"]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                  formatter={(value) => [`${value} teams`, "Count"]}
                  labelFormatter={(label) => `Score Range: ${label}`}
                />
                <Bar dataKey="teams" name="Number of teams" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Team Results</h2>
          <p className="text-sm text-gray-600 mb-4">Detailed performance of each team</p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TEAM NAME
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FINAL SCORE
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TIME TAKEN
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamResults.map((team, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {team.teamName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">
                      {team.finalScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {team.timeTaken}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsDashboard;
