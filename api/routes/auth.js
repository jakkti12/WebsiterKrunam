const express = require("express");
const session = require('express-session');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// const jsonwebtoken = require('../middleware/jwt-check');

const SECRET_KEY = '123456';

router.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

// ระบบ Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('user=', req.body)
  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const row = await req.db('student')
      .where({ username })
      .first();
    if (row) {
      // สร้าง MD5 hash ของรหัสผ่านที่ป้อนเข้ามา
      const HashedPassword = crypto.createHash('md5').update(password).digest('hex');
      // เปรียบเทียบรหัสผ่านที่ป้อนเข้ามากับรหัสผ่านในฐานข้อมูล
      if (HashedPassword === row.password) {
        const token = jwt.sign({ id: row.id}, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
          message: 'เข้าสู่ระบบสําเร็จ',
          token: token,
        });

        console.log('token =', token)
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

router.post('/register', async (req, res) => {
  
  try {
    const {username, password} = req.body;
    console.log('user=', username, password)
    const student_id = Math.floor(Math.random() * 100000);
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const row = await req.db('student')
      .where({ username: username })
      .first();
    if (row) {
      res.status(401).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว' });
    } else {
      // สร้าง MD5 hash ของรหัสผ่านที่ป้อนเข้ามา
      const HashedPassword = crypto.createHash('md5').update(password).digest('hex');
      // เพิ่มผู้ใช้ในฐานข้อมูล
      await req.db('student')
        .insert({
          student_id: student_id, 
          username: username, 
          password: HashedPassword,
          status: '1',
          student_type: 'student',
        });
      res.status(200).json({
        message: 'สมัครสมาชิกสําเร็จ',
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ ok: 0, error: 'Logout failed' });
    }
    res.send({ ok: 1, message: 'Logged out successfully' });
  });
});

module.exports = router;
