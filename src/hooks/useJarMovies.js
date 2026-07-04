import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export function useJarMovies() {
  const [jars, setJars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jars on mount
  useEffect(() => {
    async function fetchJars() {
      try {
        const response = await fetch(`${API_BASE_URL}/jars`);
        if (!response.ok) {
          throw new Error('Failed to fetch jars');
        }
        const data = await response.json();
        setJars(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJars();
  }, []);

  /**
   * Add a custom movie to a jar via API.
   * Optimistically updates the local state for immediate feedback.
   */
  const addCustomMovie = useCallback(async (jarId, movieTitle) => {
    const title = movieTitle.trim();
    if (!title) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/jars/${jarId}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to add movie:', errorData.detail);
        return false;
      }

      // Optimistically update local state
      setJars(prevJars => 
        prevJars.map(jar => {
          if (jar.id === jarId) {
            return {
              ...jar,
              movies: [...jar.movies, title]
            };
          }
          return jar;
        })
      );
      
      return true;
    } catch (err) {
      console.error('Error adding custom movie:', err);
      return false;
    }
  }, []);

  return { jars, addCustomMovie, isLoading, error };
}
