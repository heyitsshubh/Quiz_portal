import React from "react";

const SuccessBox = ({ message }) => {
  return (
    <div className="fixed top-4 right-4 bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded-md shadow-md">
      <h2 className="text-lg font-semibold">Success</h2>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default SuccessBox;