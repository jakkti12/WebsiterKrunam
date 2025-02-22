<template>
    <v-container>
      <v-form @submit.prevent="submitForm">
        <v-text-field v-model="name" label="Name" required></v-text-field>
        <v-text-field v-model="email" label="Email" required></v-text-field>
        
        <!-- Avatar Upload -->
        <v-file-input
          label="Upload Avatar"
          accept="image/*"
          prepend-icon="mdi-camera"
          @change="onFileChange"
        ></v-file-input>
  
        <v-btn color="primary" type="submit">Submit</v-btn>
      </v-form>
  
      <!-- Preview Avatar -->
      <v-img v-if="avatar" :src="avatar" max-width="200"></v-img>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
import { ref } from 'vue'
  
  export default {
    setup() {
      const name = ref("")
      const email = ref("")
      const avatarFile = ref(null)
      const avatar = ref(null)
  
      const onFileChange = (event) => {
        const file = file.target.files[0];
        // Convert file to Base64 for preview
        const reader = new FileReader()
        reader.onload = (e) => {
          avatar.value = e.target.result
        }
        reader.readAsDataURL(file)
        avatarFile.value = file
      }
  
      const submitForm = async () => {
  // ตรวจสอบว่า avatarFile ถูกตั้งค่าหรือไม่
  if (!avatarFile.value) {
    console.error("Please upload an avatar file");
    return; // หยุดการทำงานหากไม่มีไฟล์
  }

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("email", email.value);
  formData.append("avatar", avatarFile.value);

  try {
    const response = await axios.post("http://26.21.199.184:7000/upprofile", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // กำหนด content type เป็น multipart/form-data
      },
    });
    console.log("Profile saved:", response.data);
    // ทำอะไรบางอย่างหลังจากบันทึกสำเร็จ (เช่น แสดงข้อความยืนยัน)
  } catch (error) {
    // แสดงข้อผิดพลาดที่ชัดเจน
    console.error("Error uploading profile:", error.response ? error.response.data : error.message);
  }
};


  
      return {
        name,
        email,
        avatarFile,
        avatar,
        onFileChange,
        submitForm
      }
    }
  }
  </script>