import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAuthMutation } from '../hooks/useAuthMutation.js';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: loginMutation } = useAuthMutation();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await loginMutation(form);
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Revise sus datos');
    }
  };

  return (
    <main className="page-section">
      <section className="form-box">
        <h1>Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="form-stack">
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Correo electrónico" type="email" required className="field" />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contraseña" type="password" required className="field" />
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="button button-primary">Ingresar</button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
