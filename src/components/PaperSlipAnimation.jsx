/**
 * PaperSlipAnimation.jsx
 *
 * Manages the FULL animation pipeline from jar → floating slips → centered paper:
 *
 * Phase 1 — Floating slips (0–800ms):
 *   Multiple tiny folded paper slips spawn from the jar's DOM position and
 *   float upward with staggered delays and random x-drift.
 *
 * Phase 2 — Selected slip travels to center (starts at ~400ms):
 *   One slip (index 0) moves from the jar position to the viewport center,
 *   growing from folded → full-size as it arrives.
 *
 * Phase 3 — Content fade-in (after selected slip reaches center):
 *   Movie title content fades in ONLY after the slip finishes centering.
 *   This creates a seamless paper-transforms-into-modal feel.
 *
 * Props:
 *   jarRect     — DOMRect of the clicked jar (getBoundingClientRect)
 *   jar         — full jar data object
 *   movie       — pre-selected movie title string
 *   onClose     — callback when overlay or close is triggered
 *   onAddMovie  — callback to open AddMovieModal
 */

import React, { useEffect, useState, useMemo, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Number of background floating slips (not the hero one)
const SLIP_COUNT = 6;

/** Generate deterministic-ish random values seeded from jar id so they're stable */
function generateSlipConfigs(jarId, count) {
  // Simple deterministic pseudo-random from string seed
  const seed = jarId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const configs = [];
  for (let i = 0; i < count; i++) {
    const t = (seed * (i + 1) * 2654435761) >>> 0;
    configs.push({
      xDrift:  ((t % 120) - 60),           // -60 to +60 px
      rotate:  ((t >> 4) % 12) - 6,          // -6 to +6 deg
      delay:   0.08 + (i * 0.09),           // staggered start
      duration: 0.6 + ((t >> 8) % 30) / 100, // 0.6–0.9s
    });
  }
  return configs;
}

const PaperSlipAnimation = memo(function PaperSlipAnimation({
  jarRect,
  jar,
  movie,
  onClose,
  onAddMovie,
}) {
  // Phase tracking
  const [phase, setPhase] = useState('floating'); // 'floating' | 'centering' | 'revealing'
  const confettiFiredRef = useRef(false);

  // Origin point: center-top of the jar
  const originX = jarRect.x + jarRect.width / 2;
  const originY = jarRect.y + jarRect.height * 0.35;

  // Viewport center (for hero slip destination)
  const centerX = window.innerWidth  / 2;
  const centerY = window.innerHeight / 2;

  // Stable slip configs (memoized by jar id)
  const slipConfigs = useMemo(() => generateSlipConfigs(jar.id, SLIP_COUNT), [jar.id]);

  // Hero slip starts at 400ms, centering takes ~600ms → revealing at ~1000ms total
  useEffect(() => {
    // Start centering phase at 400ms
    const t1 = setTimeout(() => setPhase('centering'), 400);
    // Reveal content after slip reaches center (~400 + 650ms)
    const t2 = setTimeout(() => setPhase('revealing'), 1050);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Fire confetti exactly once when modal content is revealed
  useEffect(() => {
    if (phase === 'revealing' && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#f48fb1', '#f8bbd0', '#fce4ec', '#fff8e1', '#e1bee7', '#ffe082'],
          scalar: 0.85,
          gravity: 0.9,
          drift: 0.2,
        });
      });
    }
  }, [phase]);

  // Convert absolute position to fixed-position offsets
  const toFixed = (absX, absY) => ({
    left: absX,
    top:  absY,
    transform: 'translate(-50%, -50%)',
  });

  return (
    <>
      {/* --------------------------------------------------------
          Dim overlay — fades in as soon as animation starts
      -------------------------------------------------------- */}
      <motion.div
        className="dim-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
        aria-label="Close"
      />

      {/* --------------------------------------------------------
          Background floating slips — rise from jar and disappear
      -------------------------------------------------------- */}
      {slipConfigs.map((cfg, i) => (
        <motion.div
          key={`slip-bg-${i}`}
          style={{
            position: 'fixed',
            left:  originX,
            top:   originY,
            zIndex: 105,
            width:  28,
            height: 36,
            borderRadius: 4,
            background: 'linear-gradient(145deg, #fffdf5, #fff8ee)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            transformOrigin: 'center',
            pointerEvents: 'none',
          }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: cfg.rotate, scale: 0.6 }}
          animate={{
            x: cfg.xDrift,
            y: -140 - (i * 12),
            opacity: [0, 0.85, 0.85, 0],
            scale: [0.6, 0.85, 0.85, 0.5],
          }}
          transition={{
            delay: cfg.delay,
            duration: cfg.duration + 0.3,
            ease: 'easeOut',
          }}
          aria-hidden="true"
        />
      ))}

      {/* --------------------------------------------------------
          Hero slip — travels from jar to viewport center, then
          expands to full paper card. Content fades in after arrival.
      -------------------------------------------------------- */}
      <motion.div
        style={{
          position: 'fixed',
          zIndex: 110,
          transformOrigin: 'center center',
          pointerEvents: phase === 'revealing' ? 'all' : 'none',
        }}
        // Phase 1: start at jar origin, small
        initial={{
          left:    originX,
          top:     originY,
          x:       '-50%',
          y:       '-50%',
          width:   36,
          height:  48,
          borderRadius: 6,
          rotate:  -8,
          scaleY:  0.15,
          opacity: 0,
        }}
        animate={
          phase === 'floating'
            ? {
                // Stay near jar while background slips rise
                opacity: 1,
                scaleY:  0.15,
                left:    originX,
                top:     originY,
                width:   36,
                height:  48,
                rotate:  -8,
              }
            : phase === 'centering'
            ? {
                // Travel to center, grow
                left:    centerX,
                top:     centerY,
                width:   Math.min(88 * window.innerWidth  / 100, 360),
                height:  'auto',
                rotate:  -2,
                scaleY:  1,
                opacity: 1,
              }
            : {
                // Final resting state
                left:    centerX,
                top:     centerY,
                width:   Math.min(88 * window.innerWidth  / 100, 360),
                rotate:  -1.5,
                scaleY:  1,
                opacity: 1,
              }
        }
        transition={
          phase === 'centering'
            ? { duration: 0.65, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0.3,  ease: 'easeOut' }
        }
        className="paper-card"
      >
        {/* Content only fades in after centered */}
        <motion.div
          className="paper-card-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'revealing' ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {movie ? (
            <>
              <p className="paper-movie-label">✨ your movie tonight ✨</p>
              <div className="paper-divider" />
              <p className="paper-movie-title">{movie}</p>
              <span className="paper-mood-badge">{jar.emoji} {jar.mood}</span>
              <br />
              <button
                className="add-movie-btn"
                onClick={(e) => { e.stopPropagation(); onAddMovie(); }}
                aria-label="Add a movie to this jar"
              >
                ＋ Add a movie
              </button>
            </>
          ) : (
            <p className="empty-jar-msg">
              No movies yet —<br />add one! 🎬
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Close hint */}
      <motion.p
        className="paper-close-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'revealing' ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        aria-hidden="true"
      >
        tap anywhere to close
      </motion.p>
    </>
  );
});

export default PaperSlipAnimation;
