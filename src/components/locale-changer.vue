<template>
  <div class="locale-changer">
    <v-container fluid>
        <v-row align="center">
            <v-col class="d-flex" cols="2" sm="1">
                <v-select :items="langs" @change="changeLanguage" v-model="$i18n.locale"></v-select>
            </v-col>
        </v-row>
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
            .get('https://projet-web-trains.herokuapp.com/language/'+this.$i18n.locale);
      }
  }
}
</script>