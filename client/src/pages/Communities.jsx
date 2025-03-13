// src/pages/Communities.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Communities() {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [otherCommunities, setOtherCommunities] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Fetch all communities
    fetch("http://localhost:5002/api/communities")
      .then((res) => res.json())
      .then((data) => {
        if (!currentUser) {
          // If not logged in, treat all as "other"
          setOtherCommunities(data);
          return;
        }
        // Separate communities into joined and not joined
        const joined = data.filter((c) =>
          c.members.includes(currentUser.id)
        );
        const others = data.filter((c) =>
          !c.members.includes(currentUser.id)
        );
        setJoinedCommunities(joined);
        setOtherCommunities(others);
      })
      .catch((err) => console.error("Error fetching communities:", err));
  }, [currentUser]);

  // Join community using communityId
  const handleJoin = async (communityId) => {
    if (!token) {
      alert("You need to log in first!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5002/api/communities/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          communityId,
          userId: currentUser.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Joined community successfully!");
        window.location.reload(); // Alternatively, update state without reload
      } else {
        alert(data.message || "Error joining community");
      }
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Communities</h1>

      {/* Section: Your Hair Community */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Hair Community</h2>
        <div>
          {joinedCommunities.length === 0 ? (
            <p style={{ fontStyle: "italic" }}>
              You haven't joined any communities yet.
            </p>
          ) : (
            joinedCommunities.map((community) => (
              <div key={community._id} style={styles.communityCard}>
                <div style={styles.communityInfo}>
                  <h3>{community.name}</h3>
                  <p style={{ color: "#777" }}>{community.description}</p>
                  <p style={styles.communityStats}>
                    <span>{community.type || "Public"} Group</span> &middot;{" "}
                    <span>{community.members.length} members</span>
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/community/${community._id}`)}
                  style={styles.joinButton}
                >
                  Jump in
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Section: Discover More Hair Stories */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Discover More Hair Stories</h2>
        <div>
          {otherCommunities.map((community) => (
            <div key={community._id} style={styles.communityCard}>
              <div style={styles.communityInfo}>
                <h3>{community.name}</h3>
                <p style={{ color: "#777" }}>{community.description}</p>
                <p style={styles.communityStats}>
                  <span>{community.type || "Public"} Group</span> &middot;{" "}
                  <span>{community.members.length} members</span>
                </p>
              </div>
              <button
                onClick={() => handleJoin(community._id)}
                style={styles.joinButton}
              >
                Join Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Communities;

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  communityCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "1rem",
    marginBottom: "1rem",
  },
  communityInfo: {
    maxWidth: "70%",
  },
  communityStats: {
    color: "#555",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
  },
  joinButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
};
