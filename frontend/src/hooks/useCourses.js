import { useEffect, useState } from 'react';
import API from '../services/api.js';

export const useFetchCourses = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      try {
        const response = await API.get('/courses', { signal: controller.signal });
        setData(response.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.response?.data?.message || 'No se pudieron cargar los cursos. Inténtalo de nuevo.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchCourses();
    return () => controller.abort();
  }, []);

  return { data, isLoading, error };
};
