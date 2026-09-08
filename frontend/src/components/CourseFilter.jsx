const categories = [
  'all',
  'Programación',
  'Backend',
  'Diseño',
  'Cloud',
  'Testing',
  'Frontend',
  'DevOps',
  'AI',
  'Data',
  'Herramientas',
  'Marketing',
  'Gestión',
];

const CourseFilter = ({ search, setSearch, category, setCategory }) => (
  <section className="filter-shell">
    <div className="filter-row">
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar curso o nivel" className="field" />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="field">
        {categories.map((item) => (
          <option key={item} value={item}>{item === 'all' ? 'Todas las categorías' : item}</option>
        ))}
      </select>
    </div>
  </section>
);

export default CourseFilter;
