import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  

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
        <Link to="/friends" style={{ marginLeft: "1rem" }}>Friends</Link>
        {/* Add the Messaging tab */}
        <Link to="/messages" style={{ marginLeft: "1rem" }}>Messages</Link>
      </div>
      <div>
        {user ? (
          <>
            <Link to={`/profile/${user.id}`} style={{ marginRight: "1rem" }}>Profile</Link>
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
