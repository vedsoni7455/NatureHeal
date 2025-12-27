import path from 'path';
import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';

const router = express.Router();

// Native ESM checks for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        // Save directly to frontend public folder so it's accessible immediately
        // Note: In production you'd use a cloud bucket (S3/Cloudinary) or a shared volume
        cb(null, path.join(__dirname, '../../frontend/public/uploads'));
    },
    filename(req, file, cb) {
        // Create unique filename: fieldname-timestamp.ext
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Route: POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    // Return the path relative to the public folder
    // Frontend runs on port 3000 and serves from /public, so path is /uploads/filename
    // The backend doesn't need to serve it if valid in frontend public dir
    const imagePath = `/uploads/${req.file.filename}`;

    res.send(imagePath);
});

export default router;
