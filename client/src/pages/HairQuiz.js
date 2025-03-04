import React, { useState } from 'react';

const HairQuiz = () => {
  const [result, setResult] = useState(null);
  const [answers, setAnswers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/quiz/curl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Curl Quiz</h1>
      <p>Answer a few questions to discover your hair type!</p>
      {/* Replace this with your quiz form/logic */}
      <form onSubmit={handleSubmit}>
        <label>Question 1: Choose an option (dummy example)</label>
        <select onChange={(e) => setAnswers([e.target.value])}>
          <option value="option1">Option 1 (Straight?)</option>
          <option value="option2">Option 2 (Curly?)</option>
        </select>
        <br />
        <button type="submit">Submit Quiz</button>
      </form>
      {result && (
        <div>
          <h3>Result: {result.hairType}</h3>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default HairQuiz;
