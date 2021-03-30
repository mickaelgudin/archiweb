<template>
    <div id="recherche" v-if="hasSearch" style="margin-top:2%; margin-left:2%; margin-right:2%;">
      <toast ref="toastJourneys"></toast>
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

             <v-list-item v-if="hasSearch && journeys.length == 0"> 
                <v-list-item-content>
                  Aucun trajet trouvé pour votre recherche
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
import toast from '../components/toast.vue'
  export default { 
    components: { toast },
    data: () => ({
      from: -1,
      to: -1,
      journeys: [],
      model: 1,
      hasSearch : false
    }),
    methods: {
        /**
        * add 0 at the beginning for month or day
        * @param  {Number} idStationFrom id of selected departure station
        * @param  {Number} idStationTo id of selected arrival station
        * @param  {String} timeStep selected time from form
        * @param  {Number} fromTimeType index of filtering criteria for selected hour, (0 : departure at, 1: arrival at )
        */
        getJourneys(idStationFrom, idStationTo, timeStep, fromTimeType, selectedDate){
            //time step format is : hour:minutes -> here we convert it to number for comparaison with available journeys
            let fromTime = Number(timeStep.replaceAll(':', ''));
            this.hasSearch = true;

            if(idStationFrom && idStationTo) {
                axios
                .get('https://projet-web-trains.herokuapp.com/journeys?id-from='+idStationFrom+'&id-to='+idStationTo)
                .then(response => (this.filterJourneys(response.data, fromTime, fromTimeType, selectedDate) ) )
                .catch(err => {
                    if (err.response.status === 400) {
                        this.$refs.toastJourneys.displayToast('error', err.response.data.message, 10);
                    }
                });
            }
        },

      /**
       * Filter journeys returned by api, to display  only those matching criterias of the form
       * @param  {Array} journeysReceived journeys returned by api
       * @param  {Number} fromTime selected time from search form, ex : 800 (for 8:00)
       * @param  {Number} fromTimeType index of filtering criteria for selected hour, (0 : departure at, 1: arrival at )
       */
        filterJourneys(journeysReceived, fromTime, fromTimeType, selectedDate) {
          let journeysFiltered = [];

          journeysReceived.forEach((journey) => {
            const dateToCompareWith = (fromTimeType == 0) ? journey.departureDate : journey.arrivalDate;
            const dateCurrentJourneyFormatted = dateToCompareWith.split('T')[0];
            
            if(selectedDate === dateCurrentJourneyFormatted) {
              //get hour from datime and removing seconds 
              let hourOfJourney = dateToCompareWith.split('T')[1];
              hourOfJourney = hourOfJourney.substring(0, hourOfJourney.length - 3);
              
              //comparing current journey time with selected time from form
              if(Number(hourOfJourney.replaceAll(':', '')) >= fromTime) {
                journeysFiltered.push(journey); 
              }
            }

          });

          this.journeys = journeysFiltered;
        },
        
        /**
        * add 0 at the beginning for month or day
        * @param  {Number} elementOfDate element of date(month or day)
        * @return {String}      formatted element of date
        */
        formatElementOfDate(elementOfDate) {
          return (elementOfDate < 10) ? '0'+elementOfDate : elementOfDate; 
        } 
      
    }
  }
</script>