import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import HairProfile from "./pages/HairProfile";
import CurlQuiz from "./pages/CurlQuiz";
import QuizResults from "./pages/QuizResults";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";  // New route

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Router>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/hair-profile" element={<HairProfile />} />
        <Route path="/quiz" element={<CurlQuiz />} />
        <Route path="/quiz-results" element={<QuizResults />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/community/:communityName" element={<CommunityDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
