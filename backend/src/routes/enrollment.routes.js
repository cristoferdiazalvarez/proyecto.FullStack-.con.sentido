import { Router } from 'express';
import Enrollment from '../models/Enrollment.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('student', 'name email')
      .populate('course', 'title category');
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
});

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { course } = req.body;
    if (!course) return res.status(400).json({ message: 'Debes indicar un curso' });

    const existingEnrollment = await Enrollment.findOne({ student: req.user.id, course });
    if (existingEnrollment) return res.status(409).json({ message: 'Ya estás inscrito en este curso' });

    const enrollment = new Enrollment({ course, student: req.user.id });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
});

export default router;
