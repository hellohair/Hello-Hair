import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Basic check for a valid MongoDB ObjectId length
    if (!userId || userId.length !== 24) {
      console.error("Invalid userId:", userId);
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id === userId) {
      setIsCurrentUser(true); // Viewing your own profile
    }

    fetch(`http://localhost:5002/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          navigate("/");
        } else {
          setProfile(data);
          // Check if current user is following this profile
          if (storedUser && data.followers) {
            const isAlreadyFollowing = data.followers.some(
              (follower) => follower._id === storedUser.id
            );
            setIsFollowing(isAlreadyFollowing);
          }
        }
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [userId, navigate]);

  const handleFollow = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      alert("You need to log in first!");
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5002/api/profile/follow/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentUserId: storedUser.id }),
    });

    if (res.ok) {
      setIsFollowing(!isFollowing);
    } else {
      const data = await res.json();
      alert(data.message); // e.g., "You cannot follow yourself"
    }
  };

  const handleMessage = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      alert("You need to create an account or log in first!");
      navigate("/login");
      return;
    }
    navigate(`/messages/${profile._id}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      {profile ? (
        <>
          <h2>{profile.username}'s Profile</h2>
          <img
            src={profile.profilePicture || "default-avatar.png"}
            alt="Profile"
            width="100"
          />
          <p>{profile.bio || "No bio available"}</p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Followers:</strong> {profile.followersCount}
          </p>
          <p>
            <strong>Following:</strong> {profile.followingCount}
          </p>
          <p>
            <strong>Posts:</strong> {profile.postCount}
          </p>

          {/* If it's someone else's profile, show follow/unfollow and message buttons */}
          {!isCurrentUser && (
            <div style={{ marginBottom: "1rem" }}>
              <button onClick={handleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
              <button onClick={handleMessage} style={{ marginLeft: "1rem" }}>
                Message
              </button>
            </div>
          )}

          {/* Show Followers List */}
          <h3>Followers:</h3>
          <ul>
            {profile.followers.length > 0 ? (
              profile.followers.map((follower) => (
                <li
                  key={follower._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src="default-avatar.png"
                    alt="Profile"
                    width="40"
                    style={{ borderRadius: "50%", marginRight: "1rem" }}
                  />
                  <span>
                    {follower.username} ({follower.email})
                  </span>
                  <button
                    onClick={() => navigate(`/profile/${follower._id}`)}
                    style={{ marginLeft: "1rem" }}
                  >
                    View Profile
                  </button>
                </li>
              ))
            ) : (
              <p>No followers yet.</p>
            )}
          </ul>

          {/* Show Following List */}
          <h3>Following:</h3>
          <ul>
            {profile.following.length > 0 ? (
              profile.following.map((user) => (
                <li
                  key={user._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src="default-avatar.png"
                    alt="Profile"
                    width="40"
                    style={{ borderRadius: "50%", marginRight: "1rem" }}
                  />
                  <span>
                    {user.username} ({user.email})
                  </span>
                  <button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    style={{ marginLeft: "1rem" }}
                  >
                    View Profile
                  </button>
                </li>
              ))
            ) : (
              <p>Not following anyone yet.</p>
            )}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
