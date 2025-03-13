// src/components/NewPostModal.jsx
import React, { useState } from 'react';

function NewPostModal({ onClose, onPostCreated }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUrl: '',       // File link or YouTube link
    hairType: '',
    porosity: '',
    density: '',
    thickness: '',
    curlShape: '',
    styleOccasion: '',
    audience: 'All',
    visibility: 'Public',
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // Update a field in formData
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // On final publish
  const handlePublish = async () => {
    try {
      const res = await fetch('http://localhost:5002/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        // Let the parent know a post was created
        onPostCreated(data);
        onClose();
      } else {
        alert(data.message || 'Error publishing post');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2>New Post</h2>
          <button onClick={onClose} style={styles.closeButton}>X</button>
        </div>

        {/* Steps */}
        {step === 1 && (
          <StepDetails
            formData={formData}
            updateField={updateField}
            onNext={handleNext}
            onClose={onClose}
          />
        )}
        {step === 2 && (
          <StepTagging
            formData={formData}
            updateField={updateField}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <StepCopyright
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 4 && (
          <StepVisibility
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

/* -------------- Step 1: Details -------------- */
function StepDetails({ formData, updateField, onNext, onClose }) {
  return (
    <div>
      <h3 style={styles.stepTitle}>Details</h3>
      <div style={styles.field}>
        <label>Title (required)</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => updateField('title', e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.field}>
        <label>Description</label>
        <textarea
          rows="3"
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          style={styles.textarea}
        />
      </div>
      <div style={styles.field}>
        <label>Media URL (File or YouTube Link)</label>
        <input
          type="text"
          placeholder="e.g. https://youtube.com/..."
          value={formData.mediaUrl}
          onChange={e => updateField('mediaUrl', e.target.value)}
          style={styles.input}
        />
      </div>
      {/* Buttons */}
      <div style={styles.buttonRow}>
        <button onClick={onClose} style={styles.secondaryButton}>Cancel</button>
        <button onClick={onNext} style={styles.primaryButton}>Next</button>
      </div>
    </div>
  );
}

/* -------------- Step 2: Tagging -------------- */
function StepTagging({ formData, updateField, onNext, onBack }) {
  return (
    <div>
      <h3 style={styles.stepTitle}>Tagging</h3>
      {/* Example fields */}
      <div style={styles.field}>
        <label>Hair Type</label>
        <select
          value={formData.hairType}
          onChange={e => updateField('hairType', e.target.value)}
          style={styles.select}
        >
          <option value="">Select hair type</option>
          <option value="1 - Straight">1 - Straight</option>
          <option value="2 - Wavy">2 - Wavy</option>
          <option value="3 - Curly">3 - Curly</option>
          <option value="4 - Coily">4 - Coily</option>
        </select>
      </div>
      <div style={styles.field}>
        <label>Porosity</label>
        <select
          value={formData.porosity}
          onChange={e => updateField('porosity', e.target.value)}
          style={styles.select}
        >
          <option value="">Select porosity</option>
          <option value="Low Porosity">Low Porosity</option>
          <option value="Medium Porosity">Medium Porosity</option>
          <option value="High Porosity">High Porosity</option>
        </select>
      </div>
      <div style={styles.field}>
        <label>Density</label>
        <select
          value={formData.density}
          onChange={e => updateField('density', e.target.value)}
          style={styles.select}
        >
          <option value="">Select density</option>
          <option value="Thin">Thin</option>
          <option value="Medium">Medium</option>
          <option value="Thick">Thick</option>
        </select>
      </div>
      <div style={styles.field}>
        <label>Thickness</label>
        <select
          value={formData.thickness}
          onChange={e => updateField('thickness', e.target.value)}
          style={styles.select}
        >
          <option value="">Select thickness</option>
          <option value="Fine">Fine</option>
          <option value="Medium">Medium</option>
          <option value="Coarse">Coarse</option>
        </select>
      </div>
      <div style={styles.field}>
        <label>Curl Shape</label>
        <select
          value={formData.curlShape}
          onChange={e => updateField('curlShape', e.target.value)}
          style={styles.select}
        >
          <option value="">Select curl shape</option>
          <option value="S-Shaped">S-Shaped</option>
          <option value="Z-Shaped">Z-Shaped</option>
          <option value="L-Shaped">L-Shaped</option>
        </select>
      </div>
      <div style={styles.field}>
        <label>Style & Occasion</label>
        <input
          type="text"
          placeholder="e.g. Wedding, Casual..."
          value={formData.styleOccasion}
          onChange={e => updateField('styleOccasion', e.target.value)}
          style={styles.input}
        />
      </div>
      {/* Buttons */}
      <div style={styles.buttonRow}>
        <button onClick={onBack} style={styles.secondaryButton}>Back</button>
        <button onClick={onNext} style={styles.primaryButton}>Next</button>
      </div>
    </div>
  );
}

/* -------------- Step 3: Copyright -------------- */
function StepCopyright({ onNext, onBack }) {
  return (
    <div>
      <h3 style={styles.stepTitle}>Copyright</h3>
      <p style={{ marginBottom: 16 }}>
        Add disclaimers or usage rights here. For example:
        <br />“I confirm I have the rights to the content I’m uploading and it does not violate any copyrights.”
      </p>
      <div style={styles.buttonRow}>
        <button onClick={onBack} style={styles.secondaryButton}>Back</button>
        <button onClick={onNext} style={styles.primaryButton}>Next</button>
      </div>
    </div>
  );
}

/* -------------- Step 4: Visibility -------------- */
function StepVisibility({ formData, updateField, onBack, onPublish }) {
  return (
    <div>
      <h3 style={styles.stepTitle}>Visibility</h3>
      <div style={styles.field}>
        <label>Who is this content intended for?</label>
        <select
          value={formData.audience}
          onChange={e => updateField('audience', e.target.value)}
          style={styles.select}
        >
          <option value="Children">Children (Under 13)</option>
          <option value="Teens">Teens (13-17)</option>
          <option value="Adults">Adults (18+)</option>
          <option value="All">All audiences (Suitable for everyone)</option>
        </select>
      </div>
      <div style={styles.field}>
        <label>Save or Publish</label>
        <select
          value={formData.visibility}
          onChange={e => updateField('visibility', e.target.value)}
          style={styles.select}
        >
          <option value="Private">Private (Only you and people you choose)</option>
          <option value="Unlisted">Unlisted (Anyone with the link can watch)</option>
          <option value="Public">Public (Everyone can watch)</option>
        </select>
      </div>
      <div style={styles.buttonRow}>
        <button onClick={onBack} style={styles.secondaryButton}>Back</button>
        <button onClick={onPublish} style={styles.primaryButton}>Publish</button>
      </div>
    </div>
  );
}

/* -------------- Styles -------------- */
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    width: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 8,
    padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
  },
  stepTitle: {
    fontSize: '1.2rem',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  textarea: {
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  select: {
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 4,
    cursor: 'pointer',
  },
  secondaryButton: {
    backgroundColor: '#ccc',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

