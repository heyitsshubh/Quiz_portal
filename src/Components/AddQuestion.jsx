import React, { useState } from 'react';

const AddQuestions = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [explanation, setExplanation] = useState('');

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      question,
      options,
      correctOption,
      explanation,
    };
    console.log('New Question:', newQuestion);
    // Reset form
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOption(0);
    setExplanation('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">Quiz Creator</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Question</h2>

        <label className="block text-sm font-medium mb-1">Question Type</label>
        <select className="w-full mb-4 p-2 border rounded-md">
          <option>Multiple Choice</option>
        </select>

        <label className="block text-sm font-medium mb-1">Question</label>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows="3"
          placeholder="Enter your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <label className="block text-sm font-medium mb-2">Options</label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="radio"
              name="correctOption"
              className="mr-2 accent-purple-600"
              checked={correctOption === idx}
              onChange={() => setCorrectOption(idx)}
                  
            />
            <input
              type="text"
              className="flex-1 p-2 border rounded-md"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
          </div>
        ))}

        <label className="block text-sm font-medium mt-4 mb-1">Explanation (Optional)</label>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows="2"
          placeholder="Explain why this answer is correct (optional)"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />

        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md"
          onClick={handleAddQuestion}
        >
          + Add Question
        </button>
      </div>
    </div>
  );
};

export default AddQuestions;
