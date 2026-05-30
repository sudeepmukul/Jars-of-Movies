/**
 * JarGrid.jsx
 * Responsive grid layout for all jar components.
 * Memoized to prevent re-renders when movie modal opens/closes.
 */

import React, { memo } from 'react';
import Jar from './Jar';

const JarGrid = memo(function JarGrid({ jars, onJarClick }) {
  return (
    <main className="jar-grid" aria-label="Movie mood jars">
      {jars.map((jar) => (
        <Jar key={jar.id} jar={jar} onJarClick={onJarClick} />
      ))}
    </main>
  );
});

export default JarGrid;
