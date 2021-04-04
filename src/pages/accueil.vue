<template>
  <div id="main">
    <div class="center">
      <v-col cols="12" sm="12" md="10" lg="10" xl="10" justify="center">
        <v-row >
          <v-col cols="2" sm="2" md="2" lg="2" xl="2" >
            <v-avatar color="#60378c" width="100" height="100"
                style="border: 2px solid white; border-radius: 50%; margin-left:2%; margin-top:4%; margin-bottom: 4%"
            >
              <v-icon class="iconify" data-icon="mdi:train" style="color:white; height:70px"></v-icon>
            </v-avatar>

          </v-col>
          <v-col cols="9" sm="9" md="9" lg="9" xl="9" justify="center" align="center" >
            <h1 style="margin-top: 2%; margin-bottom:3%; color:white; font-size: 50px;" >RAIL WARS Trains</h1>
          </v-col>
        </v-row>
        <l-map id="map" ref="myMap" :zoom="zoom" :center="center" style="border: 5px solid white">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

          <div v-if="hasSearch">
          <l-marker v-for="(item, index) in tabInfosGaresLatLng" ref="marker" :key="index" :lat-lng="item.position"
              :visible=true :draggable=true  @add="openPopup">
            <l-popup ref="popup" :options="{ autoClose: false, closeOnClick: false }">
              {{item.name}}
            </l-popup>
          </l-marker>
            <l-polyline :lat-lngs="displayPolyline()" :color="'blue'"></l-polyline>
          </div>

          <div v-if="!hasSearch || !flagReachableStations">
          <l-marker v-for="(item, index) in copyTabInfosGaresLatLng" @dblclick="displayReachableStations(item)" ref="marker" :key="index" :lat-lng="item.position"
                    :visible=true :draggable=true  @add="openPopup">
            <l-popup ref="popup" :options="{ autoClose: false, closeOnClick: false }">
              {{item.name}}

              <div v-if="item.price!=null">

                Prix : {{item.price}} €
              </div>
            </l-popup>
          </l-marker>
            <l-polyline :lat-lngs="displayPolylineFromClicked()" :color="'blue'"></l-polyline>
          </div>

        </l-map>
        <div id="results"></div>
      </v-col>
    </div>

    <div style="margin-left:3%; margin-right:3%; margin-top:2%; margin-bottom:2%; padding-left:4px; padding-right:4px;">
      <v-card>
        <div style="margin-left:3%; margin-right:3%;">
          <v-row v-if="hasSearch == false" justify="center">
            <v-col cols="6" sm="6" md="6" lg="4" xl="4">
              <label>{{ $t('selectStationDeparture') }}</label>
              <v-select :items="allStations" item-text="name" item-value="trainStationId" v-model="idStationDepart" solo outlined>
              </v-select>
            </v-col>

            <v-col cols="6" sm="6" md="6" lg="4" xl="4">
              <label>{{ $t('selectStationArrival') }}</label>
              <v-select :items="allStations" item-text="name" item-value="trainStationId" v-model="idStationArrival" solo outlined>
              </v-select>
            </v-col>
             
          </v-row>
        </div>

        <v-row v-if="hasSearch == false" justify="center">
          <v-col cols="6" sm="6" md="4" lg="3" xl="3">
            <label>{{ $t('selectDate') }}</label>
            <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
              transition="scale-transition" offset-y min-width="auto" >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="date" :label="selectedDate" prepend-icon="mdi-calendar" readonly v-bind="attrs"
                  v-on="on" >
                </v-text-field>
              </template>
              <v-date-picker v-model="selectedDate" @input="menu2 = false"></v-date-picker>
            </v-menu>
          </v-col>
          
          <v-col cols="6" sm="6" md="4" lg="3" xl="3">
            <v-radio-group v-model="selectedItem" row>
              <v-radio v-for="hour in $t('hoursSelect')" :key="hour.text" :label="hour.text" :value="hour.text"></v-radio>
            </v-radio-group>
           <label>{{ $t('selectHourLabel') }}</label>
           <v-select :items="hours"
                  v-model="timeStep" solo outlined>
              </v-select>
          </v-col>
          
        </v-row>

        <v-row v-if="hasSearch == false" justify="center">
          <v-col cols="6" sm="6" md="4" lg="3" xl="3">
            <v-btn rounded color="#60378c" dark @click="handleSearchJourneys" block :href='"#recherche"' 
                    style="height:50px;width:50%; margin-bottom:3%; margin-top: 2%; text-decoration: none;" >
                
                <div style="color:white; font-size:18px;">{{ $t('searchLabel') }}</div>
            </v-btn>
          </v-col>
        </v-row>

        <v-row justify="center" style="padding-top: 2rem; padding-bottom: 2rem">
            <v-btn v-if="hasSearch" class="ma-2" color="red darken-2" dark @click="hasSearch = false;">
              <v-icon dark left>
                mdi-arrow-left
              </v-icon>{{ $t('backButton') }}
            </v-btn>

            <!-- JOURNEY RESULTS WHEN BUTTON SEARCH IS CLICKED AND API RETURNED JOURNEYS -->
            <journeys-results style="width: 40%; margin-right: 20px;" ref="journeys" :hasSearch="hasSearch"></journeys-results>
            <journeyTendancy style="width: 40%;" v-if="hasSearch"></journeyTendancy>
          </v-row>

      </v-card>
      
    </div>
  </div>
