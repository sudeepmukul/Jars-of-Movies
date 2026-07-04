import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export default function MoodDetector({ onClose }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Loading models...');
  const [recommendation, setRecommendation] = useState(null);
  const [stream, setStream] = useState(null);

  // Load face-api.js script dynamically
  useEffect(() => {
    const loadFaceApi = async () => {
      if (window.faceapi) {
        await initModels();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js';
      script.async = true;
      script.onload = initModels;
      document.body.appendChild(script);
    };

    const initModels = async () => {
      try {
        setStatus('Loading models...');
        // We use the tiny face detector for speed
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setStatus('Starting camera...');
        startVideo();
      } catch (err) {
        console.error(err);
        setStatus('Failed to load models. Try again later.');
      }
    };

    loadFaceApi();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(currentStream => {
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
        setStatus('Looking for your face...');
      })
      .catch(err => {
        console.error("Webcam error:", err);
        setStatus('Webcam access denied or unavailable.');
      });
  };

  const handleVideoPlay = () => {
    const detectFace = async () => {
      if (!videoRef.current || recommendation) return;
      
      const detection = await window.faceapi
        .detectSingleFace(videoRef.current, new window.faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detection) {
        // Find the dominant emotion
        const expressions = detection.expressions;
        const dominantEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
        
        setStatus(`Detected mood: ${dominantEmotion}! Fetching movie...`);
        
        // Stop the video stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Call backend API
        try {
          const res = await fetch(`${API_BASE_URL}/recommendations/mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood: dominantEmotion })
          });
          const data = await res.json();
          setRecommendation(data);
        } catch (err) {
          console.error(err);
          setStatus('Failed to fetch recommendation.');
        }
      } else {
        if (!recommendation) {
          setTimeout(detectFace, 500); // Try again
        }
      }
    };
    
    detectFace();
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="mood-detector-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        <div style={{
          backgroundColor: 'var(--bg-color)',
          padding: '2rem',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
          color: 'var(--text-color)',
          position: 'relative'
        }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
          
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>
            Mood Detector ✨
          </h2>
          
          {!recommendation ? (
            <>
              <p style={{ marginBottom: '1rem' }}>{status}</p>
              <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  onPlay={handleVideoPlay}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                {recommendation.title}
              </h3>
              <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: '#666' }}>
                {recommendation.reason}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                {recommendation.overview}
              </p>
              
              <button 
                onClick={onClose}
                className="btn-primary"
                style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem' }}
              >
                Close
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
