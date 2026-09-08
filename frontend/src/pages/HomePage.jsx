import { Link as RouterLink } from 'react-router-dom';
import { useFetchCourses } from '../hooks/useCourses.js';
import { useFilteredCourses } from '../hooks/useFilteredCourses.js';
import CourseCard from '../components/CourseCard.jsx';
import CourseFilter from '../components/CourseFilter.jsx';

const HomePage = () => {
  const { data: courses, isLoading } = useFetchCourses();
  const { filteredCourses, category, setCategory, search, setSearch } = useFilteredCourses(courses);

  return (
    <main className="page-section">
      <section className="hero-shell">
        <div>
          <h1>Cursos para aprender con propósito</h1>
          <p className="lead">Descubre cursos de backend, frontend, UX/UI y herramientas en una plataforma pensada para tu crecimiento.</p>
          <RouterLink to="/register" className="button button-primary">Comenzar ahora</RouterLink>
        </div>
      </section>

      <CourseFilter search={search} setSearch={setSearch} category={category} setCategory={setCategory} />

      <section className="section-heading">
        <div>
          <h2>Cursos disponibles</h2>
          <div className="tag-row">
            <span className="tag tag-purple">React</span>
            <span className="tag tag-blue">Node.js</span>
            <span className="tag tag-green">UX/UI</span>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="loader">Cargando cursos...</div>
      ) : (
        <div className="grid cards-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;
