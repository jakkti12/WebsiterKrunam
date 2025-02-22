<template>
<div class="background-body">
        <div class="container">
          <div class="row">
            <div class="col-md-5 text-center">
              
            </div>
            <div class="col-md-7">
              <div class="header-homepage">
                <div class="font-p-home">
                  <div class="box-shadow">
                    <p class="font-head">
                      ระบบเช็คชื่อนักเรียนนักศึกาษา
                    </p>
                    <hr width="50%">
                    <p class="font-body">
                      ให้บริการเช็คชื่อนักเรียนนักศึกษาทุกครั้งที่ต้องการ
                    </p>
                  </div>
                  <button class="btn btn-primary button-checkin" @click="checkIn" v-if="isTeacher">
                    <i class="fas fa-check-circle me-2"></i>เช็คชื่อ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <!-- ส่วนเนื้อหา -->
      <div class="body-homepage container">
          <v-card class="blog-container">
              <v-card-title>
              <div class="row text-center">
                  <!-- Blog 1: Node.js -->
                  <div class="col-md-4 blog-item">
                  <h5><i class="fab fa-node-js me-2"></i>Node.js</h5>
                  <p class="blog-content">
                      Node.js เป็นแพลตฟอร์มที่ใช้สำหรับพัฒนาเซิร์ฟเวอร์และแอปพลิเคชันเว็บ โดยใช้ JavaScript 
                      มีประสิทธิภาพสูงและรองรับการทำงานแบบ Asynchronous เหมาะสำหรับระบบที่ต้องการประมวลผลแบบเรียลไทม์ เช่น Chat Applications และ API Services
                  </p>
                  </div>
  
                  <!-- Blog 2: Nuxt.js -->
                  <div class="col-md-4 blog-item">
                  <h5><i class="fab fa-vuejs me-2"></i>Nuxt.js</h5>
                  <p class="blog-content">
                      Nuxt.js เป็นเฟรมเวิร์คที่ช่วยในการพัฒนาเว็บแอปพลิเคชันแบบ Vue.js โดยมีจุดเด่นคือการรองรับ Server-Side Rendering (SSR), SEO-friendly และโครงสร้างที่จัดการง่าย 
                      เหมาะสำหรับเว็บที่ต้องการโหลดเร็วและรองรับ SEO เช่น เว็บไซต์ E-commerce หรือ Blog
                  </p>
                  </div>
  
                  <!-- Blog 3: Python -->
                  <div class="col-md-4 blog-item">
                  <h5><i class="fab fa-python me-2"></i>Python</h5>
                  <p class="blog-content">
                      Python เป็นภาษาการเขียนโปรแกรมที่เรียบง่าย อ่านง่าย และทรงพลัง เหมาะสำหรับงานหลากหลาย เช่น Data Science, Machine Learning, Web Development และ Automation 
                      มี Frameworks เช่น Django และ Flask ที่ช่วยในการพัฒนาเว็บแอปพลิเคชันได้รวดเร็ว
                  </p>
                  </div>
              </div>
              </v-card-title>
          </v-card>
          <!-- ส่วนช่องแสดงข้อมูลเช็คชื่อ -->
          <div class="row mt-5 container mb-5">
            <div class="col-12">
              <div class="attendance-box">
                <v-card flat>
                  <v-card-title class="d-flex align-center pe-2">
                    <v-icon icon="mdi-calendar-week"></v-icon>
                    แสดงข้อมูลการเช็คชื่อ

                    <v-spacer></v-spacer>

                    <v-text-field
                    v-model="search"
                    density="compact"
                    label="ค้นหา"
                    prepend-inner-icon="mdi-magnify"
                    variant="solo-filled"
                    flat
                    hide-details
                    single-line
                    ></v-text-field>
                </v-card-title>

                  <v-data-table
                    v-model:search="search"
                    :headers="headers"
                    :items="items"
                    >

                    <template v-slot:item.status_id="{ item }">
                      {{ item.status_id === 1? 'มา' : '' }}
                      {{ item.status_id === 2? 'สาย' : '' }}
                      {{ item.status_id === 3? 'ขาด' : '' }}
                      {{ item.status_id === 4? 'ลา' : '' }}
                    </template>
                  </v-data-table>
              </v-card>
              </div>
            </div>
          </div>
      </div>
  </template>

