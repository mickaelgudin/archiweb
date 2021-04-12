<template>
  <div class="locale-changer" style="padding-top: 30px;">
    <v-container>
        <v-row>
          <v-col cols="5" sm="5">
              <v-select :items="langs" item-text="name" v-model="$i18n.locale" color="#60378c" solo outlined>
                <template v-slot:item="{ item }">
                  {{item.fullname}}
                  <country-flag :country='item.flag' size='medium'/>
                </template>
              </v-select>
          </v-col>
        </v-row>
    </v-container>
  </div>
</template>

<script>
import CountryFlag from 'vue-country-flag'

export default {
  components : { CountryFlag },
  name: 'locale-changer',
  data () {
    return { 
      langs: [{name : 'fr', fullname: 'Français', flag: 'fr'},
              {name : 'en', fullname: 'English', flag: 'gb'}, 
              {name : 'de', fullname: 'Deutsch', flag: 'de'},
              {name : 'it', fullname: 'Italiano', flag: 'it'},
              {name : 'es', fullname: 'Español', flag: 'es'}
            ],
    }
  }
}
</script>