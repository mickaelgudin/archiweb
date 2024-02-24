<template>
  <div id="main">
    <v-form ref="form" style="margin-bottom:2%">
      <v-card style="background-color: white; margin-top: 2%;" >
        <v-textarea
          filled
          name="input-7-4"
          label="Insert JSON"
          v-model="jsonValue"
          color="#60378c"
        ></v-textarea>


        <v-row justify="center" style="background-color: white; margin-left: 5%; margin-right: 5%">
          <v-btn color="#ffe6cc" justify="center" class="mt-4" @click="callApi" style="color:#60378c; margin-top:2%; margin-bottom:3%;">{{$t('createAllStationsButton')}}</v-btn>
        </v-row>

      </v-card>

    </v-form>

    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "stationsBulk",
  data () {
    return{
      typeForm : 'create',
      jsonValue: '[{ "name": "test5", "longitude": 2.0, "latitude": 2.0  }, { "name": "test6", "longitude": 4.0, "latitude": 4.0 }]'
    }
  },
  methods: {
    /**
     * call api with given json
     */
    callApi: function() {
      axios.post(
                'https://spring-boot-h2-crud.onrender.com/train-stations/all/'+this.$i18n.locale, 
                this.jsonValue,
                {
                    headers: { 
                        'Content-Type' : 'application/json' 
                    }
                }
        ).then((response) => {
            console.log(response);
             this.$emit('refresh');
        });
    },
  }
}
</script>

<style>


:root{
  --main-purple-color: #60378c;
}
.stationsPageTitle{
  font-size: 25px;
  color:var(--main-purple-color);
}

.v-application .blue--text.text--darken-2 {
  color: var(--main-purple-color) !important;
  caret-color: var(--main-purple-color) !important;
}

#actionMenu{
  padding : 1rem;
  margin: 1rem;
}



</style>