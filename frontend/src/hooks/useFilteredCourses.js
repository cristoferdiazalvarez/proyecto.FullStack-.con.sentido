import { useMemo, useState } from 'react';

export const useFilteredCourses = (courses) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const matchesCategory = category === 'all' || course.category.toLowerCase() === category.toLowerCase();
      const matchesSearch = [course.title, course.description, course.level].some((field) =>
        field.toLowerCase().includes(search.toLowerCase()),
      );
      return matchesCategory && matchesSearch;
    });
  }, [courses, category, search]);

  return { filteredCourses, category, setCategory, search, setSearch };
};
