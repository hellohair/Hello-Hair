import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Friends() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // Function to fetch users dynamically as the user types
    useEffect(() => {
        if (query.length < 2) { 
            setUsers([]); // Clear search results if query is too short
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await fetch(`http://localhost:5002/api/users/search?query=${query}`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data);
                } else {
                    setUsers([]); // If there's an error, clear the list
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]); // Ensure no outdated results show up
            }
        };

        // Debounce to prevent excessive API calls (fetch after user stops typing for 300ms)
        const debounceTimeout = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(debounceTimeout); // Cleanup function to prevent unnecessary calls
    }, [query]);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Find Friends</h2>
            <input 
                type="text" 
                placeholder="Search users by username..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                required 
            />

            <div style={{ marginTop: "1rem" }}>
                <h3>Search Results:</h3>
                {users.length === 0 && query.length >= 2 && <p>No users found.</p>}
                <ul>
                    {users.map(user => (
                        <li key={user._id} style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                            <img 
                                src={user.profilePicture || "default-avatar.png"} 
                                alt="Profile" 
                                width="50" 
                                style={{ borderRadius: "50%", marginRight: "1rem" }}
                            />
                            <span>{user.username}</span>
                            <button 
                                onClick={() => navigate(`/profile/${user._id}`)} 
                                style={{ marginLeft: "1rem" }}
                            >
                                View Profile
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Friends;
