import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CommunityDetail = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`/api/posts?communityId=${id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Community Posts</h1>
      <Link to={`/community/${id}/create-post`}>Create a Post</Link>
      {posts.map((post) => (
        <div key={post._id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Posted by: {post.user?.username}</p>
        </div>
      ))}
    </div>
  );
};

export default CommunityDetail;
