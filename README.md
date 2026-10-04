# Proyecto FullStack con Sentido

Plataforma de cursos para estudiantes e instructores, construida con React, React Router, Node.js, Express y MongoDB/Mongoose. Incluye autenticación JWT, matrículas relacionadas con usuarios y cursos, filtros de catálogo y subida opcional de imágenes con Cloudinary.

## Estructura

- `backend/`: API, modelos Mongoose y carga inicial de datos.
- `frontend/`: aplicación React, páginas, componentes, hooks y estilos CSS.

## Datos y relaciones

`backend/src/seed/data.csv` es la hoja de datos disponible, exportada desde Excel como CSV UTF-8. Sus filas de tipo `user`, `course` y `enrollment` generan las colecciones `users`, `courses` y `enrollments`. Los cursos referencian a su instructor; cada matrícula referencia a un usuario y un curso mediante ObjectId.

El importador hace upsert por correo, título y pareja estudiante-curso; volver a ejecutarlo no vacía las colecciones ni duplica esas entidades. Las contraseñas de la hoja se almacenan con bcrypt. Los datos de acceso del CSV son solo para desarrollo: cámbialos antes de cualquier despliegue.

## Puesta en marcha

Requisitos: Node.js 20 o posterior y MongoDB local o una instancia MongoDB accesible.

1. Instala y arranca MongoDB localmente o configura una instancia MongoDB accesible.
2. Desde `backend/`, copia `.env.example` a `.env`, configura `MONGODB_URI` y reemplaza `JWT_SECRET` por una clave aleatoria propia de al menos 32 caracteres. No publiques `.env`.
3. Ejecuta `npm install` y después `npm run seed` desde `backend/` para importar los datos.
4. Ejecuta `npm run dev` desde `backend/` para iniciar la API en `http://localhost:4000`.
5. Desde `frontend/`, ejecuta `npm install` y `npm run dev` para iniciar Vite.

La API y el importador requieren la misma `MONGODB_URI` persistente. Si no está configurada, el proceso se detiene con un mensaje claro; no usa una base en memoria que se pierda al cerrar.

## Arquitectura

- Backend: rutas por recurso, middleware de autenticación/autorización y modelos separados para usuarios, cursos y matrículas.
- Frontend: páginas por ruta, componentes reutilizables, hooks para carga y filtrado, y hojas CSS separadas para tokens, estilos globales y componentes.
