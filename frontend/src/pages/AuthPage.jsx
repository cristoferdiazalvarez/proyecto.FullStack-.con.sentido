import { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAuthMutation } from '../hooks/useAuthMutation.js';

const MIN_PASSWORD_LENGTH = 10;

const AuthPage = () => {
  const isRegistering = useLocation().pathname === '/register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login: loginMutation, register } = useAuthMutation();
  const { login, user } = useAuth();

  useEffect(() => {
    setError('');
    setForm((current) => ({ ...current, password: '' }));
  }, [isRegistering]);

  if (user) return <Navigate to="/" replace />;

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = isRegistering
        ? await register({ name: form.name, email: form.email, password: form.password })
        : await loginMutation({ email: form.email, password: form.password });
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || (isRegistering ? 'No se pudo crear la cuenta.' : 'Revisa tu correo y contraseña.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-section auth-page">
      <section className="form-box auth-box">
        <p className="eyebrow">Plataforma Cursos</p>
        <h1>{isRegistering ? 'Crea tu cuenta' : 'Qué bueno verte de nuevo'}</h1>
        <p className="text-muted">
          {isRegistering ? 'Regístrate para guardar tu progreso y aprender a tu ritmo.' : 'Ingresa para continuar aprendiendo.'}
        </p>
        <div className="auth-switch" aria-label="Acceso a tu cuenta">
          <RouterLink to="/login" className={`auth-switch-link${!isRegistering ? ' is-active' : ''}`} aria-current={!isRegistering ? 'page' : undefined}>
            Ingresar
          </RouterLink>
          <RouterLink to="/register" className={`auth-switch-link${isRegistering ? ' is-active' : ''}`} aria-current={isRegistering ? 'page' : undefined}>
            Crear cuenta
          </RouterLink>
        </div>
        <form onSubmit={handleSubmit} className="form-stack">
          {isRegistering && (
            <label className="form-label">
              Nombre
              <input name="name" value={form.name} onChange={updateField} autoComplete="name" required className="field" />
            </label>
          )}
          <label className="form-label">
            Correo electrónico
            <input name="email" value={form.email} onChange={updateField} type="email" autoComplete="email" required className="field" />
          </label>
          <label className="form-label">
            Contraseña
            <input
              name="password"
              value={form.password}
              onChange={updateField}
              type="password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength={isRegistering ? MIN_PASSWORD_LENGTH : undefined}
              required
              className="field"
            />
          </label>
          {isRegistering && <p className="field-hint">Usa al menos {MIN_PASSWORD_LENGTH} caracteres.</p>}
          {error && <div className="form-error" role="alert">{error}</div>}
          <button type="submit" className="button button-primary auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Un momento...' : isRegistering ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AuthPage;
