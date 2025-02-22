import axios from 'axios';

export async function getSttendance() {
  try {
    const getSttendance = await axios.get("http://26.21.199.184:7000/get_data/getSttendance");

    return { ok: 1, getSttendance: getSttendance.data.getSttendance}; // ส่งข้อมูล user กลับ
  } catch (error) {
  }
}