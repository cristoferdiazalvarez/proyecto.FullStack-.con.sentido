import { useEffect, useState } from 'react';
import API from '../services/api.js';

export const useFetchCourses = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get('/courses');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { data, isLoading, error };
};
