const express = require("express");
const session = require('express-session');
const app = express();
app.use(express.json());
const cors = require('cors');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '123456';

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'stdactivity_2567'
    }
});

const port = 7000;

// สร้างโฟลเดอร์ uploads/profiles หากไม่มี
const uploadDir = path.join(__dirname, 'uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
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

// ใช้ express.static เพื่อให้บริการไฟล์จากโฟลเดอร์ uploads/profiles
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
// app.use(bodyParser.json());
// app.use(expressFileupload());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/upload-single', authenticateToken, upload.single('picture'), async (req, res) => {
  try {
    const filePath = req.file.filename;  // ดึงชื่อไฟล์ที่อัปโหลด

    let ids = await knex('student')
      .where({ student_id: req.user.student_id })
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

app.post('/upload-single-users', upload.single('picture'), async (req, res) => {
  try {
    const filePath = req.file.filename;  // ดึงชื่อไฟล์ที่อัปโหลด
    const student_Id = req.body.student_id;
    console.log('student_Id=', student_Id);

    let ids = await knex('student')
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

//ทำให้มีการอัปโหลดหลายไฟล์แบบ array
app.post('/upload-multiple', upload.array('pictures'), (req, res) => {
  console.log('Dete.now()', Date.now());
  console.log('data=', req.files)
  res.json({
    message: 'อัปโหลดไฟล์สำเร็จ',
    file: req.files
  });
});

// Route สำหรับการเข้าสู่ระบบ
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('user=', req.body)

  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const row = await knex('student')
      .where({ username })
      .first();
    if (row) {
      // สร้าง MD5 hash ของรหัสผ่านที่ป้อนเข้ามา
      const HashedPassword = crypto.createHash('md5').update(password).digest('hex');
      // เปรียบเทียบรหัสผ่านที่ป้อนเข้ามากับรหัสผ่านในฐานข้อมูล
      if (HashedPassword === row.password) {

        const token = jwt.sign({ student_id: row.student_id, username: row.username }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
          message: 'เข้าสู่ระบบสําเร็จ',
          token: token,
        });
      } else {
        res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
      }
    } else {
      res.status(401).json({ message: 'ชื่อผู้ใช้ไม่ถูกต้อง' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Logout user
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({ ok: 0, error: 'Logout failed' });
      }
      res.send({ ok: 1, message: 'Logged out successfully' });
    });
});

app.post('/register', async (req, res) => {
  const {username, password} = req.body;
  console.log('user=', req.body)
  const student_id = Math.floor(Math.random() * 100000);
  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const row = await knex('student')
      .where({ username })
      .first();
    if (row) {
      res.status(401).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว' });
    } else {
      // สร้าง MD5 hash ของรหัสผ่านที่ป้อนเข้ามา
      const HashedPassword = crypto.createHash('md5').update(password).digest('hex');
      // เพิ่มผู้ใช้ในฐานข้อมูล
      await knex('student').insert({student_id: student_id, username:username, password: HashedPassword });
      res.status(200).json({
        message: 'สมัครสมาชิกสําเร็จ',
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// ส่งค่า Student ที่ตรงกับ student_id ที่ส่งมาจาก front-end
app.get('/get-student', authenticateToken , async  (req, res) => {
  try {
    const student = await knex('student')
      .where({ student_id: req.user.student_id }) // ใช้ token หรือ student_id ที่ตรงกับ backend
      .first();

    if (student) {
      console.log('Student data:', student); // log ข้อมูลที่ได้จาก database
      res.json({ ok: 1, student }); // ส่งข้อมูลกลับ
    } else {
      res.json({ ok: 0, error: 'ไม่พบข้อมูลนักศึกษา' });
    }
  } catch (error) {
    res.status(500).json({ ok: 0, error: error.message });
  }
});

app.post('/upprofile', upload.single('avatar'), (req, res) => {
  console.log('body=', req.body);
  console.log('file=', req.file); // ใช้ req.file แทน req.body สำหรับไฟล์ที่อัปโหลด

  // ตรวจสอบว่า req.file ถูกกำหนดหรือไม่
  if (!req.file) {
    return res.status(400).send({ ok: 0, error: "No file uploaded" });
  }

  try {
    res.send({
      status: "ok",
      filename: req.file.filename,  // เพิ่มข้อมูลชื่อไฟล์
      filepath: "uploads/" + req.file.filename,  // เพิ่มเส้นทางไฟล์
    });
  } catch (error) {
    console.error("Error processing profile update:", error.message);
    res.send({ ok: 0, error: error.message });
  }
});

app.get("/list", async (req, res) => {
  try {
    const rows = await knex("student").select("*");
    res.send({
      status: "ok",
      datas: rows,
    });
  } catch (error) {
    res.send({ ok: 0, error: error.message });
  }
});

app.post("/insert", async (req, res) => {
  const activities = req.body.activities;
  try {
    for (const activity of activities) {
      await knex("sttendance").insert({
        student_id: activity.studentId,
        attendance_date: new Date(), // กำหนดวันที่ปัจจุบันหรือตามข้อมูลที่ต้องการ
        status_id: activity.attendance || 1,
        checkin_time: activity.time || new Date().toTimeString().slice(0, 8), // เวลาเข้าเรียน (หากมีข้อมูลเวลา)
        method_id: 1 // กำหนดวิธีเช็คการเข้าเรียน (หากมี)
      });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
});

app.post("/insertStudent", async (req, res) => {
  console.log("insert=", req.body);
  try {
    const row = await knex("student").insert({
      student_Id: req.body.studentId,
      username: req.body.email,
      password: req.body.passwd,
      picture: req.body.picture,
    });
    res.send({
      status: 1,
      status: row,
    });
  } catch (e) {
    res.send({ ok: 0, error: e.message });
  }
});

app.post("/insertStudent2", async (req, res) => {
  console.log("insert=", req.body);
  try {
    const row = await knex("student").insert({
      student_Id: req.body.student_id,
      username: req.body.username,
      password: req.body.password,
      picture: req.body.picture,
    });
    res.send({
      status: 1,
      status: row,
    });
  } catch (e) {
    res.send({ ok: 0, error: e.message });
  }
});

app.post("/updateStudent", async (req, res) => {
  console.log("insert=",req.body);
  try {
    const row = await knex("student")
      .where({ student_id: req.body.student_id })
      .update({
        username: req.body.username,
        password: req.body.password,
        picture: req.body.picture,
      });
    res.send({
      status: 1,
      status: row,
    });
  } catch (e) {
    res.send({ ok: 0, error: e.message });
  }
});

app.post("/deleteStudent", async (req, res) => {
  console.log("delete=", req.body);
  try {
    const row = await knex("student")
      .where({ student_id: req.body.student_id})
      .del();
    res.send({
      status: 1,
      status: row,
    });
  } catch (e) {
    res.send({ ok: 0, error: e.message });
  }
});

app.get("/listStudent", async (req, res) => {
  try {
    const rows = await knex("student");
    res.send({
      status: "ok",
      student: rows,
    });
  } catch (e) {
    res.send({ ok: 0, error: e.message });
  }
});

app.post("/updateAttendance", async (req, res) => {
  try {
    console.log("Received attendance update from front-end:", req.body);
    res.send({
      status: "ok",
      data: req.body,
    });
  } catch (error) {
    console.error("Error processing attendance update:", error.message);
    res.send({ ok: 0, error: error.message });
  }
});

// Middleware สำหรับตรวจสอบ JWT Token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Route ที่ต้องมีการยืนยันตัวตน (Protected Route)
app.get('/check-token', authenticateToken, (req, res) => {
  req.headers['authorization']?.split(' ')[1];
  res.json({ message: `Welcome ${req.user.username} to the verify!` });
});
