const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  console.log('token=', token)
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  // ตรวจสอบความถูกต้องของโทเค็น
  // let data = jwt.verify(token, req.config.jwt.secret, req.config.jwt.options)
//     req.token = data
  jwt.verify(token, req.config.jwt.secret,req.config.jwt.options, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded; // เก็บข้อมูลผู้ใช้ที่ถอดรหัสแล้วใน req.user
    next();
  });
}