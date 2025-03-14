// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import NewPostModal from '../components/NewPostModal';

// --- Helper Functions ---
function isYouTubeLink(url) {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function convertToYouTubeEmbed(originalUrl) {
  try {
    const parsed = new URL(originalUrl);
    // For short links (e.g. https://youtu.be/XYZ)
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // For watch links (e.g. https://www.youtube.com/watch?v=XYZ)
    const videoId = parsed.searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return originalUrl;
  } catch (err) {
    console.error('Error converting YouTube URL:', err);
    return originalUrl;
  }
}

function isImageLink(url) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

function renderMedia(mediaUrl) {
  if (!mediaUrl) return null;
  if (isYouTubeLink(mediaUrl)) {
    const embedUrl = convertToYouTubeEmbed(mediaUrl);
    return (
      <iframe
        width="400"
        height="225"
        src={embedUrl}
        frameBorder="0"
        allowFullScreen
        title="YouTube Video"
      />
    );
  }
  if (isImageLink(mediaUrl)) {
    return (
      <img
        src={mediaUrl}
        alt="Post Media"
        style={{ width: 400, maxHeight: 300, objectFit: 'cover' }}
      />
    );
  }
  // Fallback: display a clickable link
  return (
    <a href={mediaUrl} target="_blank" rel="noreferrer">
      Open Link
    </a>
  );
}

// --- Home Component ---
function Home() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  // Fetch home posts (community = null, passed as ?communityId=none)
  useEffect(() => {
    fetch('http://localhost:5002/api/posts?communityId=none')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('Unexpected data format:', data);
          setPosts([]);
        }
      })
      .catch(err => console.error('Error fetching home posts:', err));
  }, []);

  // Handle comment input changes
  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Add a comment to a post
  const handleAddComment = async (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      return;
    }

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
        // Update the post in state with new comments
        setPosts(prevPosts =>
          prevPosts.map(post => post._id === postId ? data.post : post)
        );
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      } else {
        alert(data.message || "Error adding comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Called after a new post is created
  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Home Page</h1>
      <button onClick={() => setShowModal(true)} style={styles.newPostButton}>
        + Create New Post
      </button>
      {showModal && (
        <NewPostModal
          communityId={null} // Home posts have community = null
          onClose={() => setShowModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {posts.map(post => (
        <div key={post._id} style={styles.postCard}>
          {post.title && <h2>{post.title}</h2>}
          {post.description && <p>{post.description}</p>}
          {renderMedia(post.mediaUrl)}
          <p>
            <strong>Visibility:</strong> {post.visibility || 'N/A'}
          </p>
          <p>
            <strong>Posted by:</strong> {post.user?.username || 'Unknown'}
          </p>
          {/* Comments */}
          {post.comments && post.comments.length > 0 && (
            <div style={styles.commentSection}>
              {post.comments.map(comment => (
                <div key={comment._id} style={styles.comment}>
                  <strong>{comment.user?.username || 'Anon'}:</strong> {comment.content}
                </div>
              ))}
            </div>
          )}
          {/* Reply form (only show if logged in) */}
          {localStorage.getItem("token") && (
            <div style={styles.commentForm}>
              <input
                type="text"
                placeholder="Reply..."
                value={commentInputs[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                style={styles.commentInput}
              />
              <button onClick={() => handleAddComment(post._id)} style={styles.commentButton}>
                Reply
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  newPostButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "0.5rem 1rem",
    marginBottom: 20,
    cursor: "pointer",
  },
  postCard: {
    border: "1px solid #ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    maxWidth: 600,
  },
  commentSection: {
    marginTop: 10,
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
    padding: "4px 8px",
    border: "1px solid #ccc",
    borderRadius: 4,
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

export default Home;
