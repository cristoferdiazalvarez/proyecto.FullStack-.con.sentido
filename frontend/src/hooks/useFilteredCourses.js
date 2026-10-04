import { useDeferredValue, useMemo, useState } from 'react';

export const useFilteredCourses = (courses) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase());

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      const matchesCategory = category === 'all'
        || (course.category || '').toLocaleLowerCase() === category.toLocaleLowerCase();
      const matchesSearch = [course.title, course.description, course.level].some((field) =>
        (field || '').toLocaleLowerCase().includes(deferredSearch),
      );
      return matchesCategory && matchesSearch;
    });
  }, [courses, category, deferredSearch]);

  return { filteredCourses, category, setCategory, search, setSearch };
};
