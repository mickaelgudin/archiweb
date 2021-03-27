<template>
  <div id="main">
    <!--<div id="map"></div>
    <h1 style="margin-top: 20px;">Stations sélectionnées</h1>
    <l-map ref="myMap"> </l-map>
    <l-tile-layer ></l-tile-layer>
    <l-marker ></l-marker>
    <div id="results"></div>-->
    <div class="center">
    <v-col cols="12" sm="12" md="10" lg="10" xl="10" justify="center">
    <v-row >
      <v-col cols="2" sm="2" md="2" lg="2" xl="2" >
      <v-avatar
          color="#60378c"
          width="100"
          height="100"
          style="border: 2px solid white; border-radius: 50%; margin-left:2%; margin-top:4%; margin-bottom: 4%"
      >
        <v-icon class="iconify" data-icon="mdi:train" style="color:white; height:70px"></v-icon>
      </v-avatar>

      </v-col>
      <v-col cols="9" sm="9" md="9" lg="9" xl="9" justify="center" align="center" >
      <h1 style="margin-top: 2%; margin-bottom:3%; color:white; font-size: 50px;" >RAIL WARS Trains</h1>
      </v-col>
    </v-row>
    <l-map id="map" ref="myMap" @click="onClickMarqueur" :zoom="zoom" :center="center" style="border: 5px solid white">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="marker">
      </l-marker>
    </l-map>
    <div id="results"></div>
    </v-col>
    </div>

    <div style="margin-left:3%; margin-right:3%; margin-top:6%; margin-bottom:10%;">
    <v-card>
      <div style="margin-left:3%; margin-right:3%;">
      <v-row justify="center">
      <v-col cols="6" sm="6" md="6" lg="4" xl="4">
        <v-row justify="center" >
          <v-col cols="12" sm="12" md="7" lg="7" xl="7">
            <v-card-title  style="margin-top:9%;margin-left: 10%; margin-right: 3%; margin-bottom:3%; font-size: 25px; color:#60378c">Gare de Départ</v-card-title>
          </v-col>
        </v-row>

        
      <v-select
          :items="allStations"
          item-text="name"
          item-value="trainStationId"
          label="Sélectionnez la Gare de Départ"
          v-model="idStationDepart"
          solo
      ></v-select>

      </v-col>

      <v-col cols="6" sm="6" md="6" lg="4" xl="4">
        <v-row justify="center" >
          <v-col cols="12" sm="12" md="7" lg="7" xl="7">
            <v-card-title  style="margin-top:9%;margin-left: 10%; margin-right: 3%; margin-bottom:3%; font-size: 25px; color:#60378c">Gare d'Arrivée</v-card-title>
          </v-col>
        </v-row>

      <v-select
          :items= "allStations"
          item-text="name"
          item-value="trainStationId"
          label="Sélectionnez la Gare d'Arrivée"
          solo
          v-model="idStationArrival"
          color="#60378c"
      ></v-select>
        </v-col>

    </v-row>
      </div>

        <v-row justify="center">
          <v-col cols="6" sm="6" md="4" lg="4" xl="4" style="margin-right:10%">
          <v-card
              tile
              style="margin-top: 3%"
          >
            <v-list rounded>
              <v-subheader style="font-size: 20px">Sélectionnez l'heure de :</v-subheader>
              <v-list-item-group
                  v-model="selectedItem"
                  color="#60378c"
              >
              
                <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                >
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text" style="font-size: 18px"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
          </v-col>

          <v-col cols="6" sm="6" md="4" lg="3" xl="3">
              <v-date-picker v-model="selectedDate"></v-date-picker>
          </v-col>

          <v-col cols="6" sm="6" md="4" lg="3" xl="3">
            <v-time-picker
                v-model="timeStep"
                :allowed-minutes="allowedStep"
                class="mt-4"
                format="24hr"
                color="#60378c"
                scrollable
            ></v-time-picker>
          </v-col>
        </v-row>

      <v-row justify="center" >



          <v-btn
          rounded
          color="#60378c"
          dark
          style="height:50px;width:50%; margin-bottom:3%; margin-top: 2%; text-decoration: none;"
          @click="handleSearchJourneys" :href='"#recherche"'
      >

        <div style="color:white; font-size:18px;">Rechercher</div>

        </v-btn>


      </v-row>

      <!-- journeys results --> 
      <journeys-results ref="journeys"></journeys-results>

    </v-card>
    </div>
  </div>
