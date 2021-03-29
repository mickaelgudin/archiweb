<template>
  <v-app >
    <locale-changer></locale-changer>
    <router-view></router-view>
  </v-app>

</template>

<script>
import localeChanger from './components/locale-changer.vue';

export default {
  components: { localeChanger },
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