// src/pages/CommunityDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewPostModal from "../components/NewPostModal";

/** 
 * Detect if a link is a YouTube watch/short link 
 */
function isYouTubeLink(url) {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
}

/**
 * Convert watch/short link to embed link:
 * e.g. https://youtu.be/XYZ => https://www.youtube.com/embed/XYZ
 * e.g. https://www.youtube.com/watch?v=XYZ => https://www.youtube.com/embed/XYZ
 */
function convertToYouTubeEmbed(originalUrl) {
  try {
    const parsed = new URL(originalUrl);

    // If short link: https://youtu.be/<id>
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1); // remove leading '/'
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If normal watch link: https://www.youtube.com/watch?v=<id>
    const videoId = parsed.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Fallback if it's already an embed link or unrecognized
    return originalUrl;
  } catch (err) {
    console.error("Error converting YouTube URL:", err);
    return originalUrl; // fallback
  }
}

function CommunityDetail() {
  const { communityName } = useParams();        // e.g. "Curly Queens"
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // For comment inputs: store text keyed by postId
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    // 1) Fetch the community by name
    fetch(`http://localhost:5002/api/communities/${communityName}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.community) {
          alert(data.message || "Community not found");
          navigate("/communities");
        } else {
          setCommunity(data.community);
          // Check membership
          if (currentUser && data.community.members.includes(currentUser.id)) {
            setIsMember(true);
          }
          // 2) Then fetch posts for that community's _id
          fetch(`http://localhost:5002/api/posts?communityId=${data.community._id}`)
            .then((r) => r.json())
            .then((postData) => setPosts(postData))
            .catch((err) => console.error("Error fetching posts:", err));
        }
      })
      .catch((err) => console.error("Error fetching community:", err));
  }, [communityName, currentUser, navigate]);

  // Join the community if not a member
  const handleJoin = async () => {
    if (!token || !currentUser) {
      alert("You need to log in first!");
      navigate("/login");
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
          communityName,
          userId: currentUser.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Joined community successfully!");
        setIsMember(true);
        // Update local membership
        setCommunity((prev) => ({
          ...prev,
          members: [...prev.members, currentUser.id],
        }));
      } else {
        alert(data.message || "Error joining community");
      }
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  // Called after creating a new post
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Handle comment input changes
  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Add a comment (reply) to a post
  const handleAddComment = async (postId) => {
    if (!token || !currentUser) {
      alert("You need to log in first!");
      navigate("/login");
      return;
    }
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      const res = await fetch(`http://localhost:5002/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok) {
        // data.post is the updated post with comments
        const updatedPost = data.post;
        // Replace the old post with the updated one
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? updatedPost : p))
        );
        // Clear the input
        setCommentInputs((prev) => ({
          ...prev,
          [postId]: "",
        }));
      } else {
        alert(data.message || "Error adding comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!community) {
    return <div style={{ padding: 20 }}>Loading community...</div>;
  }

  const locked = community.locked; // e.g. a boolean that indicates if feed is locked

  return (
    <div style={styles.container}>
      {/* Left Column: Community Info */}
      <div style={styles.leftColumn}>
        <div style={styles.communityCard}>
          <h2>{community.name}</h2>
          <p style={{ color: "#777" }}>{community.description}</p>
          <p>
            {community.type || "Public"} Group &middot;{" "}
            {community.members.length} members
          </p>
          {!isMember && (
            <button onClick={handleJoin} style={styles.joinButton}>
              {locked ? "Request to Join" : "Join Now"}
            </button>
          )}
        </div>
      </div>

      {/* Middle Column: Feed */}
      <div style={styles.feedColumn}>
        <h3>Feed</h3>
        {locked && !isMember ? (
          <p style={{ fontStyle: "italic" }}>This community is locked.</p>
        ) : (
          <div>
            {isMember && (
              <button
                onClick={() => setShowPostModal(true)}
                style={styles.newPostButton}
              >
                + Create New Post
              </button>
            )}
            {showPostModal && (
              <NewPostModal
                communityId={community._id} // The post belongs to this community
                onClose={() => setShowPostModal(false)}
                onPostCreated={handlePostCreated}
              />
            )}

            {posts.map((post) => (
              <div key={post._id} style={styles.postCard}>
                {/* Post Fields */}
                {post.title && <h4>{post.title}</h4>}
                {post.description && <p>{post.description}</p>}

                {/* If YouTube or image */}
                {post.mediaUrl && isYouTubeLink(post.mediaUrl) ? (
                  <iframe
                    width="400"
                    height="225"
                    src={convertToYouTubeEmbed(post.mediaUrl)}
                    frameBorder="0"
                    allowFullScreen
                    title="Video"
                  />
                ) : post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt="Media"
                    style={{ width: 400, maxHeight: 300, objectFit: "cover" }}
                  />
                ) : null}

                <p><strong>Visibility:</strong> {post.visibility || "N/A"}</p>
                <p><strong>Posted by:</strong> {post.user?.username || "Unknown"}</p>

                {/* Comments */}
                {post.comments && post.comments.length > 0 && (
                  <div style={styles.commentsSection}>
                    {post.comments.map((comment) => (
                      <div key={comment._id} style={styles.comment}>
                        <strong>{comment.user?.username || "Anon"}:</strong>{" "}
                        {comment.content}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add comment form (only if isMember) */}
                {isMember && (
                  <div style={styles.commentForm}>
                    <input
                      type="text"
                      placeholder="Reply..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) => handleCommentChange(post._id, e.target.value)}
                      style={styles.commentInput}
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      style={styles.commentButton}
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommunityDetail;

// Inline Styles
const styles = {
  container: {
    display: "flex",
    gap: 20,
    padding: 20,
    fontFamily: "sans-serif",
  },
  leftColumn: {
    width: "300px",
  },
  feedColumn: {
    flex: 1,
  },
  communityCard: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "0.5rem 1rem",
    marginTop: 10,
    cursor: "pointer",
  },
  newPostButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "0.5rem 1rem",
    marginBottom: 16,
    cursor: "pointer",
  },
  postCard: {
    border: "1px solid #ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    maxWidth: 600,
  },
  commentsSection: {
    marginTop: 8,
    borderLeft: "2px solid #eee",
    paddingLeft: 8,
  },
  comment: {
    marginBottom: 4,
  },
  commentForm: {
    display: "flex",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    borderRadius: 4,
    border: "1px solid #ccc",
    padding: "4px 8px",
  },
  commentButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "6px 12px",
    cursor: "pointer",
  },
};
