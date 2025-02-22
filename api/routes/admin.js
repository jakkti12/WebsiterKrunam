const express = require("express");
const cors = require('cors');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

router.use(bodyParser.json());
router.use(cors());
router.use(express.json());

const SECRET_KEY = '123456';

// ดึงข้อมูลจากตาราง users
router.get('/list-student', async (req, res) => {
    try {
      let result = await req.db.select('*').from('student')
        .where('status', '1');
      res.send({ 
        ok: 1,
        users: result
      });
    } catch (error) {
      res.status(500).send({ ok: 0, error: error.message });
    }
});

router.post('/delete-student-by-id', async (req, res) => {
  const { id } = req.body; // รับ id จาก body
  console.log(id);

  try {
    await req.db.transaction(async (trx) => {
      // ทำการเปลี่ยนค่า status ในฐานข้อมูลให้เป็น 0
      await trx('student')
        .where({ id })
        .update({ status: 0 });
    });

    res.status(200).json({ ok: 1, message: 'ลบผู้ใช้สำเร็จ' });
  } catch (error) {
    res.status(500).json({ ok: 0, error: error.message });
  }
});

router.post('/update-user', async (req, res) => {
  const { id, username} = req.body;

  try {
    await req.db('student')
      .where({ id })
      .update({ 
        username, 
      });

    res.status(200).json({ ok: 1, message: 'อัปเดตข้อมูลสำเร็จ' });
  } catch (error) {
    res.status(500).json({ ok: 0, error: error.message });
  }
});

router.post('/create-user', async (req, res) => {
  const { username, newPassword, picture } = req.body;

  console.log(username, newPassword, picture)

  const student_id = Math.floor(Math.random() * 100000);

  if (!username || !newPassword) {
    return res.status(400).json({ ok: 0, error: 'Missing required fields' });
  }

  try {
    const HashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');
    const [newUserId] = await req.db('student').insert({
      student_id: student_id,
      username: username,
      password:HashedPassword,
      student_type: 'student',
      picture: picture,
    });

    const newUser = await req.db('student').where({ id: newUserId }).first();
    res.status(200).json({ ok: 1, user: newUser });
  } catch (error) {
    res.status(500).json({ ok: 0, error: error.message });
  }
});

router.post('/change-password', async (req, res) => {
  const { id, newPassword} = req.body;

  const HashedPassword = crypto.createHash('md5').update(newPassword).digest('hex');

  try {
    await req.db('student')
      .where({ id })
      .update({
        password: HashedPassword,
      });

    res.status(200).json({ ok: 1, message: 'อัปเดตข้อมูลสำเร็จ' });
  } catch (error) {
    res.status(500).json({ ok: 0, error: error.message });
  }
});

router.post('/upload-excel', async (req, res) => {
  const users = req.body.users;

  try {
    // ใช้ Knex ในการบันทึกข้อมูลผู้ใช้
    for (const user of users) {
      const result = await req.db('student').insert(user);  // เพิ่มข้อมูลลงในตาราง 'student'
    }

    res.status(200).json({ ok: 1, users: result, message: "Data uploaded successfully" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error uploading data", error: error.message });
  }
});

module.exports = router;