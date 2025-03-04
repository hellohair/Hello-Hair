import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CreatePost = () => {
  const { communityId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // token must be set after login
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ communityId, title, content }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Post created!');
      navigate(`/community/${communityId}`);
    } else {
      alert(data.message || 'Failed to create post');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <br />
        <label>Content:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        <br />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
