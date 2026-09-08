import { useAuth } from '../context/AuthContext.jsx';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <main className="page-section">
      <section className="detail-card">
        <div className="detail-content">
          <h1>Mi perfil</h1>
          <p className="lead">Nombre: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <div className="tag tag-purple">Rol: {user?.role}</div>
          <p className="text-muted">Esta página muestra detalles de usuario y debe reforzar el control de acceso en rutas privadas.</p>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
