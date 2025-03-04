import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  // Optional: You can refresh user state on mount if needed.
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav style={{ padding: "1rem", background: "#eee", display: "flex", justifyContent: "space-between" }}>
      <div>
        <Link to="/">Home</Link>
        <Link to="/quiz" style={{ marginLeft: "1rem" }}>Curl Quiz</Link>
        <Link to="/communities" style={{ marginLeft: "1rem" }}>Communities</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ fontWeight: "bold" }}>Signed in as: {user.username || user.email}</span>
            <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
          </>
        ) : (
          <>
            <span>Not signed in</span>
            <Link to="/register" style={{ marginLeft: "1rem" }}>Register</Link>
            <Link to="/login" style={{ marginLeft: "1rem" }}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
