import React from "react";
import { Link } from "react-router-dom";

function Communities() {
  // Hardcoded list of communities for now
  const communitiesList = [
    "Straight & Sleek Community",
    "Wavy Wonders",
    "Curly Queens",
    "General Hair Community"
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Communities</h2>
      <ul>
        {communitiesList.map((comm, idx) => (
          <li key={idx}>
            <Link to={`/community/${encodeURIComponent(comm)}`}>{comm}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Communities;
