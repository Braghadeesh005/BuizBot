import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../api/auth';

function Home() {
  const handleLogout = () => {
    logout().then(() => {
      window.location.href = '/login';
    });
  };

  return (
    <div>
      <h1>Home</h1>
      <Link to="/profile">Go to Profile</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;