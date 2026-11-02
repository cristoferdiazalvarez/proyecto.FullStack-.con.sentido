import { Link as RouterLink } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <article className="card">
    {course.thumbnail
      ? <img src={course.thumbnail} alt={course.title} className="card-image" />
      : <div className="card-image card-image-placeholder" role="img" aria-label={`Imagen no disponible para ${course.title}`}>Curso</div>}
    <div className="card-content">
      <span className="tag tag-purple">{course.category}</span>
      <h3 className="card-title">{course.title}</h3>
      <p className="card-description">{course.description}</p>
      <p className="card-meta">Nivel: {course.level}</p>
      <RouterLink to={`/course/${course._id}`} className="button button-primary card-action">Ver curso</RouterLink>
    </div>
  </article>
);

export default CourseCard;
