const express = require("express");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const router = express.Router();
const authenticateToken = require('../middleware/jwt-check');

const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create folder if not exists
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.post('/profile', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ filename: req.file.filename });
});

router.post('/upload-single', authenticateToken, upload.single('picture'), async (req, res) => {
    try {
      const filePath = req.file.filename;  // ดึงชื่อไฟล์ที่อัปโหลด
  
      let ids = await req.db('student')
        .where({ id: req.user.id })
        .update({ picture: filePath });  // อัปเดตไฟล์รูปโปรไฟล์ตาม student_id
  
      res.json({
        ok: 1,
        id: ids[0],
        message: 'อัปโหลดไฟล์สำเร็จ',
        file: req.file
      });
    } catch (error) {
      res.json({ ok: 0, error: error.message });
    }
  });

  router.post('/upload-single-student', upload.single('picture'), async (req, res) => {
    try {
      const filePath = req.file.filename;  // ดึงชื่อไฟล์ที่อัปโหลด
      const student_Id = req.body.student_id;
  
      let ids = await req.db('student')
        .where({ student_id: student_Id })
        .update({ picture: filePath });  // อัปเดตไฟล์รูปโปรไฟล์ตาม student_id
  
      res.json({
        ok: 1,
        id: ids[0],
        message: 'อัปโหลดไฟล์สำเร็จ',
        file: req.file
      });
    } catch (error) {
      res.json({ ok: 0, error: error.message });
    }
  });

module.exports = router;
