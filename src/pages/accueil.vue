<template>
  <div id="main">
    <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
            v-if="doneGettingLoadingData == false"
            ></v-progress-circular>  

    <div class="center"  v-else>
      <v-col cols="12" sm="12" md="10" lg="10" xl="10" justify="center">
        <l-map id="map" ref="myMap" :zoom="zoom" :center="center">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

          <div v-if="hasSearch">
            <l-marker v-for="(item, index) in tabInfosGaresLatLng" ref="marker" :key="index" :lat-lng="item.position"
                      :visible=true :draggable=false  @add="openPopup">
              <l-popup ref="popup" :options="{ autoClose: false, closeOnClick: false }">
                {{item.name}}
              </l-popup>
            </l-marker>
            <l-polyline :lat-lngs="displayPolyline()" :color="'blue'"></l-polyline>
          </div>

          <div v-if="!hasSearch || !flagReachableStations">
            <l-marker v-for="(item, index) in copyTabInfosGaresLatLng" @dblclick="displayReachableStations(item)" ref="marker" :key="index" :lat-lng="item.position"
                      :visible=true :draggable=false  @add="openPopup">
              <l-popup ref="popup" :options="{ autoClose: false, closeOnClick: false }">
                {{item.name}}
                <v-divider></v-divider>
                <strong v-if="item.price!=null">

                  {{$t('priceLabel')}} : {{item.price}} €
                </strong>
              </l-popup>
            </l-marker>
            <l-polyline :lat-lngs="displayPolylineFromClicked()" :color="'blue'"></l-polyline>
          </div>

        </l-map>
        <div id="results"></div>
      </v-col>
    </div>

    <div id="divCardInput">
      <v-card>
        <div>
          <v-toolbar style="margin-top:2%;" color="#e8e8e8" dark flat>
              <v-toolbar-title style="color:#60378c; text-align: center">{{ (hasSearch) ? $t("searchResultsTitle") : $t("searchFormTitle") }} </v-toolbar-title>
          </v-toolbar>
          <div class="marginDiv">
            <v-row v-if="hasSearch == false" justify="center">
              
              <v-col cols="12" sm="6" md="6" lg="4" xl="4">
                <v-row justify="center" >
                  <v-col cols="12" sm="12" md="7" lg="7" xl="7">
                    <v-card-title  class="inputTitle">{{ $t('selectStationDeparture') }}</v-card-title>
                  </v-col>
                </v-row>
                <v-select :items="allStations" item-text="name" item-value="trainStationId" v-model="idStationDepart" color="#60378c" solo outlined>
                </v-select>
              </v-col>

              <v-col cols="12" sm="6" md="6" lg="4" xl="4">
                <v-row justify="center" >
                  <v-col cols="12" sm="12" md="7" lg="7" xl="7">
                    <v-card-title  class="inputTitle">{{ $t('selectStationArrival') }}</v-card-title>
                  </v-col>
                </v-row>
                <v-select :items="allStations" item-text="name" item-value="trainStationId" v-model="idStationArrival" color="#60378c" solo outlined>
                </v-select>
              </v-col>

            </v-row>
          </div>
        </div>

        <div class="marginDiv">
          <v-row v-if="hasSearch == false" justify="center">
            <v-col cols="6" sm="6" md="4" lg="3" xl="3">
              <label>{{ $t('selectDate') }}</label>
              <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                      transition="scale-transition" offset-y min-width="auto" >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="selectedDate" :label="selectedDate" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                                v-on="on" color="#60378c" >
                  </v-text-field>
                </template>
                <v-date-picker v-model="selectedDate" color="#60378c" @input="menu2 = false"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="6" sm="6" md="4" lg="3" xl="3">
              <v-radio-group v-model="selectedItem" row>
                <v-radio v-for="hour in $t('hoursSelect')" :key="hour.text" :label="hour.text" :value="hour.text" color="#60378c"></v-radio>
              </v-radio-group>
              <label>{{ $t('selectHourLabel') }}</label>
              <v-select :items="hours"
                        color="#60378c"
                        v-model="timeStep" solo outlined>
              </v-select>
            </v-col>

          </v-row>
        </div>


        <toast ref="toastSearch"></toast>
        <v-row v-if="hasSearch == false" justify="center">
          <v-col cols="6" sm="6" md="4" lg="3" xl="3">
            <v-btn rounded color="#60378c" dark @click="handleSearchJourneys" block :href='"#recherche"'
                   id="btnSearchJourneys" >

              <div style="color:white; font-size:18px;">{{ $t('searchLabel') }}</div>
            </v-btn>
          </v-col>
        </v-row>

        <div class="marginDiv">
          <v-row style="padding-top: 1rem;">
            <v-btn v-if="hasSearch" class="ma-2" color="#60378c" dark @click="hasSearch = false; ">
                <v-icon dark left>
                  mdi-arrow-left
                </v-icon>{{ $t('backButton') }}
              </v-btn>
            <v-btn v-if="hasSearch" class="ma-2" color="#60378c" dark @click="scrollUp">
              <v-icon dark left>
                mdi-arrow-up
              </v-icon>
            </v-btn>
          </v-row>
          <v-row justify=center style="padding-top: 2rem; padding-bottom: 2rem">
            <!-- JOURNEY RESULTS WHEN BUTTON SEARCH IS CLICKED AND API RETURNED JOURNEYS -->
            <journeys-results style="width: 40%; margin-right: 2%;" ref="journeys" :hasSearch="hasSearch"></journeys-results>
            <journey-tendancy style="width: 50%;" ref=tendancy :hasSearch="hasSearch"></journey-tendancy>
          </v-row>

        </div>

      </v-card>

    </div>
  </div>
