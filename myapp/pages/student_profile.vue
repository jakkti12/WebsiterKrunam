<template>
  <v-app>
    <v-app-bar 
      color="teal" 
      height="25vh"
      class="rounded-b-xl"
      elevation="0"
    >
      <v-btn 
        icon="mdi-arrow-left" 
        color="white" 
        class="back-button"
      ></v-btn>
      
      <div class="profile-section">
        <div class="text-center">
          <div class="text-h6 text-white mb-6">Student Profile</div>
          
          <v-avatar 
            size="80" 
            class="mb-4 white"
          >
            <v-icon 
              size="40" 
              color="#0158c8"
            >
              mdi-account
            </v-icon>
          </v-avatar>

          <div class="edit-button-wrapper">
            <v-btn
              icon="mdi-pencil"
              size="small"
              class="avatar-edit-btn"
              color="white"
              variant="flat"
            ></v-btn>
          </div>
          
          <div class="white--text text-h6 mb-1">Nopparat Inmee</div>
          <div class="white--text text-subtitle-2">Nopparat@reallygreatsite.com</div>
        </div>
      </div>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container>
        <!-- General Settings Section -->
        <div class="text-subtitle-1 mb-2">General Settings</div>
        <v-card flat class="mb-4">
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-theme-light-dark</v-icon>
              </template>
              <v-list-item-title>Mode</v-list-item-title>
              <v-list-item-subtitle>Dark & Light</v-list-item-subtitle>
              <template v-slot:append>
                <v-switch color="primary"></v-switch>
              </template>
            </v-list-item>

            <v-list-item link>
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
// ไม่จำเป็นต้องใช้ script
</script>

<style scoped>
.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
}

.profile-section {
  width: 100%;
  padding-top: 2rem;
}

.edit-button-wrapper {
  position: relative;
  width: 80px;
  margin: -24px auto 16px;
}

.avatar-edit-btn {
  position: absolute;
  right: -5px;
  bottom: 0;
  background-color: #0158c8 !important;
  border: 2px solid white !important;
}

/* กำหนดให้ v-main แสดงใต้ v-app-bar */
.v-main {
  padding-top: calc(25vh + 16px) !important;
  background-color: #f5f5f5;
}

/* กำหนดสีข้อความ */
.white--text {
  color: white !important;
}

.text-white {
  color: white !important;
}

/* กำหนดสีพื้นหลัง avatar */
.v-avatar.white {
  background-color: #f5f5f5 !important;
}

/* ปรับ container */
.v-container {
  max-width: 100%;
  width: 100%;
  padding: 16px;
}
</style>