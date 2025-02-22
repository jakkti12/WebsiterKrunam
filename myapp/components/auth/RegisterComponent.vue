<template>
    <v-alert
      v-if="error || success"
      :type="error ? 'error' : 'success'"
      closable
      :title="error ? 'Registration Failed' : 'Registration Successful'"
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
                        <li class="list-group-item fw-bold">เมนูหลัก</li>
                        <li>
                            <a class="list-group-item" href="/"><i class="bi-house"></i> หน้าหลัก</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>

    <form @submit.prevent="register" class="body-register">
        <div>
            <div>
                <!-- Logo Image -->
                <div class="input-container logo-register">
                    <img width="350px" src="~/assets/images/1.png" alt="" class="img-fluid">
                </div>
                
                <!-- Registration Form Fields -->
                <div class="input-container mt-5">
                    <v-text-field
                        v-model="username"
                        label="Email Address"
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

                    <v-text-field
                        v-model="confpassword"
                        :type="confPasswordVisible ? 'text' : 'password'"
                        label="Confirm Password"
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
                            <v-icon icon="mdi-lock" color="#f57c00"></v-icon>
                        </template>
                        <template v-slot:append-inner>
                            <v-icon @click="togglePasswordVisibility('confpassword')" :color="confPasswordVisible ? '#607d8b' : '#f57c00'">
                                mdi-eye
                            </v-icon>
                        </template>
                    </v-text-field>
                </div>
            </div>
        </div>

        <!-- Terms & Conditions Checkbox (Centered) -->
        <div class="checkbox-center form-check mt-5">
            <input type="checkbox" class="form-check-input checkbox-green">
            <label class="form-check-label color-lightgreen ml-5" for="checkAgree">
                I agree to the 
                <a href="#" class="color-lightgreen font-weight-bold">
                    Terms & Privacy
                </a>
            </label>
        </div>

        <!-- Submit Button -->
        <div class="footer-register">
            <div class="text-center mt-5">
                <button type="submit" class="btn btn-primary rounded-input button-login">Sign Up</button>
            </div>

            <!-- Link to Login -->
            <div class="text-center text-have mt-3">
                <p class="color-lightgreen">
                    Have an account?
                    <a href="login" class="color-lightgreen font-weight-bold">Sign In</a>
                </p>
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
    const confpassword = ref('');
    const error = ref(null);
    const success = ref(null);
    const passwordVisible = ref(false);
    const confPasswordVisible = ref(false);

    const register = async () => {
      error.value = null;
      success.value = null;

      // Validate password match
      if (password.value !== confpassword.value) {
        alert("Password and confirm password do not match.");
        return;
      }

      try {
        const response = await axios.post('http://26.21.199.184:7000/auth/register', {
          username: username.value,
          password: password.value,
        });
        success.value = response.data.message;
        setTimeout(() => router.push('/auth/login'), 2000); // Redirect to login page
      } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred';
      }
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
      confpassword,
      error,
      success,
      register,
      passwordVisible,
      confPasswordVisible,
      togglePasswordVisibility,
    };
  },
};
</script>

<style scoped>
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

.background-body-register {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    width: 20%;
    height: 100%;
    z-index: -1;
    opacity: 0.5;
}

.color-lightgreen {
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

.body-register {
    z-index: 1;

    .logo-register {
        background-color: #607d8b !important;
        padding: 40px !important;
        border-radius: 100% !important;
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
            color: #607d8b !important;
        }
        :deep(.custom-text-field .v-label) {
            color: #607d8b !important;
        }
    }
}

.footer-register {
    z-index: 2;
    width: 100%;
    .button-login {
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
    .text-have {
        margin-top: 20px;
    }
}

.checkbox-center {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

@media screen and (max-width: 768px) {
    .body-register .navbar-login {
        left: 0;
    }

    .footer-register {
        .card {
            width: 100%;
        }
    }
}
</style>
