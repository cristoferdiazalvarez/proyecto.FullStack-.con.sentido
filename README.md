# Proyecto FullStack con Sentido

Este proyecto es una plataforma de cursos para estudiantes e instructores. Incluye:

- Backend con Node.js, Express y MongoDB
- Frontend con React, Chakra UI y React Query
- Autenticación con JWT
- Subida de imágenes opcional a Cloudinary
- Banco de datos generado mediante CSV y `fs`
- Relaciones entre usuarios, cursos y matrículas

## Estructura

- `/backend` - API y seeding de datos
- `/frontend` - aplicación React

## Cómo arrancar

### Backend

1. Copia `.env.example` a `.env`
2. Ajusta `MONGODB_URI`, `JWT_SECRET` y credenciales de Cloudinary si lo deseas
3. Instala dependencias: `cd backend && npm install`
4. Semilla datos: `npm run seed`
5. Ejecuta el servidor: `npm run dev`

### Frontend

1. Instala dependencias: `cd frontend && npm install`
2. Ejecuta la app: `npm run dev`

## Arquitectura

- Backend: rutas separadas por recursos, middleware de autenticación y autorización, modelo de usuarios, cursos y matrículas.
- Frontend: hooks personalizados, rutas protegidas, componentes reutilizables, estilo global con variables CSS y Chakra UI.

## Temática y sentido

La aplicación está pensada para estudiantes que desean encontrar y seguir cursos prácticos. El sitio ofrece filtros por categoría, roles de usuario y una interfaz enfocada en la experiencia de aprendizaje.
