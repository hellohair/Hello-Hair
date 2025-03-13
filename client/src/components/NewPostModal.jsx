// src/components/NewPostModal.jsx
import React, { useState } from "react";

function NewPostModal({ communityId, onClose, onPostCreated }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    communityId, // pass from outside
    title: "",
    description: "",
    mediaUrl: "",
    hairType: "",
    porosity: "",
    density: "",
    thickness: "",
    curlShape: "",
    styleOccasion: "",
    audience: "All",
    visibility: "Public",
  });

  const token = localStorage.getItem("token");

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePublish = async () => {
    try {
      const res = await fetch("http://localhost:5002/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        onPostCreated(data.post);
        onClose();
      } else {
        alert(data.message || "Error publishing post");
      }
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>New Post</h2>
          <button onClick={onClose} style={styles.closeButton}>X</button>
        </div>

        {step === 1 && (
          <StepOne
            formData={formData}
            updateField={updateField}
            onNext={handleNext}
            onClose={onClose}
          />
        )}
        {step === 2 && (
          <StepTwo
            formData={formData}
            updateField={updateField}
            onBack={handleBack}
            onPublish={handlePublish}
          />
        )}
      </div>
    </div>
  );
}

export default NewPostModal;

/* Step One: Basic Info */
function StepOne({ formData, updateField, onNext, onClose }) {
  return (
    <div>
      <h3>Details</h3>
      <label>Title</label>
      <input
        type="text"
        value={formData.title}
        onChange={e => updateField("title", e.target.value)}
        style={styles.input}
      />
      <label>Description</label>
      <textarea
        rows="3"
        value={formData.description}
        onChange={e => updateField("description", e.target.value)}
        style={styles.textarea}
      />
      <label>Media URL</label>
      <input
        type="text"
        value={formData.mediaUrl}
        onChange={e => updateField("mediaUrl", e.target.value)}
        style={styles.input}
        placeholder="e.g. https://www.youtube.com/watch?v=abcd1234 or image link"
      />
      <button onClick={onNext} style={styles.primaryButton}>Next</button>
    </div>
  );
}

/* Step Two: Tagging / Visibility */
function StepTwo({ formData, updateField, onBack, onPublish }) {
  return (
    <div>
      <h3>Visibility & Tagging</h3>
      <label>Visibility</label>
      <select
        value={formData.visibility}
        onChange={e => updateField("visibility", e.target.value)}
        style={styles.input}
      >
        <option value="Public">Public</option>
        <option value="Private">Private</option>
        <option value="Unlisted">Unlisted</option>
      </select>
      {/* Add more fields like hairType, etc. if desired */}
      <div style={styles.buttonRow}>
        <button onClick={onBack} style={styles.secondaryButton}>Back</button>
        <button onClick={onPublish} style={styles.primaryButton}>Publish</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    width: 500,
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex", justifyContent: "space-between",
    marginBottom: 16,
  },
  closeButton: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
  },
  input: {
    display: "block",
    width: "100%",
    padding: 8,
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  textarea: {
    display: "block",
    width: "100%",
    padding: 8,
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 4,
    resize: "vertical",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "#ccc",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
  },
};
