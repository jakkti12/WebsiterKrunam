const express = require("express");
const crypto = require('crypto');
const router = express.Router();
const authenticateToken = require('../middleware/jwt-check');

router.get('/getUser', authenticateToken, async (req, res) => {
    try {
        const id = req.user.id;
        const users = await req.db('student').where({ id }).first();
        res.send({ ok: 1, users: users });
    } catch (error) {
        console.error(error);
        res.status(500).send({ ok: 0, error: "Internal Server Error" });
    }
});

router.get('/getSttendance', async (req, res) => {
    try {
        const getSttendance = await req.db('sttendance')
            .join('student', 'sttendance.student_id',  '=', 'student.student_id')
            .select(
                'sttendance.attendance_id as attendance_id',
                'sttendance.student_id as student_id',
                'student.username as username',
                'sttendance.checkin_time as checkin_time',
                'sttendance.status_id as status_id'
            );
        
        res.send({ ok: 1, getSttendance: getSttendance });
    } catch (error) {
        console.error(error);
        res.status(500).send({ ok: 0, error: "Internal Server Error" });
    }
});

module.exports = router;