</template>

<script>

import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LPolyline, LPopup } from 'vue2-leaflet';
import axios from 'axios';
import journeysResults from '../components/journeysResults.vue';
import journeyTendancy from '../components/journeyTendancy.vue';
//import Map from "@/components/Map";

export default {
  name: "accueil",
  components:{
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LPopup,
    journeyTendancy,
    journeysResults
  },

  mounted () {
    axios
        .get('https://projet-web-trains.herokuapp.com/train-stations')
        .then(response => (this.recupData(response.data)))
  },

  data () {
    return{

      center: L.latLng(48.8594706,2.2321041),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      zoom: 11.2,

      timeStep: this.getNow(),

      hours: [ "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
      "19:00", "20:00", "21:00", "22:00", "23:00"],
      allStations:[],

      selectedItem: 1,
      idStationDepart: Number,
      idStationArrival: Number,

      tabInfosGaresLatLng: [],
      selectedDate : this.getToday(),

      copyTabInfosGaresLatLng : [],
      hasSearch : false,
      idStationClicked : Number,
      flagReachableStations : true,
      menu2 : false

    }
  },
  methods: {

    redirect(to){
      this.$router.push(to)
    },
    handleSearchJourneys() {
      this.displayPopUpStation();
      console.log('selectedDate ', this.selectedDate);
      //trigger function of journeysResults component to retrieve data
      this.$refs.journeys.getJourneys(this.idStationDepart, this.idStationArrival, this.timeStep, this.selectedItem, this.selectedDate);
      
      this.hasSearch = true;
      this.flagReachableStations = true;
    },

    allowedStep: m => m % 10 === 0,
    getNow(){
      let today = new Date();

      return today.getHours()+":"+today.getMinutes();
    },

    getToday() {
      const today = new Date()
      return new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0];
    },

    recupData(tbObjet){
      this.allStations = tbObjet;

      let tbName=[];
      for(let i in tbObjet){
        tbName.push(tbObjet[i].name);
        this.tabInfosGaresLatLng.push({"id": tbObjet[i].trainStationId,"name":tbObjet[i].name,"position":[tbObjet[i].latitude,tbObjet[i].longitude], "price":null, draggable: true,
          visible: true});
      }
      this.copyTabInfosGaresLatLng=this.tabInfosGaresLatLng;
      return tbName;
    },

    displayPopUpStation(){
      if(this.idStationDepart!=null && this.idStationArrival!=null){
        this.tabInfosGaresLatLng=[]
        //console.log(this.copyTabInfosGaresLatLng[1])
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

    openPopup: function (event) {
      this.$nextTick(() => {
        event.target.openPopup();
      })
    },

    displayPolyline(){
      let tmpTabLatLng=[];
      this.tabInfosGaresLatLng.forEach(element => tmpTabLatLng.push(element.position));
      return tmpTabLatLng;
    },

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

    displayReachableStations : function(item) {
      if(!this.hasSearch && this.flagReachableStations){

        axios
            .get('https://projet-web-trains.herokuapp.com/journeys/average?id-from='+item.id)
            .then(response => this.loadReachableStations(response.data , item))
      } else {
        this.flagReachableStations = true;
      }
    },

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

#main{
  background-color: #60378c;
}


.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.border{
  border: 5px solid white;
}

#map {
  height: 500px;
  width: 100%;
}



</style>


