import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, quizName, community } = location.state || {};

  if (!result) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>No quiz result found.</h2>
        <button onClick={() => navigate("/quiz")}>Take the Curl Quiz</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Curl Quiz Results</h2>
      {quizName && <h3>Quiz Name: {quizName}</h3>}
      <p>{result}</p>
      {community && <p>Your assigned community: <strong>{community}</strong></p>}
      <button onClick={() => navigate("/communities")}>Go to Communities</button>
    </div>
  );
}

export default QuizResults;
