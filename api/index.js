const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const multer = require("multer");
const kenx = require("knex");
const config = require("./config");
const db = kenx(config.db);
const port = config.server.port;

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    req.db = db;
    req.config = config;
    next();
});

// ใช้งาน router สำหรับแต่ละหน้า
app.use("/admin", require("./routes/admin") )
app.use("/student", require("./routes/student"));
app.use("/auth", require("./routes/auth"));
app.use("/teacher", require("./routes/teacher"));
app.use("/settings", require("./routes/settings"));
app.use("/upload", require("./routes/uploads")); // แยก router การอัปโหลด
app.use("/get_data", require("./routes/get_data"));

// ให้สามารถเข้าถึงไฟล์ในโฟลเดอร์ uploads ผ่าน URL
app.use("/uploads", express.static("uploads"));

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
  });