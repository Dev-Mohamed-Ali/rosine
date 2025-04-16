import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure Multer to use Cloudinary
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Upload Image to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    res.json({ image: result.secure_url }); // ✅ Return Cloudinary image URL
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error });
  }
});

export default router;
