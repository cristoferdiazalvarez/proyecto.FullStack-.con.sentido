import { Router } from 'express';
import Enrollment from '../models/Enrollment.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title category');
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
});

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const enrollment = new Enrollment({ ...req.body, student: req.user.id });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
});

export default router;
