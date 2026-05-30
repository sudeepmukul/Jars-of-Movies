/**
 * Jar.jsx
 * Renders an individual glass jar with SVG, paper slip stubs, mood label,
 * and click handler. Exposes its DOM position via ref + getBoundingClientRect
 * passed up through onJarClick(jar, rect).
 *
 * Animations:
 *  - Hover: translateY(-6px) lift via framer-motion whileHover
 *  - Click:  300ms shake keyframe sequence, then notifies parent
 */

import React, { useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

// 3 random stub rotations for paper slips peeking from top of jar
const STUB_CONFIGS = [
  { left: '22%', rotate: -8 },
  { left: '44%', rotate: 3  },
  { left: '63%', rotate: -4 },
];

const shakeVariants = {
  idle:   { x: 0 },
  shake: {
    x: [0, -7, 7, -5, 5, -3, 3, 0],
    transition: { duration: 0.30, ease: 'easeInOut' },
  },
};

const Jar = memo(function Jar({ jar, onJarClick }) {
  const wrapperRef = useRef(null);
  const [shaking, setShaking] = React.useState(false);

  const handleClick = useCallback(() => {
    if (shaking) return;
    setShaking(true);

    // After shake (300ms), pass jar + bounding rect to parent
    setTimeout(() => {
      const rect = wrapperRef.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
      onJarClick(jar, rect);
      setShaking(false);
    }, 300);
  }, [jar, onJarClick, shaking]);

  return (
    <motion.div
      ref={wrapperRef}
      className="jar-wrapper"
      onClick={handleClick}
      /* Hover lift */
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      /* Shake when clicked */
      animate={shaking ? 'shake' : 'idle'}
      variants={shakeVariants}
      aria-label={`Open ${jar.mood} jar`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      {/* Glass jar SVG */}
      <div className="jar-container">
        <svg
          className="jar-svg"
          viewBox="0 0 100 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ---- Jar lid ---- */}
          {/* Lid band */}
          <rect x="24" y="14" width="52" height="7" rx="3" fill={jar.color} opacity="0.85" />
          {/* Lid top cap */}
          <rect x="28" y="9" width="44" height="7" rx="3.5" fill={jar.color} opacity="0.7" />
          {/* Lid highlight */}
          <rect x="32" y="10" width="18" height="2.5" rx="1.25" fill="rgba(255,255,255,0.55)" />

          {/* ---- Main jar body ---- */}
          {/* Outer glass shape */}
          <path
            d="M18 28 Q16 80 16 95 Q16 118 50 120 Q84 118 84 95 Q84 80 82 28 Z"
            fill={jar.color}
            opacity="0.22"
          />
          {/* Inner fill (lighter tint) */}
          <path
            d="M22 30 Q20 80 20 95 Q20 115 50 117 Q80 115 80 95 Q80 80 78 30 Z"
            fill="rgba(255,255,255,0.18)"
          />
          {/* Left highlight (glass reflection) */}
          <path
            d="M22 35 Q21 65 21 85 Q21 95 24 100"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Secondary right highlight */}
          <path
            d="M76 35 Q77 60 77 80"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Outer glass border */}
          <path
            d="M18 28 Q16 80 16 95 Q16 118 50 120 Q84 118 84 95 Q84 80 82 28 Z"
            stroke={jar.color}
            strokeWidth="2.2"
            opacity="0.6"
          />
          {/* Bottom shine */}
          <ellipse cx="50" cy="115" rx="22" ry="4" fill="rgba(255,255,255,0.22)" />

          {/* ---- Paper slip stubs inside jar (decorative) ---- */}
          {/* Middle slip */}
          <rect x="35" y="42" width="30" height="42" rx="2" fill="#fffdf5" opacity="0.80"
            transform="rotate(-3 50 65)" />
          {/* Left slip */}
          <rect x="22" y="48" width="22" height="38" rx="2" fill="#fff8ee" opacity="0.68"
            transform="rotate(5 33 67)" />
          {/* Right slip */}
          <rect x="55" y="46" width="20" height="40" rx="2" fill="#fdf5ea" opacity="0.65"
            transform="rotate(-6 65 66)" />

          {/* Color-tinted jar front glow */}
          <ellipse cx="50" cy="74" rx="28" ry="44"
            fill={jar.glowColor}
            style={{ mixBlendMode: 'multiply' }}
          />
        </svg>
      </div>

      {/* Mood label */}
      <div className="jar-label">
        <span className="jar-emoji" aria-hidden="true">{jar.emoji}</span>
        {jar.mood}
      </div>
    </motion.div>
  );
});

export default Jar;
