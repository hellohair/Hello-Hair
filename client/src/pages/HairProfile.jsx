// client/src/pages/HairProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HairProfile() {
  const [formData, setFormData] = useState({
    hairType: "",
    porosity: "",
    density: "",
    texture: "",
  });
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Grab user from localStorage to get userId
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    } else {
      // If no user is found, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User not logged in.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5002/api/hair-profile/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        // Redirect somewhere else after updating
        navigate("/communities");
      } else {
        alert(data.message || "Failed to update hair profile.");
      }
    } catch (error) {
      console.error("Error updating hair profile:", error);
      alert("Error updating hair profile.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Hair Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Hair Type */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="hairType" style={{ marginRight: "1rem" }}>
            Hair Type:
          </label>
          <select
            name="hairType"
            id="hairType"
            value={formData.hairType}
            onChange={handleChange}
            required
          >
            <option value="">Select Hair Type</option>
            <option value="Straight">Straight (Type 1)</option>
            <option value="2A">Slightly Wavy (Type 2A)</option>
            <option value="2B">Wavy (Type 2B)</option>
            <option value="2C">Very Wavy (Type 2C)</option>
            <option value="3A">Loose Curls (Type 3A)</option>
            <option value="3B">Medium Curls (Type 3B)</option>
            <option value="3C">Tight Curls (Type 3C)</option>
            <option value="4A">Soft Coils (Type 4A)</option>
            <option value="4B">Defined Coils (Type 4B)</option>
            <option value="4C">Tight Coils (Type 4C)</option>
          </select>
        </div>

        {/* Porosity */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="porosity" style={{ marginRight: "1rem" }}>
            Porosity:
          </label>
          <select
            name="porosity"
            id="porosity"
            value={formData.porosity}
            onChange={handleChange}
            required
          >
            <option value="">Select Porosity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Density */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="density" style={{ marginRight: "1rem" }}>
            Density:
          </label>
          <select
            name="density"
            id="density"
            value={formData.density}
            onChange={handleChange}
            required
          >
            <option value="">Select Density</option>
            <option value="Thin">Thin</option>
            <option value="Medium">Medium</option>
            <option value="Thick">Thick</option>
          </select>
        </div>

        {/* Texture */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="texture" style={{ marginRight: "1rem" }}>
            Texture:
          </label>
          <select
            name="texture"
            id="texture"
            value={formData.texture}
            onChange={handleChange}
            required
          >
            <option value="">Select Texture</option>
            <option value="Fine">Fine</option>
            <option value="Medium">Medium</option>
            <option value="Coarse">Coarse</option>
          </select>
        </div>

        <button type="submit">Save Hair Profile</button>
      </form>
    </div>
  );
}

export default HairProfile;
