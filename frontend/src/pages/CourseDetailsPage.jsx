import { useEffect, useState } from 'react';
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
  const [enrollmentState, setEnrollmentState] = useState(user ? 'checking' : 'signed-out');
  const course = courses?.find((item) => item._id === id);

  useEffect(() => {
    if (!user) {
      setEnrollmentState('signed-out');
      return undefined;
    }

    const controller = new AbortController();
    setEnrollmentState('checking');
    API.get('/enrollments', { signal: controller.signal })
      .then(({ data }) => {
        const isEnrolled = data.some((enrollment) => String(enrollment.course?._id) === id);
        setEnrollmentState(isEnrolled ? 'enrolled' : 'not-enrolled');
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setEnrollmentState('error');
          setEnrollmentMessage(error.response?.data?.message || 'No se pudo comprobar tu inscripción.');
        }
      });

    return () => controller.abort();
  }, [id, user]);

  const handleEnrollment = async () => {
    if (!user) {
      navigate('/register');
      return;
    }
    if (enrollmentState === 'enrolled' || enrollmentState === 'checking') return;

    setIsEnrolling(true);
    setEnrollmentMessage('');
    try {
      await API.post('/enrollments', { course: id });
      setEnrollmentState('enrolled');
      setEnrollmentMessage('Te has inscrito correctamente en este curso.');
    } catch (error) {
      if (error.response?.status === 409) setEnrollmentState('enrolled');
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
        {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="detail-image" />}
        <div className="detail-content">
          <span className="tag tag-purple">{course.category}</span>
          <h1>{course.title}</h1>
          <p className="lead">{course.description}</p>
          <div className="detail-meta">
            <span>Instructor: {course.instructor?.name}</span>
            <span>Precio: ${course.price}</span>
            <span>Nivel: {course.level}</span>
          </div>
          <button
            type="button"
            className="button button-primary"
            onClick={handleEnrollment}
            disabled={isEnrolling || enrollmentState === 'checking' || enrollmentState === 'enrolled'}
          >
            {isEnrolling ? 'Inscribiendo...' : enrollmentState === 'checking' ? 'Comprobando inscripción...' : enrollmentState === 'enrolled' ? 'Ya estás inscrito' : user ? 'Inscribirme' : 'Inicia sesión para inscribirte'}
          </button>
          {enrollmentState === 'enrolled' && <p className="enrollment-success" role="status">{enrollmentMessage || 'Ya formas parte de este curso. Puedes continuar con tu aprendizaje.'}</p>}
          {enrollmentMessage && enrollmentState !== 'enrolled' && <p className="form-error" role="alert">{enrollmentMessage}</p>}
        </div>
      </article>
    </main>
  );
};

export default CourseDetailsPage;
