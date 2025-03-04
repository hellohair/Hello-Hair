import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HairProfile({ userId }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    hairType: '',
    porosity: '',
    density: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5002/api/hair-profile/update/${userId}`);
        const data = await res.json();
        if (res.ok) setProfileData(data.profile);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5002/api/hair-profile/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Profile completed!');
        localStorage.setItem("currentUser", JSON.stringify({ ...JSON.parse(localStorage.getItem("currentUser")), hairProfileCompleted: true }));
        navigate('/communities'); // Redirect after completion
      } else {
        alert(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('An error occurred while updating profile.');
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Complete Your Hair Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Hair Type</label>
        <select name="hairType" value={profileData.hairType} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Straight">Straight</option>
          <option value="Wavy">Wavy</option>
          <option value="Curly">Curly</option>
          <option value="Coily">Coily</option>
        </select>
        <br/>

        <label>Porosity</label>
        <select name="porosity" value={profileData.porosity} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <br/>

        <label>Density</label>
        <select name="density" value={profileData.density} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Thin">Thin</option>
          <option value="Medium">Medium</option>
          <option value="Thick">Thick</option>
        </select>
        <br/>

        <button type="submit">Complete Profile</button>
      </form>
    </div>
  );
}

export default HairProfile;
