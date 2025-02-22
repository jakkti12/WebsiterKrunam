<template>
    <div class="navbar-menu">
        <nav class="navbar custom-navbar p-0">
            <div class="justify-content-between justify-sm-content-start">
                <button type="button" class="navbar-forgot" data-bs-toggle="offcanvas" data-bs-target="#navbarMenu">
                    <i class="bi bi-three-dots"></i>
                </button>
                <div>
                    <a href="login">
                        <i class="bi bi-x-lg close-icon"></i>
                    </a>
                </div>
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
    <!-- ส่วน body -->
    <div class="text-center body-forgot">
        <div class="icon-group color-lightgreen">
            <i class="bi bi-lock-fill"></i>
        </div>
        <div class="title-forgot color-lightgreen">
            <p class="font-weight-bold">Forgot</p>
            <p>Password?</p>
        </div>
        <div class="text-forgot color-lightgreen">
            <p>No worries, we'll send you</p>
            <p>reset instructions</p>
        </div>
    </div>
    <!-- ส่วน footer -->
    <div class="footer-forgot">
        <div class="card">
            <div class="card-body">
                <!-- ส่วนของช่องกรอก Email -->
                <div class="input-container">
                    <div class="input-wrapper">
                        <label for="inputEmail" class="form-label">Email</label>
                        <i class="bi bi-envelope icon ml-4"></i>
                        <input type="text" placeholder="Email Address" class="input-field">
                    </div>
                </div>
                <!-- ส่วนปุ่ม Resetpassword -->
                <div class="text-center mt-3">
                    <button type="submit" class="btn btn-primary button-reset-password">
                        Reset Password
                    </button>
                </div>
                <!-- ส่วนปุ่ม Back to Login -->
                <div class="text-center mt-3">
                    <a class="btn btn-link forgot-back">
                        Back to Login
                    </a>
                </div>
                <!-- ส่วนของปุ่มย้อนกลับ -->
                 <div class="text-center mt-3">
                    <a href="login">
                        <i class="bi bi-arrow-left-square icon-forgot-back"></i>
                    </a>
                 </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>

.color-lightgreen {
    color: #2b524a;
    border: none;
    background-color: transparent;
    text-decoration: none;
}
.font-weight-bold {
    font-weight: bold;
}

// ส่วนของ css ของ navbar
.navbar-menu {
    z-index: 1045; /* ปรับให้ต่ำกว่าข้างบน */

        .navbar-forgot {
            color: #2b524a;
            position: relative;
            top: 0;
            left: 50%;
            right: 0;
            font-size: 40px;

                .icon-group {
                    display: flex;
                    gap: 10px; /* ปรับระยะห่างระหว่างไอคอน */
                    align-items: center; /* จัดให้อยู่ในแนวเดียวกันในแนวตั้ง */
                    justify-content: flex-start; /* จัดให้อยู่ด้านซ้าย */
                    position: relative;
                }

                .icon-group a {
                    color: white;
                    font-size: 24px;
                    text-decoration: none;
                }

                .icon-group i {
                    transition: color 0.3s ease;
                }

                .icon-group a:hover i {
                    color: #adbcb9; /* เปลี่ยนสีเมื่อ hover */
                }
        }
        // icon close
        .close-icon {
            color: #2b524a;
            position: absolute;
            top: 0;
            right: 30px; /* ปรับระยะห่างจากซ้าย */
            font-size: clamp(20px, 5vw, 40px);
            cursor: pointer;
            font-weight: 100;
        }
}

// ส่วนของ css ของ body
.body-forgot {
    margin-top: 2%;

        .icon-group {
            font-size: 120px;
        }

        .title-forgot {
            margin-top: 20px;
            font-size: clamp(40px, 5vw, 60px);
            line-height: 0.8;
        }

        .text-forgot {
            margin-top: 40px;
            font-size: clamp(16px, 5vw, 20px);
            line-height: 0.8;
        }
}
// ส่วนของ css ของ footer
.footer-forgot {

        .card {
            border: none;


                .card-body {
                    background: linear-gradient(90deg, #4b8378, #2b5f56);
                    border-radius: 40px 40px 0 0;
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    padding: 20px;
                    margin-top: 50px;

                    .input-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 20px;

                        .form-label {
                            position: absolute;
                            margin-right: 25% !important;
                            color: #fff;
                            margin-top: -120px;
                        }

                        .input-wrapper {
                            display: flex;
                            align-items: center;
                            border: 2px solid #fff;
                            border-radius: 50px;
                            padding: 15px;
                            max-width: 450px;
                            width: 100%;
                            background-color: rgba(255, 255, 255, 0.1); /* เลือกสีพื้นหลังแบบโปร่งแสง */
                            color: #fff;
                            margin-top: 80px;
                        }

                        .input-wrapper:hover, .input-field:focus {
                            border-color: #85a7a0; /* เปลี่ยนสีขอบเมื่อ hover หรือ focus */
                        }

                        .input-field {
                            border: none;
                            outline: none;
                            background: transparent;
                            color: #adbcb9;
                            padding-left: 10px;
                            width: 100%;
                        }

                        .input-field::placeholder {
                            color: #adbcb9;
                        }
                    }

                    .button-reset-password {
                        margin-top: 20px;
                        background: #bed2d0;
                        border: 2px solid #9cbcb7;
                        color: #2b524a;
                        padding: 15px 20px;
                        cursor: pointer;
                        border-radius: 50px;
                        max-width: 450px;
                        width: 100%;
                        font-size:large;

                        &:hover {
                            background: #4b8378;
                        }
                    }

                    .forgot-back {
                        margin-top: 20px;
                        color: #fff;
                        font-size: clamp(14px, 4vw, 18px);
                    }

                    .icon-forgot-back {
                        margin-top: 20px;
                        color: #fff;
                        font-size: clamp(40px, 4vw, 50px);
                    }

                }
        }
}
</style>