</template>

<script>

import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LPolyline, LPopup } from 'vue2-leaflet';
import axios from 'axios';
import toast from '../components/toast.vue';
import journeysResults from '../components/journeysResults.vue';
import journeyTendancy from '../components/journeyTendancy.vue';

export default {
  name: "accueil",
  components:{
    toast,
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LPopup,
    journeyTendancy,
    journeysResults
  },

  mounted () {
    this.$nextTick(()=> this.doneGettingLoadingData = false)

    axios
        .get('https://spring-boot-h2-crud.onrender.com/train-stations')
        .then(response => (this.recupData(response.data)))
  },

  created () {
    this.selectedItem = this.$t('hoursSelect')[0].text;
  },

  data () {
    return{

      center: L.latLng(48.8594706,2.2321041),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      zoom: 11.2,

      timeStep: this.getNow(),

      hours: [ "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
              "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", 
              "22:00", "22:30", "23:00", "23:30"
            ],
      allStations:[],

      selectedItem: 1,
      idStationDepart: 0,
      idStationArrival: 0,

      tabInfosGaresLatLng: [],
      selectedDate : this.getToday(),

      copyTabInfosGaresLatLng : [],
      hasSearch : false,
      idStationClicked : Number,
      flagReachableStations : true,
      menu2 : false,
      doneGettingLoadingData: false
    }
  },
  methods: {

    /**
     * changes, redirects to the page
     * @param to :  name of the page to redirect
     */
    redirect(to){
      this.$router.push(to)
    },

    /**
     * scrolls the window until the coordinate (0,0)
     */
    scrollUp() {
      window.scrollTo(0,0);
    },

    /**
     * calls the method displayPopUpStation() to display the departure and arrival stations on the map
     * and displays the journeys and tendency results about the departure and arrival stations and date selected in the inputs
     */
    handleSearchJourneys() {
      console.log('this.checkFormSearch() ', this.checkFormSearch());
      if(this.checkFormSearch() ) {
        this.displayPopUpStation();
        //trigger function of journeysResults component to retrieve data
        this.$refs.journeys.getJourneys(this.idStationDepart, this.idStationArrival, this.timeStep, this.selectedItem, this.selectedDate);
        this.$refs.tendancy.getTendancy(this.idStationDepart, this.idStationArrival);

        this.hasSearch = true;
        this.flagReachableStations = true;
      }
    },

    /**
     * check fields selected stations
     * @returns boolean which describes if the api can be called
     */
    checkFormSearch() {
      let errorMessage = this.$t('errorFormStation');
      if(!this.idStationDepart) {
        errorMessage += this.$t('selectStationDeparture');
      } 
      if(!this.idStationArrival) {
        if(errorMessage.includes(this.$t('selectStationDeparture')) ) {
            errorMessage += ', ';
        }
        errorMessage += this.$t('selectStationArrival');
      }

      if(errorMessage !== this.$t('errorFormStation')) {
        this.$refs.toastSearch.displayToast('error', errorMessage, 15);
        return false;
      }
      return true;
    },

    allowedStep: m => m % 10 === 0,
    /**
     * returns the current hour in a String format
     */
    getNow(){
      let today = new Date();
      return today.getHours()+":00";
    },

    /**
     * returns today's date in Date format
     */
    getToday() {
      const today = new Date()
      return new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
    },

    /**
     * uses the api response containing all the train stations information to initialize variables
     * and returns names of all the stations existing
     * @param tbObjet : the api response containing information about any train stations
     * @returns {[]} names of every stations existing
    */
    recupData(tbObjet){
      this.allStations = tbObjet;

      let tbName=[];
      for(let i in tbObjet){
        tbName.push(tbObjet[i].name);
        this.tabInfosGaresLatLng.push({"id": tbObjet[i].trainStationId,"name":tbObjet[i].name,"position":[tbObjet[i].latitude,tbObjet[i].longitude], "price":null, draggable: false,
          visible: true});
      }
      this.copyTabInfosGaresLatLng=this.tabInfosGaresLatLng;
      this.doneGettingLoadingData = true;

      return tbName;
    },

    /**
     * adds the departure and arrival stations selected in the select inputs
     * into an array to display those two stations (markers) and their information (popup) on the map
     *
     */
    displayPopUpStation(){
      if(this.idStationDepart!=null && this.idStationArrival!=null){
        this.tabInfosGaresLatLng=[]
        for(let i in this.copyTabInfosGaresLatLng){
          if(this.copyTabInfosGaresLatLng[i].id==this.idStationDepart || this.copyTabInfosGaresLatLng[i].id==this.idStationArrival){
            this.tabInfosGaresLatLng.push(this.copyTabInfosGaresLatLng[i])
          }
        }
      }
      else{
        this.tabInfosGaresLatLng=this.copyTabInfosGaresLatLng
      }
    },

    /**
     * displays the markers popup on the map
     * @param event any change on the map
     */
    openPopup: function (event) {
      this.$nextTick(() => {
        event.target.openPopup();
      })
    },

    /**
     * returns an array of positions to draw lines between stations on the map
     * @returns {[]} an array of positions (latitude,longitude)
     */
    displayPolyline(){
      let tmpTabLatLng=[];
      this.tabInfosGaresLatLng.forEach(element => tmpTabLatLng.push(element.position));
      return tmpTabLatLng;
    },

    /**
     * returns an array of positions to draw lines between stations on the map
     * and adding to it the departure station position for each loop iteration
     * @returns {[]} an array of positions (latitude,longitude)
     */
    displayPolylineFromClicked(){
      let tmpTabLatLng=[];
      for(let i in this.tabInfosGaresLatLng){
        let subTmpTab=[];
        subTmpTab.push(this.tabInfosGaresLatLng[i].position)
        subTmpTab.push(this.tabInfosGaresLatLng[0].position)
        tmpTabLatLng.push(subTmpTab)
      }
      return tmpTabLatLng;
    },

    /**
     * calling api for a selected station on the map and returns
     * reachable stations from the selected one
     * @param item : a marker,station clicked on the map uses in the api call
     */
    displayReachableStations : function(item) {
      if(!this.hasSearch && this.flagReachableStations){
        axios
            .get('https://spring-boot-h2-crud.onrender.com/journeys/'+this.$i18n.locale+'/'+'average?id-from='+item.id)
            .then(response => this.loadReachableStations(response.data , item))
      } else {
        this.flagReachableStations = true;
      }
    },

    /**
     * add the selected marker,station on the map, plus all the reachable stations from it
     * to the array which will display them on the map
     * @param tabReachableStations : array of reachable stations returns by api to add to display them
     * @param item : selected marker, station on the map used as the origin to get the reachable stations
     * @return {boolean}
     */
    loadReachableStations(tabReachableStations,item){

      let nameReachableStation = []
      nameReachableStation = Object.keys(tabReachableStations);

      this.tabInfosGaresLatLng=[]
      this.tabInfosGaresLatLng.push(item);
      this.copyTabInfosGaresLatLng.forEach(element => element.price=null);

      for(let i in nameReachableStation){
        for(let j in this.copyTabInfosGaresLatLng){
          if(nameReachableStation[i]==this.copyTabInfosGaresLatLng[j].name){
            this.copyTabInfosGaresLatLng[j].price=tabReachableStations[nameReachableStation[i]]
            this.tabInfosGaresLatLng.push(this.copyTabInfosGaresLatLng[j])

          }
        }
      }
      this.flagReachableStations = false;

      return false;
    },

  },
}
</script>

<style scoped>

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.border{
  border: 5px solid white;
}

#main{
  background-color: #60378c;
}

#map {
  height: 500px;
  width: 100%;
  position: sticky !important;
  margin-top:5rem;
  border: 5px solid white;
}

#divCardInput{
  margin: 1% 3% 2%;
  padding-left:4px;
  padding-right:4px;
}

#btnSearchJourneys{
  height:50px;
  width:50%;
  margin-bottom:3%;
  margin-top: 2%;
  text-decoration: none;
}

.marginDiv{
  margin-left:2%;
  margin-right:2%;
}

.inputTitle{
  margin: 4% 3% 3% 10%;
  font-size: 25px;
  color:#60378c;
  word-break: normal;
}

.ma-2{
  height:50px;
}
</style>


