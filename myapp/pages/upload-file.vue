<template>
  <v-container>
    <h3>อัปโหลดไฟล์</h3>

    <select 
      v-model="selectedUser"
      class="form-dropdown "
    >
      <option v-for="user in users" :key="user.id" :value="user.student_id">
        {{ user.username }}
      </option>
    </select>

    <!-- แสดงข้อมูลของผู้ใช้ที่เลือก -->
    <p v-if="selectedUser">
      Selected User: {{ selectedUser }}
    </p>

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
    
    <v-divider class="my-6"></v-divider>
    
    <!-- Form สำหรับการอัปโหลดหลายไฟล์ -->
    <v-form @submit.prevent="uploadMultipleFiles">
      <v-file-input
        v-model="multipleFiles"
        label="อัปโหลดหลายไฟล์"
        accept="image/*"
        multiple
        required
        @change="previewMultipleFiles"
      ></v-file-input>

      <!-- แสดงภาพตัวอย่างสำหรับไฟล์หลายไฟล์ -->
      <div class="d-flex flex-wrap">
        <v-img
          v-for="(preview, index) in multipleFilesPreviews"
          :key="index"
          :src="preview"
          max-width="100"
          max-height="100"
          class="ma-2"
        ></v-img>
      </div>

      <v-btn type="submit" color="primary">อัปโหลดหลายไฟล์</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedUser: null,  // ตัวแปรเก็บผู้ใช้ที่เลือก
      users: [],
      singleFile: null,
      multipleFiles: [],
      singleFilePreview: null,
      multipleFilesPreviews: []
    };
  },
  methods: {
    async listData() {
      try {
        const response = await axios.get("http://localhost:7000/listStudent");
        this.users = response.data.student; // ส่ง array ของ student โดยตรงให้ users
        console.log("users:", this.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    previewSingleFile() {
      if (this.singleFile) {
        this.singleFilePreview = URL.createObjectURL(this.singleFile);
      } else {
        this.singleFilePreview = null;
      }
    },
    
    previewMultipleFiles() {
      this.multipleFilesPreviews = this.multipleFiles.map((file) =>
        URL.createObjectURL(file)
      );
    },

    async uploadSingleFile() {
      if (this.singleFile) {
        const formData = new FormData();
        formData.append('picture', this.singleFile);
        formData.append('student_id', this.selectedUser);  // ส่ง student_id ไปพร้อมกับไฟล์

        try {
          const response = await axios.post('http://26.21.199.184:7000/upload-single', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Response:', response.data);
          alert(response.data.message);
        } catch (error) {
          console.error('Upload single file error:', error);
        } finally {
          URL.revokeObjectURL(this.singleFilePreview);
          this.singleFilePreview = null;
        }
      }
    },

    async uploadMultipleFiles() {
      if (this.multipleFiles.length > 0) {
        const formData = new FormData();
        this.multipleFiles.forEach((file) => {
          formData.append('pictures', file);
        });
        formData.append('student_id', this.selectedUser); // ส่ง student_id ไปพร้อมกับไฟล์หลายไฟล์

        try {
          const response = await axios.post('http://localhost:7000/upload-multiple', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Response:', response.data);
          alert(response.data.message);
        } catch (error) {
          console.error('Upload multiple files error:', error);
        } finally {
          // ล้าง previews และ multipleFiles หลังจากการอัปโหลด
          this.multipleFiles.forEach((file) => URL.revokeObjectURL(file));
          this.multipleFiles = [];
          this.multipleFilesPreviews = [];
        }
      }
    },

  },
  mounted() {
    this.listData(); // เรียก listData เมื่อ component ถูก mount
  }
};
</script>
<style>
.form-dropdown {
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}
</style>