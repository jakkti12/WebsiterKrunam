<template>
    <!-- navbar ที่อยู่ในหน้า login -->
    <v-alert
      v-if="error || success"
      :type="error ? 'error' : 'success'"
      closable
      :title="error ? 'Login Failed' : 'Login Successful'"
      text
      variant="elevated"
      class="alert-global"
    >
      {{ error || success }}
    </v-alert>
    <div class="navbar-menu">
        <nav class="navbar custom-navbar p-0">
            <div class="justify-content-between justify-sm-content-start">
                <button type="button" class="navbar-login" data-bs-toggle="offcanvas" data-bs-target="#navbarMenu">
                    <i class="bi bi-three-dots"></i>
                </button>
                <div class="offcanvas offcanvas-start d-block navbar-menu" id="navbarMenu">
                    <ul class="list-group">
                        <li class="list-group-item fw-bold">
                            เมนูหลัก
                        </li>
                        <li>
                            <a class="list-group-item" href="/"><i class="bi-house"></i> หน้าหลัก</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
    <form @submit.prevent="login" class="body-login">
        <div class="">
            <div class="">
                <!-- รูปภาพ logo -->
                <div class="input-container logo-login">
                    <img width="350px" src="~/assets/images/1.png" alt="" class="img-fluid">
                </div>
                <!-- กล่องกรอก Email หรือ เบอร์ และ Password -->
                <div class="input-container mt-5">
                    <v-text-field
                        v-model="username"
                        label="Email or Phone"
                        variant="outlined"
                        color="#607d8b"
                        bg-color="transparent"
                        class="custom-text-field rounded-textfield"
                        rounded="lg"
                        width="100%"
                        max-width="450"
                        :autofill="false"
                        required
                    >
                        <template v-slot:prepend-inner>
                            <v-icon icon="mdi-account" color="#f57c00"></v-icon>
                        </template>
                    </v-text-field>
                    <v-text-field
                        v-model="password"
                        :type="passwordVisible ? 'text' : 'password'"
                        label="Password"
                        variant="outlined"
                        color="#607d8b"
                        bg-color="transparent"
                        type="password"
                        class="custom-text-field rounded-textfield"
                        rounded="lg"
                        width="100%"
                        max-width="450"
                        :autofill="false"
                        required
                    >
                        <template v-slot:prepend-inner>
                            <v-icon icon="mdi-lock" color="#f57c00"></v-icon>
                        </template>
                        <template v-slot:append-inner>
                            <v-icon @click="togglePasswordVisibility('password')" :color="passwordVisible ? '#607d8b' : '#f57c00'">
                                mdi-eye
                            </v-icon>
                        </template>
                    </v-text-field>
                </div>
            </div>
        </div>
        <!-- ส่วนปุ่ม Login และ Register -->
        <div class="footer-login">
            <div class="card">
                <div class="card-body">
                    <!-- ส่วนของ Forgot Password -->
                    <div class="text-center">
                        <a class="color-orange" href="forgot_password">Forgot password?</a>
                    </div>
                    <!-- ส่วนของปุ่ม Login และ Register -->
                    <div class="text-center mt-5">
                        <button type="submit" class="btn btn-primary rounded-input button-login">Login</button>
                    </div>

                    <p class="text-center mt-3 color-orange">or</p>

                    <div class="text-center mt-3">
                        <a @click="register" href="create" type="button" class="btn btn-primary rounded-input button-create">Create an account</a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const error = ref(null);
    const success = ref(null);
    const passwordVisible = ref(false);
    const confPasswordVisible = ref(false);
    
    // ตรวจสอบ token และเปลี่ยนเส้นทางถ้ามี token
    onMounted(() => {
      const token = localStorage.getItem('token');
      if (token) {
        alert('คุณได้เข้าสู่ระบบแล้ว');
        router.push('/');
      }
    });

    const login = async () => {
      error.value = null;
      success.value = null;

      try {
        const response = await axios.post('http://26.21.199.184:7000/auth/login', {
          username: username.value,
          password: password.value,
        });
        localStorage.setItem('token', response.data.token);
        success.value = response.data.message;
        setTimeout(() => router.push('/'), 2000); // เปลี่ยนเส้นทางหลังจากแสดงข้อความสำเร็จ
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred';
      }
    };

    const register = () => {
      router.push('/auth/create');
    };

    const togglePasswordVisibility = (field) => {
      if (field === 'password') {
        passwordVisible.value = !passwordVisible.value;
      } else if (field === 'confpassword') {
        confPasswordVisible.value = !confPasswordVisible.value;
      }
    };

    return {
      username,
      password,
      error,
      success,
      login,
      register,
      togglePasswordVisibility,
    };
  },
};
</script>

<style>
.background-body-login {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ede7f6;
    background-size: cover;
    position: absolute;
}
.alert-global {
    position: absolute !important;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    width: 90%;
    max-width: 500px;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-size: 1rem;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    text-align: center;
}
.alert-global[v-type="error"] {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
.alert-global[v-type="success"] {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.color-orange {
    color: #f57c00;
    border: none;
    background-color: transparent;
    text-decoration: none;
}

.offcanvas {
    z-index: 1050 !important;
}

.navbar-menu {
    z-index: 1045;
}

.navbar-login {
    color: #000;
    position: relative;
    top: 0;
    left: 80%;
    right: 0;
    font-size: 40px;
}

.body-login {
    z-index: 1;

    .logo-login {
        background-color: #607d8b !important;
        padding: 40px !important;
        border-radius: 100% !important;
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 300px;
        width: 300px;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;

        :deep(.custom-text-field) {
            width: 100%;
            max-width: 400px;
        }
        :deep(.custom-text-field .v-field__outline) {
            --v-field-border-opacity: 1;
            color: #607d8b !important;
        }
        :deep(.custom-text-field .v-label) {
            color: #607d8b !important;
        }
        :deep(.custom-text-field input) {
            color: #607d8b !important;
            box-shadow: none !important;
        }
        :deep(.rounded-textfield .v-field__outline) {
            border-radius: 40px;
        }
    }
}

.footer-login {
    z-index: 2;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;

    .card {
        border: 0;
        border-radius: 40px 40px 0 0;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        margin-top: 30px;
        width: 100%;

        .card-body {
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            height: 350px;
            width: 100%;

            .button-login {
                background: linear-gradient(90deg, #607d8b, #2b5f56);
                border: 2px solid white;
                color: #fff;
                padding: 15px 20px;
                cursor: pointer;
                border-radius: 50px;
                max-width: 450px;
                width: 80%;
                font-size: large;
                box-shadow: #d6d6d6 1px 5px 5px 1px;
                
                &:hover {
                    background: linear-gradient(90deg, #2b5f56, #607d8b);
                }

            }

            .button-create {
                background: #f57c00;
                border: 2px solid #607d8b;
                color: #fff;
                padding: 15px 20px;
                cursor: pointer;
                border-radius: 50px;
                max-width: 450px;
                width: 80%;
                font-size: large;
                box-shadow: #d6d6d6 1px 5px 5px 1px;

                &:hover {
                    background: #ef6c00;
                }
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .body-login {
        .navbar-login {
            left: 0;
        }
        .input-wrapper {
            max-width: 400px;
        }
    }
    .footer-login {
        .card {
            width: 100%;
        }
    }
}
</style>
