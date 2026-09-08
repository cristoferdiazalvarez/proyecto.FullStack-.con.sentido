import { Link as RouterLink } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <article className="card">
    <img src={course.thumbnail} alt={course.title} className="card-image" />
    <div className="card-content">
      <span className="tag tag-purple">{course.category}</span>
      <h3 className="card-title">{course.title}</h3>
      <p className="card-description">{course.description}</p>
      <p className="card-meta">Nivel: {course.level}</p>
      <RouterLink to={`/course/${course._id}`} className="button button-primary">Ver curso</RouterLink>
    </div>
  </article>
);

export default CourseCard;
