<template>
    <div id="recherche" style="margin-top:2%; margin-left:2%; margin-right:2%;">
        <v-row justify="center">
            <v-col cols="12" sm="12" md="10" lg="6" xl="6" >
                <h1 style="margin-bottom: 2%">Tendances des prix sur le trajet sélectionné</h1>
                <v-card style="border: 2px solid #60378c; margin-bottom:10%">
                    <v-list-item-group color="#60378c">
                        <v-list-item>
                            <h2>Sur tous les trajets existants entre les gares sélectionnés</h2>
                            <v-list-item-content>
                                <v-list-item-icon style="margin-left: 10%;">
                                    <v-icon :class="'iconify '+classeCss" :data-icon="icon" x-large></v-icon>
                                </v-list-item-icon>
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
      icon : 'mdi-arrow-right', //by default stable
      classeCss : 'stable' //see css classes below
    }),
    methods: {
        /**
        * get tendancy from api
        * @param  {Number} idStationDepart id station de départ
        * @param  {Number} idStationArrival element of date(month or day)
        * 
        */
        getTendancy(idStationDepart, idStationArrival) {
            console.log(idStationDepart+idStationArrival);

            if(idStationDepart&&idStationArrival){
                axios
                .get('https://projet-web-trains.herokuapp.com/journeys/tendancy?id-from='+idStationDepart+'&id-to=id'+idStationArrival)
                .then(response => {
                    if (response.data == "up"){
                        this.classeCss='increasing'
                        this.icon='mdi-top-right'
                    }
                    else if (response.data == "down"){
                        this.classeCss='decreasing'
                        this.icon='mdi-bottom-right'
                    }
                     else if (response.data == "stable"){
                        this.classeCss='stable'
                        this.icon='mdi-arrow-right'
                    }
                })
                    
            }
        } 


      
    }
  }
</script>

<style>
    .decreasing {
        color: red !important;
    }
    .increasing {
        color: green !important;
    }
    .stable {
        color: blue !important;
    }
</style>