import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CommunityDetail() {
  const { communityName } = useParams();
  const [community, setCommunity] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  // Fetch community details from the backend
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/communities/${encodeURIComponent(communityName)}`);
        const data = await res.json();
        if (res.ok) {
          setCommunity(data.community);
          // Check if the current user is already a member
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            if (data.community.members.includes(user.id)) {
              setIsMember(true);
            }
          }
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching community:", error);
      }
    };
    fetchCommunity();
  }, [communityName]);

  // Handle joining community
  const joinCommunity = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    try {
      const res = await fetch("http://localhost:5002/api/communities/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ communityName, userId: user.id })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Joined community successfully!");
        setIsMember(true);
        // Optionally update localStorage user's community field
        user.community = communityName;
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error joining community:", error);
      alert("Error joining community");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to the {communityName} Community!</h2>
      {community && community.description && <p>{community.description}</p>}
      {!isMember ? (
        <button onClick={joinCommunity}>Join Community</button>
      ) : (
        <p>You are a member of this community.</p>
      )}
      {/* Optionally display the members list */}
      {community && community.members && (
        <div>
          <h3>Members:</h3>
          <ul>
            {community.members.map((memberId, idx) => (
              <li key={idx}>{memberId}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CommunityDetail;
