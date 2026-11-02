import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';

const initialForm = {
  title: '',
  description: '',
  category: '',
  level: 'beginner',
  price: '0',
  thumbnail: '',
};

const CreateCoursePage = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const { data } = await API.post('/courses', { ...form, price: Number(form.price) });
      navigate(`/course/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo crear el curso. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="page-section">
      <section className="form-box course-form-box">
        <p className="eyebrow">Área de enseñanza</p>
        <h1>Crear un curso</h1>
        <p className="text-muted">Completa la información para publicar un nuevo curso en el catálogo.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label className="form-label">
            Título
            <input name="title" value={form.title} onChange={updateField} maxLength={120} required className="field" />
          </label>
          <label className="form-label">
            Descripción
            <textarea name="description" value={form.description} onChange={updateField} rows="5" maxLength={2000} required className="field field-textarea" />
          </label>
          <label className="form-label">
            Categoría
            <input name="category" value={form.category} onChange={updateField} maxLength={60} required className="field" />
          </label>
          <div className="form-fields-row">
            <label className="form-label">
              Nivel
              <select name="level" value={form.level} onChange={updateField} className="field">
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </label>
            <label className="form-label">
              Precio (USD)
              <input name="price" value={form.price} onChange={updateField} type="number" min="0" step="0.01" required className="field" />
            </label>
          </div>
          <label className="form-label">
            URL de imagen (opcional)
            <input name="thumbnail" value={form.thumbnail} onChange={updateField} type="url" className="field" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="button button-primary" disabled={isSaving}>
            {isSaving ? 'Publicando...' : 'Publicar curso'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateCoursePage;
