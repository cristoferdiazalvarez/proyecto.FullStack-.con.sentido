import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import csv from 'csv-parser';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

dotenv.config();

const csvFile = path.resolve('src/seed/data.csv');
const createTempDir = (name) => {
  const dir = path.resolve('./tmp', `${name}-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};
const users = [];
const courses = [];
const enrollments = [];

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

let mongod = null;

const getMongoUri = async () => {
  const uri = process.env.MONGODB_URI;
  if (uri && (await tryConnectUri(uri))) return uri;

  console.warn('Usando MongoDB en memoria para seed.');
  const cacheDir = path.resolve('node_modules/.cache/mongodb-memory-server');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const findCachedBinary = (dir) => {
    try {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        if (f.startsWith('mongod')) return path.resolve(dir, f);
      }
    } catch (e) {
      return null;
    }
    return null;
  };
  const cachedBinary = findCachedBinary(cacheDir);

  // Reintentos para superar fallos intermitentes al arrancar mongod
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const dbPath = createTempDir(`mongo-seed-${attempt}`);
    try {
      mongod = await MongoMemoryServer.create({
        instance: { dbPath, storageEngine: 'ephemeralForTest', port: 0, ip: '127.0.0.1' },
        binary: { downloadDir: cacheDir }
      });
      return mongod.getUri();
    } catch (err) {
      console.warn(`Intento ${attempt} falló al iniciar mongod:`, err && err.message ? err.message : err);
      try {
        if (mongod) await mongod.stop();
      } catch (e) {}
      // pequeño retardo antes del siguiente intento
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // último intento usando el binario directo si existe
  if (cachedBinary) {
    try {
      console.warn('Intentando con el binario caché directo:', cachedBinary);
      mongod = await MongoMemoryServer.create({
        instance: { dbPath: createTempDir('mongo-seed-final'), storageEngine: 'ephemeralForTest', port: 0, ip: '127.0.0.1' },
        binary: { systemBinary: cachedBinary }
      });
      return mongod.getUri();
    } catch (e) {
      console.warn('Fallback con binario directo falló:', e && e.message ? e.message : e);
      try { if (mongod) await mongod.stop(); } catch (_) {}
    }
  }

  throw new Error('No fue posible iniciar MongoDB en memoria tras varios intentos');
};

const parseCsv = () => new Promise((resolve, reject) => {
  fs.createReadStream(csvFile)
    .pipe(csv())
    .on('data', (row) => {
      if (row.type === 'user') users.push(row);
      if (row.type === 'course') courses.push(row);
      if (row.type === 'enrollment') enrollments.push(row);
    })
    .on('end', resolve)
    .on('error', reject);
});

const seed = async () => {
  try {
    const uri = await getMongoUri();
    await mongoose.connect(uri);
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();

    const userDocs = await User.insertMany(users.map((item) => ({
      name: item.name,
      email: item.email,
      password: item.password,
      role: item.role,
      avatarUrl: item.avatarUrl
    })));

    const courseDocs = await Course.insertMany(courses.map((item) => ({
      title: item.title,
      description: item.description,
      category: item.category,
      level: item.level,
      price: Number(item.price),
      instructor: userDocs.find((user) => user.email === item.instructorEmail)._id,
      thumbnail: item.thumbnail
    })));

    await Enrollment.insertMany(enrollments.map((item) => ({
      student: userDocs.find((user) => user.email === item.studentEmail)._id,
      course: courseDocs.find((course) => course.title === item.courseTitle)._id,
      progress: Number(item.progress) || 0
    })));

    console.log('Datos sembrados correctamente');
    process.exit(0);
  } catch (error) {
    console.error(error);
    if (mongod) {
      await mongod.stop();
    }
    process.exit(1);
  }
};

parseCsv().then(seed).catch(async (error) => {
  console.error('Error leyendo el CSV', error);
  if (mongod) {
    await mongod.stop();
  }
  process.exit(1);
});
