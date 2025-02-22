const express = require("express");
const router = express.Router();
const authenticateToken = require('../middleware/jwt-check');

router.get("/listStudent", async (req, res) => {
    try {
      const rows = await req.db("student")
      .where({ student_type: "student" });
      res.send({
        status: "ok",
        student: rows,
      });
    } catch (e) {
      res.send({ ok: 0, error: e.message });
    }
});

router.get("/listsTeacher", authenticateToken,  async (req, res) => {
  try {
    const rows = await req.db("student")
      .where({ id: req.user.id })
      .first();
    res.send({
      status: "ok",
      student: rows,
    });
  } catch (e) {
    res.send({ ok: 0, error: e.message });
  }
});

router.post("/insert", async (req, res) => {
    const activities = req.body.activities;
    try {
      for (const activity of activities) {
        await req.db("sttendance").insert({
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

module.exports = router;