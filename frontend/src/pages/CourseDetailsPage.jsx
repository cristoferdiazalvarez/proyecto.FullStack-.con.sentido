import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetchCourses } from '../hooks/useCourses.js';
import API from '../services/api.js';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: courses, isLoading } = useFetchCourses();
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const course = courses?.find((item) => item._id === id);

  const handleEnrollment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    setEnrollmentMessage('');
    try {
      await API.post('/enrollments', { course: id });
      setEnrollmentMessage('Te has inscrito correctamente en este curso.');
    } catch (error) {
      setEnrollmentMessage(error.response?.data?.message || 'No se pudo completar la inscripción.');
    } finally {
      setIsEnrolling(false);
    }
  };

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
          <button type="button" className="button button-primary" onClick={handleEnrollment} disabled={isEnrolling}>
            {isEnrolling ? 'Inscribiendo...' : 'Inscribirme'}
          </button>
          {enrollmentMessage && <p role="status">{enrollmentMessage}</p>}
        </div>
      </article>
    </main>
  );
};

export default CourseDetailsPage;
