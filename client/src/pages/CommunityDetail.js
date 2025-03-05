import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CommunityDetail() {
    const { communityName } = useParams();
    const [community, setCommunity] = useState(null);
    const [isMember, setIsMember] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const res = await fetch(`http://localhost:5002/api/communities/${encodeURIComponent(communityName)}`);
                const data = await res.json();
                if (res.ok) {
                    setCommunity(data.community);

                    const storedUser = JSON.parse(localStorage.getItem("user"));
                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        if (data.community.members.some(member => member._id === user.id)) {
                            setIsMember(true);
                        }
                    }
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error fetching community:", error);
            }
        };
        fetchCommunity();
    }, [communityName]);

    const joinCommunity = async () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        const user = JSON.parse(storedUser);
        try {
            const res = await fetch("http://localhost:5002/api/communities/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ communityName, userId: user.id })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Joined community successfully!");
                setIsMember(true);
                setCommunity(prev => ({
                    ...prev,
                    members: [...prev.members, { _id: user.id, username: user.username, email: user.email }]
                }));
                user.community = communityName;
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error joining community:", error);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Welcome to the {communityName} Community!</h2>
            {community && community.description && <p>{community.description}</p>}
            {!isMember ? (
                <button onClick={joinCommunity}>Join Community</button>
            ) : (
                <p>You are a member of this community.</p>
            )}
            
            {/* Show members like Friends List */}
            {community && community.members.length > 0 ? (
                <div>
                    <h3>Members:</h3>
                    <ul>
                        {community.members.map((member) => (
                            <li key={member._id} style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                                <img 
                                    src="default-avatar.png" 
                                    alt="Profile" 
                                    width="40"
                                    style={{ borderRadius: "50%", marginRight: "1rem" }}
                                />
                                <span>{member.username} ({member.email})</span>
                                <button onClick={() => navigate(`/profile/${member._id}`)} style={{ marginLeft: "1rem" }}>
                                    View Profile
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No members yet.</p>
            )}
        </div>
    );
}

export default CommunityDetail;
