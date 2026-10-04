import fs from 'node:fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import csv from 'csv-parser';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

dotenv.config();

const csvFile = new URL('./data.csv', import.meta.url);
const users = [];
const courses = [];
const enrollments = [];

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
    if (!process.env.MONGODB_URI) {
      throw new Error('Configura MONGODB_URI en backend/.env para importar los datos en una base persistente.');
    }

    await parseCsv();
    if (users.length === 0 || courses.length === 0) {
      throw new Error('El CSV debe contener al menos un usuario y un curso.');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const userOperations = await Promise.all(users.map(async (item) => ({
      updateOne: {
        filter: { email: item.email.trim().toLowerCase() },
        update: {
          $set: {
            name: item.name.trim(),
            email: item.email.trim().toLowerCase(),
            password: await bcrypt.hash(item.password, 10),
            role: item.role,
            avatarUrl: item.avatarUrl
          }
        },
        upsert: true
      }
    })));
    await User.bulkWrite(userOperations);

    const userDocs = await User.find({ email: { $in: users.map((item) => item.email.trim().toLowerCase()) } });
    const usersByEmail = new Map(userDocs.map((user) => [user.email, user]));
    const courseOperations = courses.map((item) => {
      const instructor = usersByEmail.get(item.instructorEmail.trim().toLowerCase());
      if (!instructor) throw new Error(`No existe el instructor ${item.instructorEmail} del curso "${item.title}".`);

      return {
        updateOne: {
          filter: { title: item.title.trim() },
          update: {
            $set: {
              title: item.title.trim(),
              description: item.description,
              category: item.category,
              level: item.level,
              price: Number(item.price),
              instructor: instructor._id,
              thumbnail: item.thumbnail
            }
          },
          upsert: true
        }
      };
    });
    await Course.bulkWrite(courseOperations);

    const courseDocs = await Course.find({ title: { $in: courses.map((item) => item.title.trim()) } });
    const coursesByTitle = new Map(courseDocs.map((course) => [course.title, course]));
    const uniqueEnrollments = new Map();
    enrollments.forEach((item) => {
      const student = usersByEmail.get(item.studentEmail.trim().toLowerCase());
      const course = coursesByTitle.get(item.courseTitle.trim());
      const progress = Number(item.progress);
      if (!student) throw new Error(`No existe el estudiante ${item.studentEmail} de una matrícula.`);
      if (!course) throw new Error(`No existe el curso "${item.courseTitle}" de una matrícula.`);
      if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
        throw new Error(`El progreso de "${item.courseTitle}" debe estar entre 0 y 100.`);
      }

      uniqueEnrollments.set(`${student._id}:${course._id}`, { student, course, progress });
    });
    const enrollmentOperations = Array.from(uniqueEnrollments.values(), ({ student, course, progress }) => ({
        updateOne: {
          filter: { student: student._id, course: course._id },
          update: { $set: { student: student._id, course: course._id, progress } },
          upsert: true
        }
    }));
    if (enrollmentOperations.length > 0) await Enrollment.bulkWrite(enrollmentOperations);

    console.log(`Importación completada: ${users.length} usuarios, ${courses.length} cursos y ${enrollments.length} filas de matrícula (${enrollmentOperations.length} relaciones únicas).`);
  } catch (error) {
    console.error('No se pudieron importar los datos:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
