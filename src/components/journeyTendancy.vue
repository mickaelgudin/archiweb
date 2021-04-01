<template>
    <div id="recherche" v-if="reponse" style="margin-top:2%; margin-left:2%; margin-right:2%;">
        <v-row justify="center">
            <v-col cols="12" sm="12" md="10" lg="6" xl="6" >
                <h1 style="margin-bottom: 2%">Tendances des prix sur le trajet sélectionné</h1>
                <v-card style="border: 2px solid #60378c; margin-bottom:10%">
                    <v-list-item-group color="#60378c">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-icon style="margin-bottom:5%">
                                <v-icon class="iconify" :data-icon="icon" style="color:#60378c; height:70px"></v-icon>
                                </v-list-item-icon>
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
//import axios from 'axios'
import toast from '../components/toast.vue'
  export default { 
    components: { toast },
    data: () => ({
      selectedGareDepart: '',
      selectedGareArrivee : '',
      icon : 'mdi-arrow-right' //by default stable
    }),
    methods: {
        /**
        * get tendancy from api
        * @param  {Number} idStationDepart element of date(month or day)
        * @param  {Number} idStationArrival element of date(month or day)
        * @return {String}      formatted element of date
        */
        getTendancy(idStationDepart, idStationArrival) {
            
        } 
      
    }
  }
</script>