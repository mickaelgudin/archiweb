<template>
  <div class="locale-changer">
    <v-container fluid>
        <v-row align="center">
            <v-col class="d-flex" cols="2" sm="1">
                <v-select :items="langs" v-model="$i18n.locale"></v-select>
            </v-col>
        </v-row>
    </v-container>

  </div>
</template>

<script>
export default {
  name: 'locale-changer',
  data () {
    return { langs: ['fr', 'en'] }
  }
}
</script>