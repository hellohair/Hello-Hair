// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';

// Helper: Check if a URL is a YouTube link (watch or short)
function isYouTubeLink(url) {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Helper: Convert a YouTube watch or short link to an embed link
function convertToYouTubeEmbed(originalUrl) {
  try {
    const parsed = new URL(originalUrl);
    // For short links: https://youtu.be/XYZ
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1); // remove leading '/'
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // For standard watch links: https://www.youtube.com/watch?v=XYZ
    const videoId = parsed.searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Fallback: return original URL if already embed or unknown format
    return originalUrl;
  } catch (err) {
    console.error('Error converting YouTube URL:', err);
    return originalUrl;
  }
}

// Helper: Check if URL likely points to an image
function isImageLink(url) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

// Helper: Render media based on URL type
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

function Home() {
  const [posts, setPosts] = useState([]);
  // State for comment inputs keyed by post ID
  const [commentInputs, setCommentInputs] = useState({});
  
  // Fetch home posts (posts with community=null, using communityId=none)
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
  
  // Handle comment input change for a specific post
  const handleCommentChange = (postId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value,
    }));
  };
  
  // Add a comment (reply) to a post
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
        // data.post is the updated post with new comments
        setPosts(prevPosts => prevPosts.map(post => post._id === postId ? data.post : post));
        // Clear the input for that post
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      } else {
        alert(data.message || "Error adding comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Home Page</h1>
      {posts.map(post => (
        <div key={post._id} style={styles.postCard}>
          {post.title && <h2>{post.title}</h2>}
          {post.description && <p>{post.description}</p>}
          {renderMedia(post.mediaUrl)}
          <p><strong>Visibility:</strong> {post.visibility || 'N/A'}</p>
          <p><strong>Posted by:</strong> {post.user?.username || 'Unknown'}</p>
          
          {/* Comments Section */}
          {post.comments && post.comments.length > 0 && (
            <div style={styles.commentSection}>
              {post.comments.map(comment => (
                <div key={comment._id} style={styles.comment}>
                  <strong>{comment.user?.username || 'Anon'}:</strong> {comment.content}
                </div>
              ))}
            </div>
          )}
          
          {/* Reply Form (if logged in) */}
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
