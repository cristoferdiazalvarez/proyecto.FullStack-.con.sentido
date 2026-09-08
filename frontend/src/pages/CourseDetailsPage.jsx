import { useParams } from 'react-router-dom';
import { useFetchCourses } from '../hooks/useCourses.js';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { data: courses, isLoading } = useFetchCourses();
  const course = courses?.find((item) => item._id === id);

  if (isLoading) return <div className="loader">Buscando curso...</div>;
  if (!course) return <div className="page-section">Curso no encontrado.</div>;

  return (
    <main className="page-section">
      <article className="detail-card">
        <img src={course.thumbnail} alt={course.title} className="detail-image" />
        <div className="detail-content">
          <span className="tag tag-purple">{course.category}</span>
          <h1>{course.title}</h1>
          <p className="lead">{course.description}</p>
          <div className="detail-meta">
            <span>Instructor: {course.instructor?.name}</span>
            <span>Precio: ${course.price}</span>
            <span>Nivel: {course.level}</span>
          </div>
          <button type="button" className="button button-primary">Inscribirme</button>
        </div>
      </article>
    </main>
  );
};

export default CourseDetailsPage;
