import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const QuizResultsDashboard = () => {
  // Data for the bar chart
  const scoreData = [
    { name: "0-50%", teams: 0, fill: "#fecaca" }, // red-200
    { name: "51-60%", teams: 4, fill: "#fed7aa" }, // orange-200
    { name: "61-70%", teams: 2, fill: "#fef08a" }, // yellow-200
    { name: "71-80%", teams: 0, fill: "#e5e7eb" }, // gray-200
    { name: "81-90%", teams: 0, fill: "#e5e7eb" }, // gray-200
    { name: "91-100%", teams: 0, fill: "#e5e7eb" }, // gray-200
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-purple-800 mb-6">Quiz Results Dashboard</h1>
      <p className="text-gray-600 mb-8">View team performance and score distribution</p>
      <div className="grid grid-cols-1 md:grid-rows-2 gap-8">
        {/* Score Distribution Section with Recharts BarChart */}
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
                <XAxis type="number" domain={[0, 'dataMax + 1']} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip 
                  formatter={(value) => [`${value} teams`, "Count"]}
                  labelFormatter={(label) => `Score Range: ${label}`}
                />
                <Bar 
                  dataKey="teams" 
                  name="Number of teams"
                  radius={[0, 4, 4, 0]}
                >
                  {scoreData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Team Results Section (unchanged) */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Team Results</h2>
          <p className="text-sm text-gray-600 mb-4">Detailed performance of each team</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEAM NAME</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FINAL SCORE</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIME TAKEN</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Alpha Team</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">92%</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">15:30</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Beta Squad</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">87%</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Delegated by Reading</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Gamma Group</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">76%</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">20:12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsDashboard;