import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import CourseCard from '../components/CourseCard.jsx';
import { useFetchCourses } from '../hooks/useCourses.js';
import API from '../services/api.js';

const ProfilePage = () => {
  const { user } = useAuth();
  const { data: courses, error: coursesError } = useFetchCourses();
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardError, setDashboardError] = useState('');
  const [isDashboardLoading, setIsDashboardLoading] = useState(user?.role !== 'instructor');

  useEffect(() => {
    const controller = new AbortController();
    setDashboardError('');

    const request = user?.role === 'admin'
      ? API.get('/users', { signal: controller.signal }).then(({ data }) => setUsers(data))
      : user?.role === 'student'
        ? API.get('/enrollments', { signal: controller.signal }).then(({ data }) => setEnrollments(data))
        : Promise.resolve();

    request
      .catch((error) => {
        if (!controller.signal.aborted) {
          setDashboardError(error.response?.data?.message || 'No se pudo cargar la información del perfil.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsDashboardLoading(false);
      });

    return () => controller.abort();
  }, [user?.role]);

  const roleLabels = { student: 'Estudiante', instructor: 'Instructor', admin: 'Administrador' };
  const instructorCourses = courses.filter((course) => String(course.instructor?._id ?? course.instructor) === user?.id);

  return (
    <main className="page-section">
      <section className="profile-card">
        <div className="detail-content">
          <p className="eyebrow">Tu espacio de aprendizaje</p>
          <h1>Mi perfil</h1>
          <p className="lead">Nombre: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <div className="tag tag-purple">Rol: {roleLabels[user?.role] || user?.role}</div>
        </div>
      </section>

      {dashboardError && <p className="catalog-feedback form-error" role="alert">{dashboardError}</p>}
      {coursesError && <p className="catalog-feedback form-error" role="alert">{coursesError}</p>}
      {isDashboardLoading && <div className="loader" role="status">Cargando tu espacio...</div>}

      {!isDashboardLoading && user?.role === 'student' && (
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Aprendizaje</p>
              <h2>Mis cursos</h2>
            </div>
          </div>
          {enrollments.length ? (
            <div className="grid cards-grid">
              {enrollments.filter((enrollment) => enrollment.course).map((enrollment) => (
                <CourseCard key={enrollment._id} course={enrollment.course} />
              ))}
            </div>
          ) : (
            <div className="catalog-feedback">Aún no tienes cursos. <RouterLink to="/">Explora el catálogo</RouterLink> y elige por dónde empezar.</div>
          )}
        </section>
      )}

      {user?.role === 'instructor' && (
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Enseñanza</p>
              <h2>Cursos impartidos</h2>
            </div>
            <RouterLink to="/courses/new" className="button button-primary">Crear curso</RouterLink>
          </div>
          {instructorCourses.length ? (
            <div className="grid cards-grid">
              {instructorCourses.map((course) => <CourseCard key={course._id} course={course} />)}
            </div>
          ) : (
            <div className="catalog-feedback">Todavía no has publicado cursos. Crea tu primer curso para empezar.</div>
          )}
        </section>
      )}

      {user?.role === 'admin' && !isDashboardLoading && (
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Administración</p>
              <h2>Gestión de la plataforma</h2>
            </div>
            <RouterLink to="/courses/new" className="button button-primary">Crear curso</RouterLink>
          </div>
          <div className="admin-summary">
            <span className="admin-count">{users.length}</span>
            <span>cuentas registradas</span>
          </div>
          <div className="user-list">
            {users.map((account) => (
              <article className="user-row" key={account._id}>
                <div>
                  <strong>{account.name}</strong>
                  <span>{account.email}</span>
                </div>
                <span className="tag tag-purple">{roleLabels[account.role] || account.role}</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProfilePage;
