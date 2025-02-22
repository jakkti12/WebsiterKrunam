<template>
  <HeaderComponent />
  <StudentComponent />
</template>

<script>
import HeaderComponent from '~/components/header/HeaderComponent.vue';
import StudentComponent from '~/components/admin/StudentComponent.vue';

export default {
components: {
  HeaderComponent,
  StudentComponent
},
};
</script>

<style lang="scss" scoped>

</style>