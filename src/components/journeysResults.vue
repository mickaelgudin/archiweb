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
        getJourneys(idStationFrom, idStationTo, timeStep){
            //time step format is : hour:minutes -> here we convert it to number for comparaison with available journeys
            let fromTime = Number(timeStep.replaceAll(':', ''));

            if(idStationFrom && idStationTo) {
                axios
                .get('https://projet-web-trains.herokuapp.com/journeys?id-from='+idStationFrom+'&id-to='+idStationTo)
                .then(response => (this.filterJourneys(response.data, fromTime) ) )
            }
        },

        filterJourneys(journeysReceived, fromTime) {
          console.log('fromtime : ', fromTime);
          console.log('journeysReceived : ', journeysReceived);
          let journeysFiltered = [];
          journeysReceived.forEach(function(journey){
            let dateDepart =  journey.departureDate;
            var split = dateDepart.split('T')[1];
            
            var dateCurrentJourneyFormatted = dateDepart.split('T')[0];
            let today = new Date();
            let year= today.getFullYear();
            let month = (today.getMonth() < 10) ? '0'+(today.getMonth()+1) : (today.getMonth()+1); 
            let day = (today.getDate() < 10) ? '0'+today.getDate() : today.getDate() ;
            let todayFormatted = year+'-'+month+'-'+day;

            console.log('todayFormatted ', todayFormatted);
            console.log('dateCurrentJourneyFormatted ', dateCurrentJourneyFormatted);
            if(todayFormatted === dateCurrentJourneyFormatted) {
              split = split.substring(0, split.length - 3);
              let timeOfDate = Number(split.replaceAll(':', ''));

              console.log('timeOfDate : ', timeOfDate);
              if(timeOfDate > fromTime) {
                journeysFiltered.push(journey); 
              }
            }

          });


          console.log('journeysReceived ', journeysFiltered);
          this.journeys = journeysFiltered;

        }
    }
  }
</script>