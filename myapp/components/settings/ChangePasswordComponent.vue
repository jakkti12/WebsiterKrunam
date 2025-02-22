<template>
    <v-app class="change-password container mt-5">
      <div class="text-center">
        <hr />
        <h1 class="text-h5 font-weight-bold">เปลี่ยนรหัสผ่าน</h1>
        <hr />
      </div>
  
      <v-main>
        <!-- ช่องกรอกรหัสเดิม -->
        <v-form>
          <v-input>
            <v-text-field 
              v-model="originalPassword" 
              :type="showOriginalPassword ? 'text' : 'password'" 
              label="กรอกรหัสผ่านเดิม" 
              outlined 
              dense 
              required 
            >
              <template v-slot:append>
                <v-icon @click="toggleShowOriginalPassword">
                  {{ showOriginalPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>
          </v-input>
  
          <!-- ช่องกรอกรหัสใหม่ -->
          <v-input>
            <v-text-field 
              v-model="newPassword" 
              :type="showNewPassword ? 'text' : 'password'" 
              label="กรอกรหัสผ่านใหม่" 
              outlined 
              dense 
              required 
            >
              <template v-slot:append>
                <v-icon @click="toggleShowNewPassword">
                  {{ showNewPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>
          </v-input>
  
          <!-- ช่องยืนยันรหัสใหม่ -->
          <v-input>
            <v-text-field 
              v-model="confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              label="ยืนยันรหัสผ่านใหม่" 
              outlined 
              dense 
              required 
            >
              <template v-slot:append>
                <v-icon @click="toggleShowConfirmPassword">
                  {{ showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>
          </v-input>
  
          <!-- ปุ่มยืนยันการเปลี่ยนรหัส -->
          <v-btn
            color="primary"
            class="mt-4"
            @click="changePassword"
            :disabled="!isFormValid"
          >
            ยืนยันการเปลี่ยนรหัส
          </v-btn>
        </v-form>
      </v-main>
    </v-app>
</template>
  
<script setup>
import { useRouter , useRoute  } from 'vue-router';
import { ref, computed } from 'vue'
import axios from 'axios'

// เรียกใช้งาน route และ อ่านค่า routeParams
const router = useRouter()
const route = useRoute()

// ตัวแปรเก็บค่ารหัสผ่าน
const originalPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// ตัวแปรเพื่อควบคุมการแสดงรหัสผ่าน
const showOriginalPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// คำนวณความถูกต้องของฟอร์ม
const isFormValid = computed(() => {
return originalPassword.value && newPassword.value && confirmPassword.value && newPassword.value === confirmPassword.value
})

// ฟังก์ชันในการเปลี่ยนรหัส
const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
    return;
  }

  try {
    const token = localStorage.getItem('token'); // รับ token จาก localStorage

    // เรียก API เปลี่ยนรหัสผ่าน
    const response = await axios.post(
      'http://26.21.199.184:7000/settings/change-password',
      {
        newPassword: newPassword.value,
        originalPassword: originalPassword.value, // ส่งรหัสผ่านเดิม
      },
      {
        headers: {
            authorization: `Bearer ${token}`,
        },
      }
    );

    alert(response.data.message); // แสดงข้อความตอบกลับ
    router.push('/settings/profile');
  } catch (error) {
    // ตรวจสอบและแสดง error ที่ได้รับจาก backend
    const message = error.response?.data?.message || error.message;
    alert(`เกิดข้อผิดพลาด: ${message}`);
  }
};


// ฟังก์ชันสำหรับสลับการแสดงรหัสผ่าน
const toggleShowOriginalPassword = () => {
showOriginalPassword.value = !showOriginalPassword.value
}

const toggleShowNewPassword = () => {
showNewPassword.value = !showNewPassword.value
}

const toggleShowConfirmPassword = () => {
showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<style scoped>
.change-password {
.text-password {
    font-size: 18px;
}

.input-password {
    max-width: 400px;
    margin-bottom: 20px;
}

.v-btn {
    width: 100%;
}
}
</style>