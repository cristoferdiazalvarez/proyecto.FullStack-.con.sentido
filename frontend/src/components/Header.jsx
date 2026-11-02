import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="header-shell">
      <nav className="nav-bar">
        <RouterLink to="/" className="brand-link">Plataforma Cursos</RouterLink>
        <div className="nav-items">
          <RouterLink to="/" className="nav-link">Inicio</RouterLink>
          {!user && <RouterLink to="/login" className="nav-link">Ingresar</RouterLink>}
          {!user && <RouterLink to="/register" className="nav-link">Crear cuenta</RouterLink>}
          {user && <RouterLink to="/profile" className="nav-link">Mi perfil</RouterLink>}
          {['instructor', 'admin'].includes(user?.role) && <RouterLink to="/courses/new" className="nav-link">Crear curso</RouterLink>}
          {user && <button type="button" className="button button-small" onClick={logout}>Salir</button>}
        </div>
      </nav>
    </header>
  );
};

export default Header;
