<template>
    <div id="recherche" v-if="journeys.length > 0" style="margin-top:2%; margin-left:2%; margin-right:2%;">
      <v-row justify="center">
        <v-col cols="12" sm="12" md="10" lg="6" xl="6" >

          <h1 style="margin-bottom: 2%">Trajets en lien avec votre recherche</h1>
          <v-card style="border: 2px solid #60378c; margin-bottom:10%">
          <v-list-item-group color="#60378c">
            <v-list-item v-for="(journey, i) in journeys" :key="i">
              <v-list-item-icon style="margin-bottom:10%">
                <v-icon class="iconify" data-icon="mdi:arrow-right" style="color:#60378c; height:70px"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <h5 style="font-size:15px">Trajet de : {{journey.departureStation.name}} à {{journey.arrivalStation.name}}
                  <br>
                  <br>
                Prix total : {{journey.farePrice}}
                <br>
                <br>
                Ligne : {{journey.line.name}}
                </h5>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          </v-card>
        </v-col>
      </v-row>
    </div>
</template>

<script>
import axios from 'axios'
  export default { 
    data: () => ({
      from: -1,
      to: -1,
      journeys: [],
      model: 1,
    }),
    methods: {
        getJourneys(idStationFrom, idStationTo){

            if(idStationFrom && idStationTo) {
                axios
                .get('https://projet-web-trains.herokuapp.com/journeys?id-from='+idStationFrom+'&id-to='+idStationTo)
                .then(response => (this.journeys = response.data))
            }
        }
    }
  }
</script>