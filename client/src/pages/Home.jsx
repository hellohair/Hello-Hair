// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';

function Home() {
  const [posts, setPosts] = useState([]);

  // Fetch posts from your backend on mount
  useEffect(() => {
    fetch('http://localhost:5002/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Home Page</h1>

      {/* Render each post */}
      {posts.map(post => (
        <div key={post._id} style={styles.postCard}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>

          {/* Render the media with our helper function */}
          {renderMedia(post.mediaUrl)}

          <p><strong>Visibility:</strong> {post.visibility}</p>
          <p><strong>Posted by:</strong> {post.user?.username || 'Unknown'}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;

/* ------------------ Helper Functions ------------------ */

/**
 * Renders the media portion of a post. 
 * - If YouTube => mini embedded player
 * - If image => <img>
 * - Else => clickable link
 */
function renderMedia(mediaUrl) {
  if (!mediaUrl) return null;

  // 1) Check if it's a YouTube link
  if (isYouTubeLink(mediaUrl)) {
    const embedUrl = convertToYouTubeEmbed(mediaUrl);
    return (
      <iframe
        width="320"
        height="180"
        src={embedUrl}
        frameBorder="0"
        allowFullScreen
        title="YouTube Video"
      />
    );
  }

  // 2) Check if it's an image
  if (isImageLink(mediaUrl)) {
    return (
      <img
        src={mediaUrl}
        alt="Post Media"
        style={{ width: 320, maxHeight: 200, objectFit: 'cover' }}
      />
    );
  }

  // 3) Otherwise, fallback to a clickable link
  return (
    <a href={mediaUrl} target="_blank" rel="noreferrer">
      Open Link
    </a>
  );
}

/** Detect if URL is from YouTube domain. */
function isYouTubeLink(url) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

/** Convert watch or short link to an embeddable URL. */
function convertToYouTubeEmbed(originalUrl) {
  try {
    const parsed = new URL(originalUrl);

    // Short link: https://youtu.be/<id>
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1); // remove leading '/'
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Normal watch link: https://www.youtube.com/watch?v=<id>
    const videoId = parsed.searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Fallback if already embed link or unknown format
    return originalUrl;
  } catch (err) {
    console.error('Error converting YouTube URL:', err);
    return originalUrl;
  }
}

/** Detect if URL ends with a common image extension. */
function isImageLink(url) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowerUrl.endsWith(ext));
}

/* ------------------ Basic Inline Styles ------------------ */
const styles = {
  postCard: {
    border: '1px solid #ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    maxWidth: 600,
  },
};
