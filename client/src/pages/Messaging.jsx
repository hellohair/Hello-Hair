// src/pages/Messaging.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Messaging() {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // State Variables
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Function to load contacts from backend
  const loadContacts = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/messages/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.contacts) {
        setContacts(data.contacts);
        localStorage.setItem("contacts", JSON.stringify(data.contacts));
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Fetch contacts on mount
  useEffect(() => {
    if (token) {
      loadContacts();
    }
  }, [token]);

  // Restore contacts from local storage on mount
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem("contacts"));
    if (storedContacts) {
      setContacts(storedContacts);
    }
  }, []);

  // If not logged in, prompt login
  if (!token) {
    return (
      <div style={styles.notLoggedInContainer}>
        <h2 style={styles.notLoggedInTitle}>Please log in first!</h2>
        <button style={styles.loginButton} onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  // Search for new users
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5002/api/users/search?query=${term}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Load conversation for selected user
  const loadConversation = async (user) => {
    setSelectedUser(user);
    try {
      const res = await fetch(`http://localhost:5002/api/messages/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversation(data.messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  // Send a new message and update contacts list afterwards
  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUser || newMessage.trim() === "") return;
    try {
      const res = await fetch("http://localhost:5002/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedUser._id,
          content: newMessage,
        }),
      });
      const data = await res.json();
      if (data.message === "Message sent") {
        setNewMessage("");
        loadConversation(selectedUser); // Refresh conversation
        loadContacts(); // Refresh contacts list so new conversation appears
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Messaging</h2>
      <div style={styles.layout}>
        {/* Left Pane: Contacts and Search */}
        <div style={styles.leftPane}>
          <h3 style={styles.leftPaneTitle}>Your Contacts</h3>
          <ul style={styles.contactsList}>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <li
                  key={contact._id}
                  style={styles.contactItem}
                  onClick={() => loadConversation(contact)}
                >
                  <img
                    src={contact.profilePicture || "default-avatar.png"}
                    alt="Avatar"
                    style={styles.avatarImage}
                  />
                  <span style={styles.contactName}>{contact.username}</span>
                </li>
              ))
            ) : (
              <p style={{ fontStyle: "italic", color: "#555" }}>
                No previous conversations.
              </p>
            )}
          </ul>
          {/* Search Section to find new users */}
          <div style={styles.searchSection}>
            <label style={styles.searchLabel}>Start a new conversation:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by username..."
              style={styles.searchInput}
            />
            {searchResults.length > 0 && (
              <ul style={styles.searchResults}>
                {searchResults.map((user) => (
                  <li key={user._id} style={styles.searchResultItem}>
                    <span style={{ fontWeight: "bold" }}>{user.username}</span>
                    <button
                      onClick={() => loadConversation(user)}
                      style={styles.messageButton}
                    >
                      Message
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Pane: Conversation */}
        <div style={styles.rightPane}>
          {selectedUser ? (
            <div style={styles.conversationContainer}>
              <h3 style={styles.conversationTitle}>
                Conversation with {selectedUser.username}
              </h3>
              <div style={styles.chatWindow}>
                {conversation.length === 0 ? (
                  <p style={styles.noMessages}>No messages yet.</p>
                ) : (
                  conversation.map((msg) => {
                    const isMe = msg.sender === currentUser.id;
                    const bubbleStyle = {
                      ...styles.messageBubble,
                      backgroundColor: isMe ? "#3b82f6" : "#e5e7eb",
                      color: isMe ? "#fff" : "#000",
                      alignSelf: isMe ? "flex-end" : "flex-start",
                    };
                    const containerStyle = {
                      ...styles.messageContainer,
                      justifyContent: isMe ? "flex-end" : "flex-start",
                    };
                    const userName = isMe
                      ? currentUser.username
                      : selectedUser.username;
                    return (
                      <div key={msg._id} style={containerStyle}>
                        {/* For the other user's message, show avatar and name on left */}
                        {!isMe && (
                          <div style={styles.avatarContainer}>
                            <img
                              src={selectedUser.profilePicture || "default-avatar.png"}
                              alt="Avatar"
                              style={styles.avatarImage}
                            />
                            <span style={styles.avatarName}>{userName}</span>
                          </div>
                        )}
                        <div style={bubbleStyle}>
                          <p style={{ marginBottom: 4 }}>{msg.content}</p>
                          <small style={{ fontSize: "0.75rem" }}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </small>
                        </div>
                        {/* For your own message, show avatar and name on right */}
                        {isMe && (
                          <div style={{ ...styles.avatarContainer, marginLeft: 8 }}>
                            <img
                              src={currentUser.profilePicture || "default-avatar.png"}
                              alt="Avatar"
                              style={styles.avatarImage}
                            />
                            <span style={styles.avatarName}>{userName}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              <form onSubmit={handleSend} style={styles.inputForm}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={styles.messageInput}
                  required
                />
                <button type="submit" style={styles.sendButton}>
                  Send
                </button>
              </form>
            </div>
          ) : (
            <p style={styles.selectUserPrompt}>
              Select a contact or search for a user to start messaging.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messaging;

// Inline Styles
const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 16,
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: 16,
  },
  layout: {
    display: "flex",
    gap: 16,
  },
  // Left Pane (Contacts + Search)
  leftPane: {
    width: "30%",
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  leftPaneTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: 8,
  },
  contactsList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    maxHeight: 200,
    overflowY: "auto",
  },
  contactItem: {
    padding: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    marginRight: 8,
  },
  contactName: {
    fontSize: "0.95rem",
    color: "#333",
  },
  searchSection: {},
  searchLabel: {
    display: "block",
    marginBottom: 8,
    fontWeight: "600",
  },
  searchInput: {
    width: "100%",
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  searchResults: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: 4,
    listStyle: "none",
    margin: 0,
    marginTop: 8,
    padding: 0,
    maxHeight: 200,
    overflowY: "auto",
  },
  searchResultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottom: "1px solid #eee",
  },
  messageButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "4px 8px",
    cursor: "pointer",
  },
  // Right Pane (Conversation)
  rightPane: {
    flex: 1,
    border: "1px solid #ccc",
    padding: 16,
    borderRadius: 8,
    minHeight: 400,
  },
  conversationContainer: {},
  conversationTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: 16,
  },
  chatWindow: {
    height: 300,
    overflowY: "auto",
    padding: 8,
    backgroundColor: "#f8f8f8",
    border: "1px solid #ddd",
    borderRadius: 4,
    marginBottom: 16,
  },
  noMessages: {
    color: "#666",
    textAlign: "center",
    marginTop: 60,
  },
  messageContainer: {
    display: "flex",
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: "60%",
    padding: "8px 12px",
    borderRadius: 8,
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginRight: 8,
  },
  avatarName: {
    fontSize: "0.75rem",
    color: "#666",
  },
  inputForm: {
    display: "flex",
    gap: 8,
  },
  messageInput: {
    flex: 1,
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "8px 12px",
    cursor: "pointer",
  },
  selectUserPrompt: {
    marginTop: 60,
    textAlign: "center",
    color: "#555",
  },
  // Not Logged In
  notLoggedInContainer: {
    maxWidth: 400,
    margin: "0 auto",
    padding: 16,
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  notLoggedInTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "8px 12px",
    cursor: "pointer",
  },
};
