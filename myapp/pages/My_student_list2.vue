<template>
    <v-app>
      <!-- App Bar -->
      <v-app-bar color="teal-darken-2" elevation="2">
        <template v-slot:prepend>
            <div class="rounded-circle d-flex justify-center align-center" style="background-color: white; width: 40px; height: 40px;">
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
      </v-app-bar>
  
      <!-- Main Content -->
      <v-main class="bg-grey-lighten-3"> <!-- เพิ่มสีพื้นหลังหลัก -->
        <v-container class="px-2">
          <div class="text-subtitle-2 text-grey-darken-1 mb-4">
            E1 เทคโนโลยีสารสนเทศ<br>
            ครูที่ปรึกษา : ครูกฤษณุา แนววิเศษ
          </div>
  
          <v-list bg-color="#f5f5f5" class="custom-list"> <!-- กำหนดสีพื้นหลังเริ่มต้น -->
            <v-list-item
              v-for="(item, index) in activities"
              :key="index"
              :class="{'border-b': index !== activities.length - 1}"
              class="activity-item" 
            >
              <template v-slot:prepend>
                <v-avatar size="48" color="info" class="mr-3">
                    <v-icon icon="mdi-account-circle"></v-icon>
                </v-avatar>
              </template>
  
              <v-list-item-title class="font-weight-medium">
                {{ item.username }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-grey-darken-1">
                {{ item.student_id }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="text-grey-darken-1">
                {{ item.password }}
              </v-list-item-subtitle>
  
              <template v-slot:append>
                <div class="d-flex flex-column align-end">                
                 <v-menu location="bottom end">
                  <template v-slot:activator="{ props }">
                    <v-icon 
                      v-bind="props"
                      size="18" 
                      class="cursor-pointer"
                    >
                      mdi-dots-horizontal
                    </v-icon>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(option, i) in attendanceOptions"
                      :key="i"
                      @click="updateAttendance(index, option.value)"
                    >
                      <v-list-item-title>{{ option.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <div class="text-grey-darken-1 text-caption mb-1">
                  <!-- {{ item.password }} -->
                  <span v-if="item.attendance !== undefined" class="ml-2">({{ item.attendance }})</span>
                </div>
                </div>
              </template>
            </v-list-item>
          </v-list>
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
import axios from "axios";  
  const attendanceOptions = [
  { text: 'ขาด', value: 0 },
  { text: 'ลา', value: 0.5 },
  { text: 'มา', value: 1 },
  { text: 'สาย', value: 0.5 }
]

   const activities = ref([
    {
      name: 'Claudia Alves',
      action: 'Commented on your post.',
      time: '3m ago',
     
    },
    {
      name: 'Claudia Alves',
      action: 'Liked your photo.',
      time: '5m ago',
      
    },
    {
      name: 'Claudia Alves',
      action: 'Mentioned you in a comment.',
      time: '2h ago',
      
    },
    {
      name: 'Dani Martinez',
      action: 'Shared your post.',
      time: '3h ago',
      
    },
    {
      name: 'Kimberly Nguyen',
      action: 'Commented on your photo.',
      time: '5h ago',
      
    },
    {
      name: 'Kimberly Nguyen',
      action: 'Started following you.',
      time: '7h ago',
      
    },
    {
      name: 'Mariana Napolitani',
      action: 'Saved your photo.',
      time: 'Yesterday',
      
    }
  ])
  const listData = async () => {
      try {
        const response = await axios.get("http://26.21.199.184:7000/listStudent")
        const result =  response.data;
        console.log('listData=',result)
        activities.value = result.rows
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    onMounted(() => {
        listData()
    })
  const updateAttendance = async(index, value) => {
  activities.value[index] = {
    ...activities.value[index],
    attendance: value
  }
  // เตรียมข้อมูลที่จะส่งไปที่ API
  const payload = {
    studentName: activities.value[index].username,
    attendance: value,
    student_id: activities.value[index].student_id,
    password: activities.value[index].password
  }
  console.log('data=', payload)
  try {
    const response = await axios.post("http://26.21.199.184:7000/updateAttendance", payload)
    console.log('Response from server:', response.data)
  } catch (error) {
    console.error('Error updating attendance:', error)
  }
}
  </script>
  
  <style scoped>
  .border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
  
  /* กำหนด style สำหรับ list */
  .custom-list {
    border-radius: 4px;
    overflow: hidden;
  }
  
  /* กำหนด style สำหรับ list item และ hover effect */
  .activity-item {
    transition: background-color 0.2s ease;
  }
  
  .activity-item:hover {
    background-color: #ffffff !important;
    cursor: pointer;
  }
  </style>