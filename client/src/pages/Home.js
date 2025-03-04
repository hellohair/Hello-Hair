import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to Hello Hair Education!</h1>
      <p>Discover hair care tips, tutorials, and join our community.</p>
      <Link to="/quiz">Take the Curl Quiz</Link>
    </div>
  );
};

export default Home;
