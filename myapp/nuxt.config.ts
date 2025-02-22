import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devServer: {
    // https: httpsOptions
    host: '0.0.0.0',
    port: 3000
  },

  build: {
    transpile: ['vuetify'],  // ใช้ Vuetify ผ่าน Vite
  },

  // ใช้ Vuetify ผ่าน Nuxt module
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

  // สำหรับ transformAssetUrls เพื่อใช้งาน asset ใน Vuetify
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  // โหลด CSS ที่เกี่ยวข้องกับ Vuetify
  css: [
    'vuetify/styles',  // เพิ่ม Vuetify CSS
    '~/assets/css/bootstrap.min.css',
    '~/assets/css/custom.css',
    '~/assets/icons/bootstrap-icons.css',
    '@fortawesome/fontawesome-free/css/all.css',
  ],

  // คอนฟิกหัวเว็บ (head) รวม script หรือ styles อื่นๆ
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
        },
      ],
    },
  },

  compatibilityDate: '2024-10-15',
})
