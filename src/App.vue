<template>
  <v-app >
    <navbar-sidebar></navbar-sidebar>
    <NavBarSideBar v-if="!isMobile"/>
    <v-main v-else>
      <v-container>
        <NavBarSideBar/>
      </v-container>
    </v-main>

    <router-view></router-view>
  </v-app>

</template>

<script>

import NavBarSideBar from "./components/NavBarSideBar.vue";

export default {
  components: { NavBarSideBar },
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