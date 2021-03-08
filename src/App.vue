<template>
  <v-app >

    <router-view></router-view>
  </v-app>

</template>

<script>

export default {
  name: "App",

  data : () => ({
    isMobile: false
  }),

  mounted() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  },
}
</script>

<style scoped>

</style>