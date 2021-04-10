<template>
    <div id="recherche" v-if="hasSearch" > 
      <toast ref="alertj"></toast>

      <div v-if="!showToast && journeys.length > 0">
        <h2 style="padding: 1px; margin-bottom: 2%">{{$t('journeysResulsHeader')}}</h2>
        <v-card style="border: 2px solid #60378c; padding:2%">
          

          <v-list-item-group color="#60378c">
            <h4 style="margin-bottom: 2%;">{{journeys[0].departureStation.name}}
              <v-icon class="iconify" data-icon="mdi-arrow-right" medium></v-icon>
                {{journeys[0].arrivalStation.name}}
            </h4>
            <v-list-item class="listStyle" v-for="(journey, i) in journeys" :key="i" >
            
              <v-list-item-content style="font-weight: bold">
                  {{ getHourFromDatetime(journey.departureDate) }} 
                  -
                  {{ getHourFromDatetime(journey.arrivalDate) }}
              </v-list-item-content>
              <v-list-item-content style="margin-right: 6%;">
                <v-avatar color="#60378c" width="20" height="40"
                style="border: 2px solid white; border-radius: 10%;"
                >
                  <v-icon class="iconify" data-icon="mdi:train" style="color:white; height:80px"></v-icon>
                  <strong style="color:white;">{{ $t('journeysResultsLine') }} {{journey.line.name}}</strong>
                </v-avatar>    
              </v-list-item-content>
              <v-list-item-content>
                <strong>{{journey.farePrice}} €</strong>
              </v-list-item-content>
            </v-list-item>

          </v-list-item-group>
        </v-card>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import toast from '../components/toast.vue'
  export default { 
    components: { toast },
    props: {
      hasSearch : {type:Boolean, default: true}
    },
    data: () => ({
      from: -1,
      to: -1,
      journeys: [],
      model: 1,
      showToast: false
    }),
    
    methods: {
        /**
        * add 0 at the beginning for month or day
        * @param  {Number} idStationFrom id of selected departure station
        * @param  {Number} idStationTo id of selected arrival station
        * @param  {String} timeStep selected time from form
        * @param  {Number} fromTimeType index of filtering criteria for selected hour, (0 : departure at, 1: arrival at )
        * @param  {Number} selectedDate date selected from datepicker
        */
        getJourneys(idStationFrom, idStationTo, timeStep, fromTimeType, selectedDate){
            //time step format is : hour:minutes -> here we convert it to number for comparaison with available journeys
            let fromTime = Number(timeStep.replaceAll(':', ''));
            this.showToast = false;
            if(idStationFrom && idStationTo) {
                axios
                .get('https://projet-web-trains.herokuapp.com/journeys/'+this.$i18n.locale+'?id-from='+idStationFrom+'&id-to='+idStationTo)
                .then(response => (this.filterJourneys(response.data, fromTime, fromTimeType, selectedDate) ) )
                .catch(err => {
                  if (err.response.status === 400) {
                    this.$refs.alertj.displayToast('error', err.response.data.message, -1);
                  }
                });
            }
        },

      /**
       * Filter journeys returned by api, to display  only those matching criterias of the form
       * @param  {Array} journeysReceived journeys returned by api
       * @param  {Number} fromTime selected time from search form, ex : 800 (for 8:00)
       * @param  {Number} fromTimeType index of filtering criteria for selected hour, (0 : departure at, 1: arrival at )
       * @param  {Number} selectedDate date selected from datepicker
       */
        filterJourneys(journeysReceived, fromTime, fromTimeType, selectedDate) {
          let journeysFiltered = [];
          //case where api returned empty journeys
          if(!journeysReceived || journeysReceived.length == 0) {
            this.$refs.alertj.displayToast('error', this.$t('journeysResultsEmpty'), -1);
            return;
          }

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

          //case where the filtered journeys are empty
          if(!journeysFiltered || journeysFiltered.length == 0) {
            this.$refs.alertj.displayToast('error', this.$t('journeysResultsEmpty'), -1);
            return;
          }

          this.journeys = journeysFiltered;
          this.doneCallingApi = true;
        },
        
        /**
        * add 0 at the beginning for month or day
        * @param  {Number} elementOfDate element of date(month or day)
        * @return {String}      formatted element of date
        */
        formatElementOfDate(elementOfDate) {
          return (elementOfDate < 10) ? '0'+elementOfDate : elementOfDate; 
        },

        
        /**
        * get the hour part of the given datetime
        * @param  {String} date date from api (with date and time)
        * @return {String}      hour from date
        */
        getHourFromDatetime: function (date) {
          return date.split('T')[1].slice(0, -3);
        } 
      
    }
  }
</script>

<style>
.listStyle {
  border-bottom: 2px solid black;
  border-top: 2px solid black;
}
</style>