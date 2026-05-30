/**
 * AddMovieModal.jsx
 * A small form modal for adding a custom movie to a specific jar.
 * Saves to localStorage under "jars_movies_<jarId>".
 * Does NOT modify the original data array.
 */

import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

const AddMovieModal = memo(function AddMovieModal({ jar, onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'duplicate'

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!title.trim()) return;

      const added = onAdd(jar.id, title);
      if (added) {
        setStatus('success');
        setTimeout(onClose, 900); // auto-close after success message
      } else {
        setStatus('duplicate');
        setTimeout(() => setStatus('idle'), 1800);
      }
    },
    [jar, onAdd, onClose, title]
  );

  return (
    <motion.div
      className="add-modal"
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      exit={{    opacity: 0, scale: 0.88, y: 20  }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      onClick={(e) => e.stopPropagation()}
      aria-modal="true"
      role="dialog"
      aria-label={`Add movie to ${jar.mood}`}
    >
      <h2 className="add-modal-title">Add a movie 🎬</h2>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        to <strong>{jar.mood}</strong> {jar.emoji}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <input
          className="add-modal-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Movie title…"
          maxLength={80}
          autoFocus
          aria-label="Movie title"
        />

        {/* Status feedback */}
        {status === 'success' && (
          <p style={{ color: '#4caf50', fontFamily: 'var(--font-hand)', fontSize: '1rem', textAlign: 'center' }}>
            ✅ Added!
          </p>
        )}
        {status === 'duplicate' && (
          <p style={{ color: '#e91e63', fontFamily: 'var(--font-hand)', fontSize: '1rem', textAlign: 'center' }}>
            Already in this jar 😅
          </p>
        )}

        <div className="add-modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={!title.trim()}>
            Add ✨
          </button>
        </div>
      </form>
    </motion.div>
  );
});

export default AddMovieModal;
