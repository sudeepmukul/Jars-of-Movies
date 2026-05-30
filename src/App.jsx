/**
 * App.jsx — Root component for Jars of Movies
 *
 * Responsibilities:
 *  - Shimmer background
 *  - App header
 *  - State: which jar is active, jar's DOM rect, selected movie, addMovie modal
 *  - Passes onJarClick down to JarGrid
 *  - Renders PaperSlipAnimation + AddMovieModal via AnimatePresence
 *  - Click-outside-to-close via overlay inside PaperSlipAnimation
 *
 * Animation pipeline (orchestrated here via state, executed in PaperSlipAnimation):
 *   1. Jar click → shake (Jar.jsx, 300ms)
 *   2. After shake → PaperSlipAnimation mounts → floating slips (500–800ms)
 *   3. At 400ms → hero slip travels to center (600ms)
 *   4. At 1050ms → modal content fades in
 *
 * Movie selection happens BEFORE animation mounts so the correct title is always
 * available when content reveals.
 */

import React, { useState, useCallback, memo } from 'react';
import { AnimatePresence } from 'framer-motion';

import JarGrid         from './components/JarGrid';
import PaperSlipAnimation from './components/PaperSlipAnimation';
import AddMovieModal   from './components/AddMovieModal';
import { useJarMovies } from './hooks/useJarMovies';

const App = memo(function App() {
  const { jars, addCustomMovie } = useJarMovies();

  // Active animation state
  const [activeJar,    setActiveJar]    = useState(null);
  const [activeRect,   setActiveRect]   = useState(null);
  const [activeMovie,  setActiveMovie]  = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  /**
   * Called by Jar after its shake animation (300ms) completes.
   * Selects a random movie BEFORE mounting the animation layer.
   */
  const handleJarClick = useCallback((jar, rect) => {
    // Pick movie before animation so it's ready when paper unfolds
    const movie =
      jar.movies.length > 0
        ? jar.movies[Math.floor(Math.random() * jar.movies.length)]
        : null;

    setActiveJar(jar);
    setActiveRect(rect);
    setActiveMovie(movie);
    setShowAddModal(false);
  }, []);

  /** Close the entire animation / modal */
  const handleClose = useCallback(() => {
    setActiveJar(null);
    setActiveRect(null);
    setActiveMovie(null);
    setShowAddModal(false);
  }, []);

  /** Open the "add movie" sub-modal */
  const handleOpenAddModal = useCallback(() => {
    setShowAddModal(true);
  }, []);

  /** Close just the add-movie sub-modal */
  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  /** Add a movie — delegates to hook, which persists to localStorage */
  const handleAddMovie = useCallback(
    (jarId, title) => addCustomMovie(jarId, title),
    [addCustomMovie]
  );

  return (
    <>
      {/* Decorative animated gradient background */}
      <div className="shimmer-bg" aria-hidden="true" />

      <div className="app">
        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">🍯 Jars of Movies</h1>
          <p className="app-subtitle">
            Pick a mood — let a movie find you ✨
          </p>
        </header>

        {/* Jar grid — memoized, unaffected by modal state */}
        <JarGrid jars={jars} onJarClick={handleJarClick} />
      </div>

      {/* ----------------------------------------------------------------
          Animation layer (paper slips + dim overlay + modal card)
          AnimatePresence handles mount/unmount with exit animations
      ---------------------------------------------------------------- */}
      <AnimatePresence>
        {activeJar && activeRect && (
          <PaperSlipAnimation
            key={`animation-${activeJar.id}`} // remount on each new jar click
            jarRect={activeRect}
            jar={activeJar}
            movie={activeMovie}
            onClose={handleClose}
            onAddMovie={handleOpenAddModal}
          />
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------
          Add Movie sub-modal
          Rendered above the animation layer (z-index 120)
      ---------------------------------------------------------------- */}
      <AnimatePresence>
        {showAddModal && activeJar && (
          <AddMovieModal
            key="add-modal"
            jar={activeJar}
            onAdd={handleAddMovie}
            onClose={handleCloseAddModal}
          />
        )}
      </AnimatePresence>
    </>
  );
});

export default App;