</template>

<script>
//import L from 'leaflet';
import L from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import axios from 'axios';
import journeysResults from '../components/journeysResults.vue';
//import Map from "@/components/Map";

export default {
  components: { journeysResults },
  name: "accueil",
  component:{
    LMap,
    LTileLayer,
    LMarker
  },

  mounted () {
    this.isMounted = true;
    axios
        .get('https://projet-web-trains.herokuapp.com/train-stations')
        .then(response => (this.recupData(response.data)))
  },

  data () {
    return{
      
      center: L.latLng(48.8588377,2.2770202),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(48.8588377,2.2770202),
      zoom: 9,

      timeStep: this.getNow(),

      allStations:[],

      selectedItem: 1,
      items: [
        { text: 'Départ', icon: 'mdi-clock' },
        { text: 'Arrivée', icon: 'mdi-clock-time-eight' }
      ],
      reponse:false,
      isMounted : false,
      idStationDepart: Number,
      idStationArrival: Number,
      selectedDate : ''
    }
  },
  methods: {

    redirect(to){
      this.$router.push(to)
    },
    handleSearchJourneys() {
      //trigger function of journeysResults component to retrieve data
      this.$refs.journeys.getJourneys(this.idStationDepart, this.idStationArrival, this.timeStep, this.selectedItem, this.selectedDate);
      this.hasSearch = true;
    },

    allowedStep: m => m % 10 === 0,
    getNow(){
      let today = new Date();

      return today.getHours()+":"+today.getMinutes();
    },

    recupData(tbObjet){
      this.allStations = tbObjet;

      let tbName=[];
      for(let i in tbObjet){
        tbName.push(tbObjet[i].name);
      }
      return tbName;
    },

    clearMap(){
      for(let i in this.map._layers){
        if(this.map._layers[i]._path != undefined)
        {
          try{
            this.map.removeLayer(this.map._layers[i]);
          }
          catch(e){
            console.log("problem with " + e + this.map._layers[i]);
          }
        }
      }
    },


    onClickMarqueur(name) {

      //gare deja selectionnee
      if(this.selectedGares.includes(name)) {
        const index = this.selectedGares.indexOf(name);
        if (index > -1) {
          this.selectedGares.splice(index, 1);
        }
        this.clearMap();
      } else {
        if(this.selectedGares.length == 2) {
          this.selectedGares.pop();
          this.clearMap();
        }
        this.selectedGares.push(name);
      }

      let results = document.querySelector('#results');
      results.innerHTML = this.selectedGares;

      if(this.selectedGares.includes('paris montparnasse') && this.selectedGares.includes('bordeaux st jean') ) {
        let latlngs = Array();
        latlngs.push([48.8402, 2.3193]);
        latlngs.push([44.8260022,-0.558805]);
        L.polyline(latlngs, {color: 'red'}).addTo(this.map);
      }
      if(this.selectedGares.includes('paris montparnasse') && this.selectedGares.includes('strasbourg') ) {
        let latlngs = Array();
        latlngs.push([48.8402, 2.3193]);
        latlngs.push([48.5850571,7.7323068]);
        L.polyline(latlngs, {color: 'red'}).addTo(this.map);
      }

      if(this.selectedGares.includes('strasbourg') && this.selectedGares.includes('bordeaux st jean') ) {
        let latlngs = Array();
        latlngs.push([48.5850571,7.7323068]);
        latlngs.push([44.8260022,-0.558805]);
        L.polyline(latlngs, {color: 'red'}).addTo(this.map);
      }

    }



  },

}
</script>

<style scoped>

#main{
  background-color:#60378c;/*#8537b3 /*#576166; #88cff2;/*rgba(37, 110, 174, 0.9);*/
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

<style>

</style>

