// middleware/uploadMiddleware.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload folder path
const uploadDir = path.join(__dirname, '../uploads');

// Check if uploads folder exists, if not create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); 
    const uniqueName = Date.now() + ext; 
    cb(null, uniqueName);
  }
});

// File filter for image types only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, png files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
