import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true, min: 0 },
  thumbnail: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
