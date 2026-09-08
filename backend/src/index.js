import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

const createTempDir = (name) => {
  const dir = path.resolve('./tmp', `${name}-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/upload', uploadRoutes);

app.use(errorHandler);

const tryConnectUri = async (uri) => {
  try {
    const tempConn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 2000 }).asPromise();
    await tempConn.close();
    return true;
  } catch (error) {
    console.warn('No se pudo conectar a MongoDB en', uri, ':', error.message);
    return false;
  }
};

const getMongoUri = async () => {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    // Intentar conectar varias veces antes de caer al in-memory
    const maxUriAttempts = 10;
    for (let i = 1; i <= maxUriAttempts; i += 1) {
      if (await tryConnectUri(uri)) return uri;
      console.warn(`Intento de conexión a MONGODB_URI ${i}/${maxUriAttempts} fallido, reintentando...`);
      await new Promise((r) => setTimeout(r, 1000));
    }
    console.warn('No fue posible conectar a MONGODB_URI, continuando con Mongo en memoria.');
  }
  console.warn('Iniciando MongoDB en memoria.');
  const cacheDir = path.resolve('node_modules/.cache/mongodb-memory-server');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  // Reintentos para mayor robustez en entornos con arranques intermitentes
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const dbPath = createTempDir(`mongo-${attempt}`);
    try {
      const mongod = await MongoMemoryServer.create({
        instance: { dbPath, storageEngine: 'ephemeralForTest', port: 0, ip: '127.0.0.1' },
        binary: { downloadDir: cacheDir }
      });
      return mongod.getUri();
    } catch (err) {
      console.warn(`Intento ${attempt} falló al iniciar mongod:`, err && err.message ? err.message : err);
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  throw new Error('No fue posible iniciar MongoDB en memoria tras varios intentos');
};

const start = async () => {
  try {
    const uri = await getMongoUri();
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB en', uri);
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
  } catch (error) {
    console.error('Error al conectar a MongoDB', error);
    process.exit(1);
  }
};

start();
