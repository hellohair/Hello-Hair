import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Communities = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    fetch('/api/communities')
      .then((res) => res.json())
      .then((data) => setCommunities(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Communities</h1>
      <ul>
        {communities.map((community) => (
          <li key={community._id}>
            <Link to={`/community/${community._id}`}>
              {community.name} - {community.hairType}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Communities;
