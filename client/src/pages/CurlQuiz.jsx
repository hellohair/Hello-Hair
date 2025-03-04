import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CurlQuiz() {
  const [userId, setUserId] = useState(null);
  const [quizName, setQuizName] = useState("");
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, [navigate]);

  const questions = [
    {
      id: "q1",
      question: "After showering, how does your hair typically behave?",
      choices: [
        "Dries quickly and stays flat",
        "Dries with slight waves",
        "Forms ringlets or bouncy curls",
        "Shrinks significantly into tight coils"
      ]
    },
    {
      id: "q2",
      question: "How often do you use conditioner?",
      choices: [
        "Rarely",
        "Sometimes",
        "Every wash",
        "Deep conditioning frequently"
      ]
    },
    {
      id: "q3",
      question: "When you run your fingers through your hair, it feels:",
      choices: [
        "Smooth",
        "Somewhat dry",
        "Frequently tangled",
        "Very dry and prone to breakage"
      ]
    }
  ];

  const handleChange = (questionId, choiceIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }));
  };

  // Compute a result based on the quiz answers (same logic)
  const computeResult = () => {
    let sum = 0;
    Object.values(answers).forEach((val) => {
      sum += parseInt(val, 10);
    });

    if (sum <= 2) {
      return { result: "Your hair is likely straight or slightly wavy.", community: "Straight & Sleek Community" };
    } else if (sum <= 5) {
      return { result: "Your hair is likely wavy to curly.", community: "Wavy Wonders" };
    } else {
      return { result: "Your hair is likely very curly or coily.", community: "Curly Queens" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quizName.trim() === "") {
      alert("Please name your quiz.");
      return;
    }
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions.");
      return;
    }

    const { result, community } = computeResult();
    const payload = {
      userId,
      quizName,
      answers,
      result,
      community
    };

    try {
      const res = await fetch("http://localhost:5002/api/curl-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Curl Quiz submitted!");

        // ✅ Update localStorage user object with last quiz result and assigned community
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.lastQuizResult = result;
          userObj.community = community;
          localStorage.setItem("user", JSON.stringify(userObj));
        }

        // ✅ Navigate to Quiz Results page with result and assigned community
        navigate("/quiz-results", { state: { result, quizName, community } });
      } else {
        alert(data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Curl Quiz</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Name your quiz:
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} style={{ marginBottom: "1rem" }}>
            <h4>{q.question}</h4>
            {q.choices.map((choice, idx) => (
              <label key={idx} style={{ display: "block", marginLeft: "1.5rem" }}>
                <input
                  type="radio"
                  name={q.id}
                  value={idx}
                  checked={answers[q.id] === idx}
                  onChange={() => handleChange(q.id, idx)}
                />
                {choice}
              </label>
            ))}
          </div>
        ))}
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
}

export default CurlQuiz;
