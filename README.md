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

## Despliegue

El proyecto se puede publicar separando la API en [Render](https://render.com/), el frontend en [Vercel](https://vercel.com/) y la base de datos en [MongoDB Atlas](https://www.mongodb.com/atlas). Crea una base de datos en Atlas y permite las conexiones de red del servicio de Render.

### API en Render

1. En Render, crea un **Blueprint** desde el repositorio. Render leerá [render.yaml](render.yaml) y creará la API con los comandos, el chequeo de salud y un `JWT_SECRET` generado.
2. Cuando lo solicite, configura `MONGODB_URI` con la cadena de conexión de Atlas. Tras crear el servicio, configura `FRONTEND_URL` con el dominio de producción de Vercel, sin barra final.
3. Cuando el servicio esté activo, copia su URL pública, por ejemplo `https://nombre-del-servicio.onrender.com`. El chequeo `https://nombre-del-servicio.onrender.com/api/health` debe responder `{"status":"ok"}`.
4. Para cargar los cursos de demostración, ejecuta `npm run seed` desde `backend/` en tu equipo, con `MONGODB_URI` apuntando a Atlas, `NODE_ENV=production` y una variable temporal `SEED_PASSWORD`. Esa contraseña sustituye las contraseñas del CSV para todas las cuentas de demostración y, en producción, esas cuentas se crean solo con rol estudiante. No añadas estas variables a archivos versionados ni compartas sus valores. Crea cualquier cuenta de instructor o administrador por un proceso separado y controlado.

### Frontend en Vercel

1. Importa el mismo repositorio y establece `frontend` como **Root Directory**.
2. Usa `npm run build` como comando de compilación y `dist` como directorio de salida.
3. Añade `VITE_API_URL` con la URL pública de Render seguida de `/api`, por ejemplo `https://nombre-del-servicio.onrender.com/api`, y despliega.
4. La configuración de [frontend/vercel.json](frontend/vercel.json) permite abrir o actualizar directamente las rutas de React.
5. Copia el dominio de producción de Vercel en `FRONTEND_URL` en Render para permitir las llamadas del navegador y vuelve a desplegar la API.

### Enlaces públicos

Después del despliegue, copia aquí las URLs reales que muestran Vercel y Render para poder compartirlas y verificar la entrega:

- Aplicación: pendiente de publicar en Vercel.
- API: pendiente de publicar en Render.

En desarrollo local, el frontend usa el proxy de Vite hacia `http://localhost:4000`. En producción usa `VITE_API_URL`; no necesita apuntar a `localhost`.

## Arquitectura

- Backend: rutas por recurso, middleware de autenticación/autorización y modelos separados para usuarios, cursos y matrículas.
- Frontend: páginas por ruta, componentes reutilizables, hooks para carga y filtrado, y hojas CSS separadas para tokens, estilos globales y componentes.
