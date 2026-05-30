/**
 * useJarMovies.js
 * Custom hook that merges predefined jar movies with user-added custom movies
 * stored in localStorage under "jars_movies_<jarId>".
 *
 * New movies are ONLY appended to localStorage — the original data array is
 * never mutated.
 */

import { useState, useCallback, useMemo } from 'react';
import { JARS } from '../data/jars';

const LS_KEY = (jarId) => `jars_movies_${jarId}`;

/** Read custom movies for a jar from localStorage (deduplication against base) */
function readCustomMovies(jarId, baseMovies) {
  try {
    const raw = localStorage.getItem(LS_KEY(jarId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Deduplicate against base list (case-insensitive)
    const baseSet = new Set(baseMovies.map((m) => m.toLowerCase()));
    return parsed.filter((m) => typeof m === 'string' && !baseSet.has(m.toLowerCase()));
  } catch {
    return [];
  }
}

/** Build the full merged movies list for a single jar */
function buildMovieList(jar) {
  const custom = readCustomMovies(jar.id, jar.movies);
  return [...jar.movies, ...custom];
}

export function useJarMovies() {
  // We track a "version" counter so that adding a movie triggers a re-read
  const [version, setVersion] = useState(0);

  /** All jars with their merged movie lists */
  const jars = useMemo(
    () =>
      JARS.map((jar) => ({
        ...jar,
        movies: buildMovieList(jar),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version]
  );

  /**
   * Add a custom movie to a jar.
   * Reads existing custom list, appends if not duplicate, writes back.
   * Returns true if added, false if duplicate.
   */
  const addCustomMovie = useCallback((jarId, movieTitle) => {
    const jar = JARS.find((j) => j.id === jarId);
    if (!jar) return false;

    const title = movieTitle.trim();
    if (!title) return false;

    const allMovies = buildMovieList(jar);
    const isDuplicate = allMovies.some((m) => m.toLowerCase() === title.toLowerCase());
    if (isDuplicate) return false;

    // Read existing custom list (raw, without dedup filter) and append
    let existing = [];
    try {
      const raw = localStorage.getItem(LS_KEY(jarId));
      if (raw) existing = JSON.parse(raw) ?? [];
    } catch { /* ignore */ }

    localStorage.setItem(LS_KEY(jarId), JSON.stringify([...existing, title]));
    setVersion((v) => v + 1); // trigger re-render
    return true;
  }, []);

  return { jars, addCustomMovie };
}
