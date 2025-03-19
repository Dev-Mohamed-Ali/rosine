import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    res.json(`/uploads/${req.file.filename}`);
});

export default router;
