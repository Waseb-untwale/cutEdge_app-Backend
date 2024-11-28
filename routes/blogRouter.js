const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const blogCtrl = require('../controllers/blogCtrl');
const uploadSingle = require('../middleware/uploadSingle');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set up file filter to allow only certain file types
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true); // File is valid
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});


router.post('/add-blog', uploadSingle.single('image'), blogCtrl.addNews);
router.get('/blogs', blogCtrl.getNews);
router.put('/update-blog/:id', upload.single('image'), blogCtrl.updateNews);
router.get('/getBlogById/:id', blogCtrl.getBlogById)
router.delete('/deleteBlog/:id', blogCtrl.deleteBlog)
module.exports = router;
