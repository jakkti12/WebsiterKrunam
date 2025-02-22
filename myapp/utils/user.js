import axios from 'axios';

export async function getUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { is_logged_in: false }; // ไม่มี token
    }

    const response = await axios.get("http://26.21.199.184:7000/get_data/getUser", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const user = {
      student_id: response.data.users.id,
      username: response.data.users.username,
      picture: `http://26.21.199.184:7000/uploads/profiles/${response.data.users.picture}`,
      student_type: response.data.users.student_type,
    };

    return { ok: 1, user, isLoggedIn: true }; // ส่งข้อมูล user กลับ
  } catch (error) {
    // ลบ token เมื่อ token หมดอายุหรือไม่ถูกต้อง
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token");
    }
  }
  return { ok: 0, isLoggedIn: false }; // เกิดข้อผิดพลาด
}