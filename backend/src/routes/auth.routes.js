import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

const generateToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'El correo ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ message: 'Usuario registrado correctamente', user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }, token });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = generateToken(user);
    res.json({ message: 'Login exitoso', user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }, token });
  } catch (error) {
    next(error);
  }
});

export default router;
