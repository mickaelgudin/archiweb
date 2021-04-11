<template>
  <div>
    <v-navigation-drawer
        v-model="drawer"
        app
        absolute
        temporary
    >
      <v-list>
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
        >
          <v-list-item-action>
            <v-icon color="#60378c">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title color="#60378c" v-text="$t(item.title)" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
        :clipped-left="clipped"
        fixed
        app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title  class="aroundLogo">
      </v-toolbar-title>
      <v-avatar color="#60378c" width="55" height="55"
                style="border-radius: 50%; margin-top:1%; margin-bottom: 1%"
      >
        <v-avatar color="white" width="50" height="50"
                  style="border: 8px solid #60378c; border-radius: 50%;"
                  @click="redirect('/')"
        >
          <v-icon class="iconify" data-icon="mdi:train" height="30" width="30" style="color:#60378c;"></v-icon>
        </v-avatar>
      </v-avatar>
      <v-toolbar-title class="aroundTitle" v-text="title" @click="redirect('/')">
      </v-toolbar-title>

      <v-spacer></v-spacer>


      <v-btn large text v-for="(item, index) in items" :key="index"  color="#60378c" @click="redirect(item.to)">
        {{ $t(item.title) }}
      </v-btn>
     
      <locale-changer></locale-changer>
    </v-app-bar>


  </div>
</template>

<script>
import localeChanger from './locale-changer.vue';

export default {
  components:{localeChanger },
  name : "sidebar",
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      isMobile: null,
      items: [
        {
          icon: 'mdi-home-map-marker',
          title: 'menuHome',
          to: '/'
        },
        {
          icon: 'mdi-database-plus',
          title: 'menuCrudStation',
          to: '/stations'
        },
        {
          icon: 'mdi-transit-connection-variant',
          title: 'menuApi',
          to: '/api'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Rail Wars Trains APP",

    }
  },
  mounted() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  },

  methods: {

    redirect(to){
      this.$router.push(to)
    }


  }
}
</script>

<style>
.aroundTitle{
  border: 5px solid transparent;
  margin-left: 10px;
}
.aroundLogo{
  margin-top: 9px;
}
.arrowDropdown{
  margin-left: 5px;
}
</style>