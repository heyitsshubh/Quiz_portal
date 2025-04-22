import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-purple-600 p-4">
      <div className="max-w-3xl mx-auto bg-purple-300 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Terms and Conditions</h1>
        <p className="text-black mb-3">
          Welcome to Quiz Master! By participating in our quizzes, you agree to the following terms
          and conditions. Please read them carefully before proceeding.
        </p>

        <h2 className="text-lg font-semibold text-purple-600 mb-3">1. Eligibility</h2>
        <p className="text-black mb-3">
          Participants must be registered users of Quiz Master. By registering, you confirm that the
          information provided is accurate and up-to-date.
        </p>

        <h2 className="text-lg font-semibold text-purple-600 mb-3">2. Fair Play</h2>
        <p className="text-black mb-3">
          All participants are expected to play fairly. Any form of cheating, including but not
          limited to using unauthorized resources or sharing answers, is strictly prohibited.
        </p>

        <h2 className="text-lg font-semibold text-purple-600 mb-3">3. Privacy</h2>
        <p className="text-black mb-3">
          Your personal information will be handled in accordance with our Privacy Policy. By
          participating, you consent to the collection and use of your data for quiz-related
          purposes.
        </p>

        <h2 className="text-lg font-semibold text-purple-600 mb-3">4. Intellectual Property</h2>
        <p className="text-black mb-3">
          All quiz content, including questions, answers, and designs, is the intellectual property
          of Quiz Master. Unauthorized reproduction or distribution is prohibited.
        </p>

        <h2 className="text-lg font-semibold text-purple-600 mb-3">5. Disqualification</h2>
        <p className="text-black mb-3">
          Quiz Master reserves the right to disqualify any participant found violating these terms
          and conditions or engaging in unethical behavior.
        </p>

        <h2 className="text-lg font-semibold text-purple-600 mb-3">6. Changes to Terms</h2>
        <p className="text-black mb-3">
          Quiz Master reserves the right to update these terms and conditions at any time. Changes
          will be communicated through our platform.
        </p>

        <h2 className="text-lg font-semibold text-purple-600 mb-3">7. Contact Us</h2>
        <p className="text-black mb-3">
          If you have any questions or concerns about these terms, please contact us at{" "}
          <a href="mailto:support@quizmaster.com" className="text-purple-600 underline">
            support@quizmaster.com
          </a>
          .
        </p>

        <div className="mt-4">
          <button
            onClick={() => window.history.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-md font-medium"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;