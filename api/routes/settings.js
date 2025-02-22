const express = require("express");
const crypto = require('crypto');
const router = express.Router();
const authenticateToken = require('../middleware/jwt-check');

router.get('/check-user-type', authenticateToken, async (req, res) => {
    const id = req.user.id;
    const user = await req.db('student').where({ id }).first();
    res.send({ ok: 1, student_type: user.student_type });
});

router.get('/profile', authenticateToken, async (req, res) => {
    const id = req.user.id;
    const student = await req.db('student').where({ id }).first();
    res.send({ ok: 1, student: student });
});

router.post('/change-password', authenticateToken, async (req, res) => {
    const { newPassword, originalPassword } = req.body;
    console.log(newPassword,originalPassword);
    try {
      // ดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ id จาก token
      const user = await req.db('student')
        .where({ id: req.user.id })
        .first();
  
      if (!user) {
        return res.status(404).json({ ok: 0, message: 'ไม่พบผู้ใช้งาน' });
      }
  
      // ตรวจสอบว่ารหัสผ่านเดิมตรงกับในฐานข้อมูลหรือไม่
      const hashedOriginalPassword = crypto.createHash('md5').update(originalPassword).digest('hex');
      if (user.password !== hashedOriginalPassword) {
        return res.status(400).json({ ok: 0, message: 'รหัสผ่านเดิมไม่ถูกต้อง' });
      }
  
      // ตรวจสอบว่ารหัสผ่านใหม่ตรงกับรหัสผ่านเดิมหรือไม่
      const hashedNewPassword = crypto.createHash('md5').update(newPassword).digest('hex');
      if (user.password === hashedNewPassword) {
        return res.status(400).json({ ok: 0, message: 'รหัสผ่านใหม่ตรงกับรหัสผ่านเดิมไม่สามารถเปลี่ยนได้' });
      }
  
      // อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
      await req.db('student')
        .where({ id: req.user.id })
        .update({ password: hashedNewPassword });
  
      res.json({ ok: 1, message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
    } catch (error) {
      res.status(500).json({ ok: 0, error: error.message });
    }
});

module.exports = router;