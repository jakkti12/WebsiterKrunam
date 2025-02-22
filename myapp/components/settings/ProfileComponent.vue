<template>
    <v-app class="container">
        <div class="profile-section">
            <v-btn icon="mdi-arrow-left" color="white" class="back-button mx-2" @click="back"></v-btn>
            <div class="text-center">
                <v-avatar size="120" class="mb-4 white avatar">
                    <!-- แสดงรูปภาพจาก backend -->
                    <v-img :src="profileImages" alt="Profile Picture" cover></v-img>
  
                    <!-- เพิ่ม input type file แบบซ่อน -->
                    <input type="file" ref="fileInput" accept="image/*" @change="onFileSelected" style="display: none" />
  
                    <!-- ปุ่มแก้ไขที่จะเรียก input file -->
                    <v-btn icon="mdi-pencil" size="small" class="avatar-edit-btn" color="white" variant="flat" @click="$refs.fileInput.click()"></v-btn>
                </v-avatar>
                <div class="mb-5 text-h6 text-white">{{ Username }}</div>
                <div class="edit-button-wrapper mt-2">
                    <!-- สร้างปุ่ม Save รูปภาพ -->
                    <v-btn text class="btn btn-primary" color="white" @click="saveImage">บันทึกรูปภาพ</v-btn>
                </div>
            </div>
        </div>
  
        <v-main>
            <!-- หน้าตั้งค่าอื่นๆ  -->
            <v-container>
            <!-- General Settings Section -->
            <div class="text-subtitle-1 mb-2">General Settings</div>
                <v-card flat class="mb-4">
                    <!-- รายการต่างๆ เช่น เปลี่ยนรหัสผ่าน, ภาษาของแอป -->
                    <v-list>
                    <!-- <v-list-item>
                        <template v-slot:prepend>
                        <v-icon>mdi-theme-light-dark</v-icon>
                        </template>
                        <v-list-item-title>Mode</v-list-item-title>
                        <v-list-item-subtitle>Dark & Light</v-list-item-subtitle>
                        <template v-slot:append>
                        <v-switch color="primary"></v-switch>
                        </template>
                    </v-list-item> -->
        
                    <v-list-item link href="changepassword">
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
  
  const profileImages = ref('');
  const fileInput = ref(null);
  const Username = ref('');
  const Email = ref('');

  const router = useRouter()
  const route = useRoute()
  
  // ฟังก์ชันเมื่อเลือกไฟล์
  const onFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        profileImages.value = imageUrl; // แสดงรูปที่เลือกใหม่
    }
  }
  
  const fetchUsersData = async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://26.21.199.184:7000/student/get-student',{
          headers: {
              'authorization': `Bearer ${token}`
          }   
        });
        const data = response.data;

  
        if (data.ok === 1) {
            profileImages.value = `http://26.21.199.184:7000/uploads/profiles/${data.student.picture}`; // ใช้ชื่อไฟล์จากฐานข้อมูล
            Username.value = data.student.username;  // กำหนดอีเมล
            console.log(profileImages);
        } else {
            console.log('Error fetching student data:', data.error);
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
  }

const saveImage = async () => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('picture', fileInput.value.files[0]);

    const response = await axios.post('http://26.21.199.184:7000/upload/upload-single', formData, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    if (response.data.ok === 1) {
        fetchUsersData();
      alert(response.data.message);
    }
  } catch (error) {
    console.error('Error saving image:', error);
  }
};

async function back() {
  router.push('/');
}
  
  // เรียกใช้ฟังก์ชันเมื่อ component ถูก mount
  onMounted(() => {
    fetchUsersData();
  });
  </script>
  
  <style scoped>
  .profile-section {
    width: 100%;
    padding-top: 2rem;
    background-color: #607d8b;
    border-radius: 0rem 0rem 2rem 2rem;
  }
  
  .avatar {
    background-color: black;
    border: 2px solid black;
  }
  
  .avatar-edit-btn {
    position: absolute;
    margin-top: 90%;
  }

.edit-button-wrapper {
  position: relative;
  margin: 4px auto 16px;
  background-color: #607d8b;
  border-radius: 100%;
  color: white;
  transition: background-color 0.3s ease;
  cursor: pointer;
}
</style>