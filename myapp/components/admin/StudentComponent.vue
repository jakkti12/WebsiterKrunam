<template>
    <div class="container">
      <v-card flat class="elevation-3 animated-card">
      <v-card-title class="d-flex align-center pe-2 title-bar" v-if="isAdmin">
        <v-icon icon="mdi-account-edit" color="ffffff"></v-icon>
        <span class="ml-2 text-h6">จัดการผู้ใช้งาน</span>

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          density="compact"
          label="ค้นหา"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          hide-details
          class="search-field"
        ></v-text-field>

        <v-btn
          color="primary"
          class="ml-2 action-btn"
          @click="newItem"
          v-if="isAdmin"
        >เพิ่มผู้ใช้งาน</v-btn>
        <v-btn
          color="primary"
          class="ml-2 action-btn"
          @click="openExcelFileDialog"
        >
          นำเข้าข้อมูลจาก Excel
        </v-btn>

        <v-file-input
          ref="excelFileInput"
          v-model="excelFile"
          accept=".xlsx,.xls"
          label="เลือกไฟล์ Excel"
          style="display: none"
          @change="handleFileUpload"
        ></v-file-input>
      </v-card-title>

      <v-divider></v-divider>
  
      <!-- แสดง Alert ถ้าไม่ใช่ Admin -->
      <v-alert
        v-if="showAlert"
        type="error"
        closable
        title="ข้อผิดพลาด"
        text
        variant="outlined"
        @click:close="closeAlert"
      >
        {{ alertMessage }}
      </v-alert>

      <v-alert
      v-if="showSuccess"
      type="success"
      style="z-index:1000"
      closable
      title="สำเร็จ"
      text
      variant="outlined"
      @click:close="closeAlert"
    >
      {{ successMessage }}
    </v-alert>

      <v-row class="mt-5" v-if="isAdmin">
      <v-col
        v-for="(item, index) in paginatedDesserts"
        :key="item.id"
        cols="12"
        sm="6"
        md="3"
      >
        <v-container class="md-2">
          <v-card class="hover-effect mx-auto" outlined>
            <v-img
              :src="`http://26.21.199.184:7000/uploads/profiles/${item.picture}`"
              height="200px"
            ></v-img>
            <v-card-title>{{ item.username }}</v-card-title>
            <v-card-subtitle>User ID: {{ item.student_id }}</v-card-subtitle>
            <v-card-text>User Type: {{ item.student_type }}</v-card-text>
            <v-card-actions>

              <!-- ปุ่มเข้าสู้ระบบของผู้ใช้ -->
              <v-btn
                color="green"
                text
                @click="bypassItem(item.id)"
              >
                เข้าสู่ระบบ
              </v-btn>

              <!-- ปุ่มแก้ไข -->
              <v-btn
                color="primary"
                text
                @click="editItem(item)"
              >
                แก้ไข
              </v-btn>

              <!-- ปุ่มลบ -->
              <v-btn
                color="error"
                text
                @click="deleteItem(item)"
              >
                ลบ
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-container>
      </v-col>
    </v-row>
  
    <v-pagination
      v-if="isAdmin"
      v-model="page"
      :length="totalPages"
      :total-visible="7"
      class="hover-effect mt-4"
    ></v-pagination>

      <!-- Dialogs -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.student_id"
                    label="Student ID"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.username"
                    label="Username"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.newPassword"
                    label="Password"
                    type="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="singleFile"
                    label="อัปโหลดรูป"
                    accept="image/*"
                    @change="previewSingleFile"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-img
                v-if="singleFilePreview"
                :src="singleFilePreview"
                max-width="100"
                max-height="100"
                class="my-4"
              ></v-img>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="close">ยกเลิก</v-btn>
            <v-btn text color="primary" @click="save">บันทึก</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">ยืนยันการลบ?</v-card-title>
          <v-card-actions>
            <v-btn text @click="closeDelete">ยกเลิก</v-btn>
            <v-btn text color="error" @click="deleteItemConfirm">ตกลง</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import * as XLSX from 'xlsx';
  
  export default {
    data: () => ({
      student_type: "",
      search: "",
      desserts: [],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        id: "",
        student_id: "",
        username: "",
        password: "",
        newPassword: "",
        picture: "",
      },
      defaultItem: {
        id: "",
        student_id: "",
        username: "",
        password: "",
        picture: "",
      },
      singleFile: null,
      singleFilePreview: null,
      showAlert: false, // ใช้ v-model กับ Alert
      showSuccess: false,
      alertMessage: "", // ข้อความที่จะแสดงใน Alert
      successMessage: "", // 
      isAdmin: false, // สถานะสำหรับตรวจสอบว่าเป็น admin หรือไม่
      page: 1,
      itemsPerPage: 8,
    }),
  
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? "เพิ่มสมาชิกใหม่" : "แก้ไขข้อมูล";
      },
      filteredDesserts() {
        return this.desserts.filter((item) =>
        item.username.toLowerCase().includes(this.search.toLowerCase())
      );
    },
      totalPages() {
        return Math.ceil(this.filteredDesserts.length / this.itemsPerPage);
      },
      paginatedDesserts() {
        const start = (this.page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredDesserts.slice(start, end);
      },
    },
  
    async created() {
      try {
        const response = await axios.get("http://26.21.199.184:7000/admin/list-student");
        this.desserts = response.data.users;
      } catch (error) {
        this.showError("เกิดข้อผิดพลาดในการโหลดข้อมูลสมาชิก");
      }
    },
  
    async mounted() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.showError("คุณไม่ได้เข้าสู่ระบบ");
        this.$router.push("/auth/login");
        return;
      }
      try {
        const response = await axios.get(
          "http://26.21.199.184:7000/settings/check-user-type",
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        this.student_type = response.data.student_type;
        if (this.student_type === "admin") {
          this.isAdmin = true; // ถ้าเป็น admin จะให้แสดงข้อมูล
        } else {
          this.showError("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        }
      } catch (error) {
        this.showError("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์ผู้ใช้");
      }
    },
  
    methods: {
      openExcelFileDialog() {
        // เปิดกล่องเลือกไฟล์
        this.$refs.excelFileInput.click();
      },

      handleFileUpload(event) {
        // อ่านไฟล์ Excel
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            // รับข้อมูลจากแผ่นงานแรก
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // แปลงข้อมูลจากแผ่นงานเป็น JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // ส่งข้อมูลไปที่เซิร์ฟเวอร์
            this.uploadExcelData(jsonData);
          };
          reader.readAsBinaryString(file);
        }
      },

      async uploadExcelData(data) {
        try {
          // ส่งข้อมูลไปยังเซิร์ฟเวอร์
          const response = await axios.post("http://26.21.199.184:7000/admin/upload-excel", {
            users: data
          });
          this.showSucc("นำเข้าข้อมูลสำเร็จ");
        } catch (error) {
          this.showError("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
        }
      },

      showSucc(message) {
        this.successMessage = message;
        this.showSuccess = true;
      },
      showError(message) {
        this.alertMessage = message;
        this.showAlert = true;
      },
      closeAlert() {
        this.showAlert = false;  // เมื่อกดปิด alert ให้กลับไปยังหน้าอื่น
        this.showSuccess = false;
      },
      previewSingleFile() {
        if (this.singleFile) {
          this.singleFilePreview = URL.createObjectURL(this.singleFile);
        } else {
          this.singleFilePreview = null;
        }
      },
      newItem() {
        this.editedIndex = -1;
        this.editedItem = { ...this.defaultItem };
        this.dialog = true;
      },
      async bypassItem(item) {
        console.log(item);
        const response = await axios.post('http://26.21.199.184:7000/admin/bypass-user', {
            id: item
        });

        if (response.status == 200) {
          localStorage.setItem('token', response.data.token);
          this.$router.push('/auth/login')
        }
      },
      editItem(item) {
        this.editedIndex = this.desserts.indexOf(item);
        this.editedItem = { ...item };
        this.dialog = true;
      },
      deleteItem(item) {
        this.editedIndex = this.desserts.indexOf(item);
        this.editedItem = { ...item };
        this.dialogDelete = true;
      },
      async deleteItemConfirm() {
        try {
          await axios.post(
            "http://26.21.199.184:7000/admin/delete-student-by-id",
            this.editedItem
          );
          this.desserts.splice(this.editedIndex, 1);
        } catch (error) {
          this.showError("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
        this.dialogDelete = false;
      },
      close() {
        this.dialog = false;
        this.editedItem = { ...this.defaultItem };
        this.singleFile = null;
        this.singleFilePreview = null;
      },
      closeDelete() {
        this.dialogDelete = false;
        this.editedItem = { ...this.defaultItem };
      },
      async save() {
        try {

        if (this.singleFile) {
          const formData = new FormData();
          formData.append("picture", this.singleFile);
          formData.append("student_id", this.editedItem.student_id);

          const uploadResponse = await axios.post(
            "http://26.21.199.184:7000/upload/upload-single-student",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          this.editedItem.picture = uploadResponse.data.file.filename;
        }

        if (this.editedItem.id) {
          await axios.post("http://26.21.199.184:7000/admin/update-user", 
          this.editedItem
        );
          Object.assign(this.desserts[this.editedIndex], this.editedItem);
        } else {
          const createResponse = await axios.post("http://26.21.199.184:7000/admin/create-user", this.editedItem);
          this.desserts.push(createResponse.data.user);
        }

        if (this.editedItem.newPassword) {
          await axios.post("http://26.21.199.184:7000/admin/change-password", {
            id: this.editedItem.id,
            newPassword: this.editedItem.newPassword
          });
        }

        this.close();
    } catch (error) {
      this.showError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  }},
};
  </script>
  
  <style scoped src="@/assets/style/admin/Users.css">
  </style>
  