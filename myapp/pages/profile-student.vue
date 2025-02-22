<template>
    <v-container>
      <h3>อัปโหลดไฟล์</h3>
  
      <!-- แสดงภาพโปรไฟล์ปัจจุบันจากฐานข้อมูล -->
      <v-img
        v-if="profilePicture"
        :src="profilePicture"
        max-width="200"
        max-height="200"
        class="my-4"
      ></v-img>
  
      <!-- Form สำหรับการอัปโหลดไฟล์เดี่ยว -->
      <v-form @submit.prevent="uploadSingleFile">
        <v-file-input
          v-model="singleFile"
          label="อัปโหลดไฟล์เดี่ยว"
          accept="image/*"
          required
          @change="previewSingleFile"
        ></v-file-input>
  
        <!-- แสดงภาพตัวอย่างสำหรับไฟล์เดี่ยว -->
        <v-img
          v-if="singleFilePreview"
          :src="singleFilePreview"
          max-width="200"
          max-height="200"
          class="my-4"
        ></v-img>
  
        <v-btn type="submit" color="primary">อัปโหลดไฟล์เดี่ยว</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        singleFile: null,
        singleFilePreview: null,
        profilePicture: null, // เก็บ URL ของรูปโปรไฟล์ที่ดึงมาจากเซิร์ฟเวอร์
      };
    },
    async mounted() {
      // ดึงรูปโปรไฟล์เมื่อคอมโพเนนต์ถูก mount
      await this.fetchProfilePicture();
    },
    methods: {
      // ฟังก์ชันสำหรับแสดงตัวอย่างไฟล์ใหม่ที่อัปโหลด
      previewSingleFile() {
        if (this.singleFile) {
          this.singleFilePreview = URL.createObjectURL(this.singleFile);
        } else {
          this.singleFilePreview = null;
        }
      },
  
      // ฟังก์ชันสำหรับดึงรูปโปรไฟล์จากเซิร์ฟเวอร์
      async fetchProfilePicture() {
        const token = localStorage.getItem("token"); // ดึง token (ID ผู้ใช้) จาก localStorage
        if (token) {
          // ตั้ง URL ของภาพโปรไฟล์
          this.profilePicture = `http://26.21.199.184:7000/api/uploads/profiles/${token}.jpg`;
        }
      },
  
      // ฟังก์ชันสำหรับอัปโหลดไฟล์เดี่ยว
      async uploadSingleFile() {
  if (this.singleFile) {
    const formData = new FormData();
    formData.append('picture', this.singleFile);

    try {
      const response = await axios.post('http://26.21.199.184:7000/upload-single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${this.userId}`  // ส่ง userId ใน header
        }
      });
      console.log('Response:', response.data);
      alert(response.data.message);
    } catch (error) {
      console.error('Upload single file error:', error);
    }
  }
}
    }
  };
  </script>
  