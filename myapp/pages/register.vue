<template>
<nav class="navbar navbar-expand-sm navbar-login navbar-dark">
  <div class="container-fluid">
    <a class="nav-link active" href="#">KruNam App.</a>
    <button style="color: black;" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mynavbar">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">Home</a>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control me-2" type="text" placeholder="Search">
        <button class="btn btn-primary" type="button">Search</button>
      </form>
    </div>
  </div>
</nav>
  <div class="body-login">
    <div class="row">
      <div class="col-md-8 col-lg-5">
        <div class="container">
          <div class="text-center mb-5 mt-5">
            <h1>Register-Form</h1>
            <p>Welcome to Kru Nam</p>
          </div>

          <div class="card mb-3">
            <div class="card-body">
              <!-- Register Form -->
                <div class="mb-3">
                  <v-label for="inputEmail" class="form-label">Email</v-label>
                  <input class="form-control rounded-input" type="email" placeholder="Email" />
                </div>
  
                <div class="mb-3">
                  <v-label for="inputPassword" class="form-label">Password</v-label>
                  <input class="form-control rounded-input" type="password" placeholder="Password" />
                </div>
  
                <div class="mb-3">
                  <v-label for="inputConfirmPassword" class="form-label">Confirm Password</v-label>
                  <input class="form-control rounded-input" type="password" placeholder="Confirm Password" />
                </div>
  
                <div class="text-center">
                  <button type="submit" class="btn btn-success rounded-input">Register</button>
                </div>
                
                <div class="text-center mt-3">
                    <button class="btn btn-link" @click="login">
                        Already have an account? register
                    </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-md-8 col-lg-7">
            <div id="demo" class="carousel slide slide-img" data-bs-ride="carousel">
                <!-- Indicators/dots -->
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
                    <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
                </div>
    
                <!-- The slideshow/carousel -->
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="~/assets/img/img1.jpg" alt="Los Angeles" class="d-block" style="width:100%">
                    </div>
                    <div class="carousel-item">
                        <img src="~/assets/img/img2.jpg" alt="Chicago" class="d-block" style="width:100%">
                    </div>
                    <div class="carousel-item">
                        <img src="~/assets/img/img3.jpg" alt="New York" class="d-block" style="width:100%">
                    </div>
                </div>
    
                <!-- Left and right controls/icons -->
                <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </button>
            </div>
        </div>
      </div>
    </div>
<div class="default-layout"></div>
</template>
<script>
export default {
    methods: {
        login() {
            this.$router.push('login');
        }
    }
};
</script>
<style scoped>
    @import url('~/assets/style/register_form.css');
</style>
