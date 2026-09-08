import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '../middleware/auth.js';

let parser;
// Si están configuradas las credenciales de Cloudinary, intentamos usarlo.
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  try {
    const { CloudinaryStorage } = await import('multer-storage-cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'fullstack_proyecto',
        allowed_formats: ['jpg', 'jpeg', 'png'],
      },
    });

    parser = multer({ storage });
  } catch (e) {
    // Si falla la importación, caemos al fallback local
    console.warn('No se pudo cargar multer-storage-cloudinary, usando almacenamiento local.', e && e.message);
  }
}

// Fallback: almacenamiento en disco local
if (!parser) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      const uniq = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniq}-${file.originalname}`);
    },
  });
  parser = multer({ storage });
}
const router = Router();

router.post('/', verifyToken, parser.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Archivo no recibido' });
  res.json({ url: req.file.path, publicId: req.file.filename });
});

export default router;
