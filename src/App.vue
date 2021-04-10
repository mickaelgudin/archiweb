<template>
  <v-app >
    <sidebar></sidebar>
    <sidebar v-if="!isMobile"/>
    <v-main v-else>
      <v-container>
        <sidebar/>
      </v-container>
    </v-main>

    <router-view></router-view>
  </v-app>

</template>

<script>

import sidebar from "./components/NavBarSideBar.vue";

export default {
  components: { sidebar },
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