const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/jwt-check');

router.get("/get-student", authenticateToken, async (req, res) => {
    try {
        const student = await req.db("student")
            .where({ id: req.user.id }) // ใช้ token หรือ student_id ที่ตรงกับ backend
            .first();

        if (student) {
            console.log("Student data:", student); // log ข้อมูลที่ได้จาก database
            res.json({ ok: 1, student }); // ส่งข้อมูลกลับ
        } else {
            res.json({ ok: 0, error: "ไม่พบข้อมูลนักศึกษา" });
        }
    } catch (error) {
        res.status(500).json({ ok: 0, error: error.message });
    }
});

module.exports = router;