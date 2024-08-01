const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Thiết lập lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { type } = req.body;
    const dir = `uploads/${type}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const { name } = req.body;
    const fileName = `${name}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

// Kiểm tra loại file
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
};

// Khởi tạo upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
