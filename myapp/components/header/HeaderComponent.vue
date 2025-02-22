<template>
    <nav class="navbar custom-navbar-hd bg-light p-0">
      <div class="container justify-content-between justify-sm-content-start">
        <a class="navbar-brand" href="/">
          <img style="width: 65px; border-radius: 100%;" src="~/assets/images/1.png" alt="Resume Kit" />
        </a>
        <button class="navbar-toggler m-2 d-sm-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- ส่วนของหน้า responsive -->
        <div class="offcanvas offcanvas-start d-block d-sm-none" id="navbarMenu">
          <ul class="list-group">
            <li class="list-group-item fw-bold">เมนูหลัก</li>
            <li>
              <a class="list-group-item" href="/"><i class="bi-house"></i> หน้าหลัก</a>
            </li>
            <li v-if="!isLoggedIn">
              <a href="/auth/login" class="list-group-item"><i class="bi-box-arrow-in-right"></i> เข้าสู่ระบบ</a>
            </li>
            <li v-if="!isLoggedIn">
              <a href="/auth/create" class="list-group-item"><i class="bi-person-plus"></i> สมัครสมาชิก</a>
            </li>
            <li v-if="isLoggedIn" >
              <a href="#" class="nav-link custom-nav-link" @click="logout">ออกจากระบบ</a>
            </li>
          </ul>
        </div>
        <!-- ส่วนของหน้า Web -->
        <div class="d-none d-sm-flex flex-grow-1">
          <ul class="nav flex-row">
            <li class="nav-item">
              <a href="/" class="nav-link custom-nav-link">หน้าหลัก</a>
            </li>
            <!-- <li v-if="user_type === 'admin'" class="nav-item">
              <a href="/check_users" class="nav-link custom-nav-link">ตารางตรวจเช็ค</a>
            </li> -->
          </ul>
          <ul class="nav flex-row ms-auto">
            <li v-if="!isLoggedIn" class="nav-item">
              <a href="/auth/login" class="nav-link custom-nav-link">เข้าสู่ระบบ</a>
            </li>
            <li v-if="!isLoggedIn" class="nav-item">
              <a href="/auth/create" class="nav-link custom-nav-link">สมัครสมาชิก</a>
            </li>
            <li v-if="isLoggedIn" class="nav-item dropdown me-2">
              <!-- Dropdown button -->
              <a href="#" 
                class="nav-link custom-nav-link" 
                data-bs-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false">
                <i class="bi bi-person-fill"></i>
              </a>
              <!-- Dropdown menu -->
              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                <li>
                  <a href="/admin/students" class="dropdown-item custom-nav-link">
                    <i class="bi bi-person"></i> {{ username.username }}
                  </a>
                </li>
                <li>
                  <a href="/settings/profile" class="dropdown-item custom-nav-link">
                    <i class="bi bi-gear"></i> แก้ไขข้อมูล
                  </a>
                </li>
                <li>
                  <a href="#" class="dropdown-item custom-nav-link" @click="logout">
                    <i class="bi bi-box-arrow-left"></i> ออกจากระบบ
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { getUser } from '~/utils/user';

const username = ref('')

const isLoggedIn = ref(false)
const router = useRouter()


const logout = async () => {
  try {
    await axios.post('http://26.21.199.184:7000/auth/logout',
      {},
    )
      localStorage.removeItem('token')
      router.push('/auth/login')
    } catch (error) {
      console.error('Error during logout:', error)
    }
};

const fetchDays = async () => {
  try {

    const user = await getUser();
    if (user.isLoggedIn == true) {
      username.value = user.user;
      isLoggedIn.value = true;
    }

  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลวันที่", error);    
  }
};

fetchDays();


onMounted(() => {
});
</script>

<style>
.offcanvas {
  width: 80% !important;
}
.custom-nav-link {
  color: #000000 !important;
  font-size: 20px !important;
  font-weight: bold;
  text-shadow: 1px 1px #cccccc;
  transition: color 0.3s ease-in-out;
  text-decoration: none;
}

.custom-nav-link:hover {
  color: #004cff !important;
}

.custom-navbar-hd {
  top: 0;
  left: 0;
  right: 0;
  background: #607d8b !important;
  width: 100%;
  padding: 10px 0;
  z-index: 999;
}

/* Optional: Style the dropdown for better appearance */
.dropdown-menu {
  max-width: 350px;
  transform: translateX(-80%); /* เลื่อนไปทางซ้ายสุด */
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}

.dropdown-item {
  font-weight: normal;
}

.navbar-toggler {
  border: none;
}
</style>
