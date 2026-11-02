import { Router } from 'express';
import Course from '../models/Course.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

router.post('/', verifyToken, authorizeRoles('instructor', 'admin'), async (req, res, next) => {
  try {
    const { title, description, category, level, price, thumbnail = '' } = req.body ?? {};
    if (
      typeof title !== 'string' || !title.trim()
      || typeof description !== 'string' || !description.trim()
      || typeof category !== 'string' || !category.trim()
    ) {
      return res.status(400).json({ message: 'Título, descripción y categoría son obligatorios' });
    }
    if (title.trim().length > 120 || description.trim().length > 2000 || category.trim().length > 60) {
      return res.status(400).json({ message: 'Revisa la longitud del título, la descripción y la categoría' });
    }
    if (thumbnail !== undefined && typeof thumbnail !== 'string') {
      return res.status(400).json({ message: 'La imagen debe ser una URL válida' });
    }

    const normalizedPrice = Number(price);
    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return res.status(400).json({ message: 'Selecciona un nivel válido' });
    }
    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      return res.status(400).json({ message: 'El precio debe ser un número igual o mayor que cero' });
    }

    const course = new Course({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      level,
      price: normalizedPrice,
      thumbnail: typeof thumbnail === 'string' ? thumbnail.trim() : '',
      instructor: req.user.id,
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
});

export default router;
