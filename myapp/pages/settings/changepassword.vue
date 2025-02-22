<template>
  <HeaderComponent />
  <ChangePasswordComponent />
</template>

<script>
import HeaderComponent from '~/components/header/HeaderComponent.vue'
import ChangePasswordComponent from '~/components/settings/ChangePasswordComponent.vue';

export default {
components: {
  HeaderComponent,
  ChangePasswordComponent
},
};
</script>

<style lang="scss" scoped>

</style>