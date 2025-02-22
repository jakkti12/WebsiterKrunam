<template>
  <v-app>
    <v-app-bar color="teal" height="25vh" class="rounded-b-xl" elevation="0">
      <v-btn icon="mdi-arrow-left" color="white" class="back-button" @click="logout"></v-btn>
      <div class="profile-section">
        <div class="text-center">
          <div class="text-h6 text-white mb-6">{{ studentName }}</div>

          <v-avatar size="80" class="mb-4 white">
            <!-- แสดงรูปภาพจาก backend -->
            <v-img :src="profileImage" alt="Profile Picture" cover></v-img>

            <!-- เพิ่ม input type file แบบซ่อน -->
            <input type="file" ref="fileInput" accept="image/*" @change="onFileSelected" style="display: none" />

            <!-- ปุ่มแก้ไขที่จะเรียก input file -->
            <v-btn icon="mdi-pencil" size="small" class="avatar-edit-btn" color="white" variant="flat" @click="$refs.fileInput.click()"></v-btn>
          </v-avatar>
        </div>
        <div class="edit-button-wrapper mt-2">
          <!-- สร้างปุ่ม Save รูปภาพ -->
          <v-btn text class="btn btn-primary" color="white" @click="saveImage">{{ saveButtonText }}</v-btn>
        </div>
      </div>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container>
        <!-- General Settings Section -->
        <div class="text-subtitle-1 mb-2">General Settings</div>
        <v-card flat class="mb-4">
          <!-- รายการต่างๆ เช่น เปลี่ยนรหัสผ่าน, ภาษาของแอป -->
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-theme-light-dark</v-icon>
              </template>
              <v-list-item-title>Mode</v-list-item-title>
              <v-list-item-subtitle>Dark & Light</v-list-item-subtitle>
              <template v-slot:append>
                <v-switch color="primary"></v-switch>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-key</v-icon>
              </template>
              <v-list-item-title>Change Password</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-translate</v-icon>
              </template>
              <v-list-item-title>Language</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Information Section -->
        <div class="text-subtitle-1 mb-2">Information</div>
        <v-card flat>
          <v-list>
            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-information</v-icon>
              </template>
              <v-list-item-title>About App</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-file-document</v-icon>
              </template>
              <v-list-item-title>Terms & Conditions</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-shield-check</v-icon>
              </template>
              <v-list-item-title>Privacy Policy</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>

            <v-list-item link>
              <template v-slot:prepend>
                <v-icon>mdi-share-variant</v-icon>
              </template>
              <v-list-item-title>Share This App</v-list-item-title>
              <template v-slot:append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter , useRoute  } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

// สร้าง ref สำหรับเก็บชื่อรูปและข้อมูลนักเรียน
const profileImage = ref('');  // เก็บ URL รูปภาพ
const fileInput = ref(null);
const router = useRouter()
const route = useRoute()

// ข้อมูลของนักเรียน (ชื่อ, อีเมล)
const studentName = ref('');
const studentEmail = ref('');
const saveButtonText = ref('Save');

// เช็คว่ามี token หรือ ไม ถ้าไม่มีให้กลับไปยังหน้า auth/login
const checkToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/auth/login');
  }
}

// ฟังก์ชันเมื่อเลือกไฟล์
const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    profileImage.value = imageUrl; // แสดงรูปที่เลือกใหม่
  }
}

// ฟังก์ชันดึงข้อมูลนักเรียนจาก backend
const fetchStudentData = async () => {
  try {
    const token = localStorage.getItem('token');
    // ส่ง token แบบ header โดยใช้ชื่อ authorization
    const response = await axios.get('http://26.21.199.184:7000/get-student', { 
      headers: {
        'authorization': `Bearer ${token}` // ใช้ชื่อ authorization แทน token
      }
    });
    const data = response.data;

    if (data.ok === 1) {
      profileImage.value = `http://26.21.199.184:7000/uploads/profiles/${data.student.picture}`;  // ใช้ชื่อไฟล์จากฐานข้อมูล
      studentName.value = data.student.username;  // กำหนดชื่อ
      studentEmail.value = data.student.email;  // กำหนดอีเมล
    } else {
      console.log('Error fetching student data:', data.error);
    }
  } catch (error) {
    console.error('Error fetching student data:', error);
  }
}

// สร้างปุ่ม saveImage
const saveImage = async () => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('picture', fileInput.value.files[0]);

    const response = await axios.post('http://26.21.199.184:7000/upload-single', formData, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    if (response.data.ok === 1) {
      fetchStudentData();
      alert(response.data.message);
    }
  } catch (error) {
    console.error('Error saving image:', error);
  }
};

async function logout() {
  try {
    await axios.post('http://26.21.199.184:7000/logout')
    localStorage.removeItem('token')
    router.push('/auth/login')
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

// เรียกใช้ฟังก์ชันเมื่อ component ถูก mount
onMounted(() => {
  fetchStudentData();
  checkToken();
});
</script>

<style scoped>
.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
}

.profile-section {
  width: 100%;
  padding-top: 2rem;
}

.edit-button-wrapper {
  position: relative;
  width: 80px;
  margin: -24px auto 16px;
}

.avatar-edit-btn {
  position: absolute;
  right: -5px;
  bottom: 0;
  background-color: #0158c8 !important;
  border: 2px solid white !important;
}

/* เพิ่ม style สำหรับปุ่มอัพโหลด */
.avatar-edit-btn {
  position: absolute;
  right: -5px;
  bottom: 0;
  background-color: #0158c8 !important;
  border: 2px solid white !important;
  cursor: pointer;
  z-index: 1;
}

/* เพิ่ม hover effect */
.avatar-edit-btn:hover {
  opacity: 0.9;
}

/* กำหนดให้ v-main แสดงใต้ v-app-bar */
.v-main {
  padding-top: calc(25vh + 16px) !important;
  background-color: #f5f5f5;
}

/* กำหนดสีข้อความ */
.white--text {
  color: white !important;
}

.text-white {
  color: white !important;
}

/* กำหนดสีพื้นหลัง avatar */
.v-avatar.white {
  background-color: #f5f5f5 !important;
}

/* ปรับ container */
.v-container {
  max-width: 100%;
  width: 100%;
  padding: 16px;
}
</style>
