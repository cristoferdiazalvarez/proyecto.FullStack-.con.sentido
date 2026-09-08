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
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
});

export default router;
