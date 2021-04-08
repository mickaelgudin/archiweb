<template>
  <div class="locale-changer">
    <v-container >
      <v-select :items="langs" @change="changeLanguage" v-model="$i18n.locale"></v-select>
    </v-container>

  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'locale-changer',
  data () {
    return { langs: ['fr', 'en'] }
  },
  methods: {
    /**
     * changing back end language, so that custom errors are throwned in selected language
     */
    changeLanguage : function() {
      axios
          .put('https://projet-web-trains.herokuapp.com/language/'+this.$i18n.locale);
    }
  }
}
</script>