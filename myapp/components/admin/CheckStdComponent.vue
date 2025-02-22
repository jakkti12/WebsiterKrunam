<template>
    <v-app>
      <!-- App Bar -->
      <!-- <v-app-bar color="teal-darken-2" elevation="2">
        <template v-slot:prepend>
          <div class="rounded-circle d-flex justify-center align-center"
            style="background-color: white; width: 40px; height: 40px;">
            <v-icon color="teal-darken-2" size="24">mdi-arrow-left</v-icon>
          </div>
        </template>
        <v-app-bar-title>Student List</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text">
              Sort by time <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item value="newest">
              <v-list-item-title>Newest First</v-list-item-title>
            </v-list-item>
            <v-list-item value="oldest">
              <v-list-item-title>Oldest First</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar> -->
  
      <!-- Main Content -->
      <v-main class="bg-grey-lighten-3">
        <v-container class="px-2">
            <div class="text-subtitle-2 text-grey-darken-1 mb-4">
              ครูกฤษณุา แนววิเศษ<br>
              ครูที่ปรึกษา : ครูกฤษณุา แนววิเศษ
            </div>
  
          <!-- List of Students -->
          <v-list bg-color="#f5f5f5" class="custom-list">
            <v-list-item
              v-for="(item, index) in activities"
              :key="index"
              class="activity-item"
            >
              <v-row align="center" class="w-100">
                <v-col cols="12" sm="2" class="d-flex justify-center">
                  <v-avatar size="48" color="info">
                    <v-icon icon="mdi-account-circle"></v-icon>
                  </v-avatar>
                </v-col>
  
                <v-col cols="12" sm="4" class="text-mobile d-flex flex-column justify-center">
                  <v-list-item-title class="font-weight-medium">
                    {{ item.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-grey-darken-1">
                    {{ item.student_id }}
                  </v-list-item-subtitle>
                </v-col>
  
                <v-col cols="12" sm="6" class="btn-center d-flex justify-end">
                  <v-btn-toggle v-model="item.attendance" class="mt-2" mandatory>
                    <v-btn
                      v-for="option in attendanceOptions"
                      :key="option.value"
                      :value="option.value"
                      :color="item.attendance === option.value ? 'green' : 'grey'"
                      variant="outlined"
                      text-color="white"
                      size="small"
                      rounded="lg"
                      density="default"
                      class="elevation-1"
                    >
                      <v-icon class="mr-1">{{ option.icon }}</v-icon>
                      {{ option.text }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
  
          <!-- Submit Button -->
          <v-btn @click="submitAttendance" color="primary" class="mt-4">
            Submit Attendance
          </v-btn>
        </v-container>
      </v-main>
  
      <!-- Bottom Navigation -->
      <v-bottom-navigation grow color="teal-darken-2">
        <v-btn value="home">
          <v-icon>mdi-home</v-icon>
          Home
        </v-btn>
        <v-btn value="chat">
          <v-icon>mdi-chat</v-icon>
          Chat
        </v-btn>
        <v-btn value="mail">
          <v-icon>mdi-email</v-icon>
          Mail
        </v-btn>
        <v-btn value="profile">
          <v-icon>mdi-account</v-icon>
          Profile
        </v-btn>
      </v-bottom-navigation>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const teacher = ref([])
  
  const attendanceOptions = [
    { text: 'ขาด', value: 3, icon: 'mdi-close-circle' },
    { text: 'ลา', value: 4, icon: 'mdi-account-clock' },
    { text: 'มา', value: 1, icon: 'mdi-check-circle' },
    { text: 'สาย', value: 2, icon: 'mdi-alert-circle' }
  ]
  
  const activities = ref([])
  
  const listData = async () => {
    try {
      const response = await axios.get("http://26.21.199.184:7000/teacher/listStudent")
      activities.value = response.data.student.map(student => ({
        ...student,
        attendance: 1 // ค่าเริ่มต้นเป็น "มา"
      }))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  
  onMounted(() => {
    listData()
  })
  
  const submitAttendance = async () => {
    const payload = activities.value.map(activity => ({
      studentId: activity.student_id,
      attendance: activity.attendance,
      time: activity.time || new Date().toTimeString().slice(0, 8)
    }))
  
    try {
      const response = await axios.post("http://26.21.199.184:7000/teacher/insert", { activities: payload })
      console.log("API Response:", response.data)
      alert('บันทึกเรียบร้อย')
    } catch (error) {
      console.error("Error sending data to API:", error)
    }
  }
  </script>
  
  <style scoped>
  .text-mobile {
    display: none;
    @media (max-width: 599px) {
      text-align: center;
    }
  }
  .btn-center {
    @media (max-width: 599px) {
      justify-content: center !important;
      align-items: center;
      text-align: center;  /* เพิ่มการจัดตำแหน่งข้อความให้อยู่กลาง */
    }
  }
  
  .border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
  
  .custom-list {
    border-radius: 4px;
    overflow: hidden;
  }
  
  .activity-item {
    transition: background-color 0.2s ease;
  }
  
  .activity-item:hover {
    background-color: #ffffff !important;
    cursor: pointer;
  }
  
  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  </style>
  