import React, { useState, useEffect } from 'react';
import { getProfile, postData, getSessionData } from '../api/auth';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    getProfile().then(response => setProfile(response.data));
    getSessionData().then(response => setSessionData(response.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    postData({ name, age }).then(() => {
      getSessionData().then(response => setSessionData(response.data));
    });
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile.user.displayName}</p>
      <p>Email: {profile.user.email}</p>
      <p>Last Login: {new Date(profile.lastLogin).toLocaleString()}</p>

      <h2>Session Data</h2>
      {sessionData && (
        <div>
          <p>Name: {sessionData.userData.name}</p>
          <p>Age: {sessionData.userData.age}</p>
        </div>
      )}

      <h2>Update Session Data</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
        />
        <input 
          type="number" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
          placeholder="Age" 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Profile;