<script>
  import axios from "axios";
  import { getSttendance } from '~/utils/get_data';

  export default {
    data() {
      return {
        search: '',
        items: [],
        headers: [
          { title: '#', key: 'attendance_id' },
          { title: 'ไอดีนักศึกษา', align: 'end', key: 'student_id' },
          { title: 'อีเมล', align: 'end', key: 'username' },
          { title: 'เวลาที่เช็ค', align: 'end', key: 'checkin_time' },
          { title: 'สถานะ', align: 'end', key: 'status_id' },
        ],
        isTeacher: false,
      };
    },
    methods: {
      async isLogin() {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token not found");
            return;
          }

          const response = await axios.get("http://26.21.199.184:7000/settings/check-user-type", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.student_type === "teacher") {
            this.isTeacher = true;
          } else {
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์ผู้ใช้", error);
        }
      },

      checkIn() {
        this.$router.push("/teacher/check_student");
      },

      async fetchDays() {
        try {
          const result = await getSttendance();
          if (result.ok === 1) {
            this.items = result.getSttendance.map((item, index) => ({
              attendance_id: index + 1,
              student_id: item.student_id,
              username: item.username,
              checkin_time: item.checkin_time,
              status_id: item.status_id
            }));
            console.log(this.items);
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาด", error);
        }
      },
    },
    mounted() {
      this.isLogin();
      this.fetchDays();
    },
  };
</script>

<style>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
  
  .background-body {
    background: url('~/assets/images/background/background3.png') no-repeat;
    background-size: cover;
    background-position: center;
    border-radius: 0px 0px 100px 0px;
    max-height: 100%;
    position: relative;
    overflow: hidden;
    padding: 60px 0;
    width: 100%;
    z-index: 0;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      z-index: -1;
    }
  }
  
  .image-homepage {
    max-width: 100%;
    height: auto;
    margin-top: 40px;
    border-radius: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease-in-out;
  
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .header-homepage {
    margin-top: 60px;
    z-index: 1;
  
    .font-p-home {
      .box-shadow {
        padding: 20px;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        background-color: #fff;
      }
  
      .font-head {
        font-weight: 900;
        font-size: clamp(40px, 3vw, 50px);
        color: #000;
        text-shadow: #d5d5d5 2px 2px 2px;
      }
  
      .font-body {
        font-size: clamp(16px, 3vw, 20px);
        line-height: 1.5;
        color: #000;
        text-shadow: #d5d5d5 2px 2px 2px;
      }
  
      .button-checkin {
        background: #f57c00;
        color: #fff;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 20px;
        max-width: 200px;
        margin-top: 60px;
        width: 80%;
        font-size: clamp(16px, 3vw, 20px);
        border: none;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease-in-out;
      }
  
      .button-checkin:hover {
        background: #e64a19;
        transform: scale(1.05);
      }
    }
  }
  
  .body-homepage {
    margin-top: -30px;

    .blog-container {
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 15px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    .blog-item {
        background: #fff;
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px; /* เพิ่มระยะห่าง 10px ระหว่างบล็อก */
        overflow: hidden;
        text-align: left;
        transition: all 0.3s ease-in-out;
        border-bottom: 1px solid #ccc;
    }

    .blog-content {
        font-size: 14px;
        line-height: 1.6;
        max-height: 100px; /* จำกัดความสูงของเนื้อหา */
        overflow: hidden; /* ซ่อนข้อความที่เกิน */
        text-overflow: ellipsis; /* เพิ่ม ... */
        white-space: normal; /* ตัดคำปกติ */
    }

    .blog-item:hover .blog-content {
        max-height: none; /* แสดงข้อความทั้งหมดเมื่อ hover */
        overflow: visible;
        transition: all 0.5s ease-in-out;
    }

    .blog-item h5 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
    }
    }
</style>
  