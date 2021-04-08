<template>
    <div id="tendancy" v-if="hasSearch">
        <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
            v-if="doneCallingApi == false"
            ></v-progress-circular>

            
            <v-card  v-if="doneCallingApi" style="border: 2px solid #60378c; margin-bottom:10%">
                <toast ref="toastTendancy"></toast>
                <v-list-item-group color="#60378c">
                    <v-list-item>
                        <h3>{{$t('journeysTendancySecondTitle')}}</h3>
                        <v-list-item-content>
                            <v-list-item-icon style="margin-left: 10%;">
                                <v-icon :class="'iconify '+classeCss" :data-icon="icon" x-large></v-icon>
                            </v-list-item-icon>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-card>
    </div>
</template>

<script>
import axios from 'axios'
import toast from '../components/toast.vue'
  export default { 
    components: { toast },
    data: () => ({
      icon : 'mdi-arrow-right', //by default stable
      classeCss : 'stable', //see css classes below
      doneCallingApi : false,
    }),
     props: {
      hasSearch : {type:Boolean, default: true}
    },
    methods: {
        /**
        * get tendancy from api
        * @param  {Number} idStationDepart id station of departure
        * @param  {Number} idStationArrival id station of arrival
        */
        getTendancy(idStationDepart, idStationArrival) {
            this.doneCallingApi = false;

            if(idStationDepart && idStationArrival){
                axios
                .get('https://projet-web-trains.herokuapp.com/journeys/tendancy?id-from='+idStationDepart+'&id-to='+idStationArrival)
                .then(response => {
                    if (response.data == "up"){
                        this.classeCss='increasing'
                        this.icon='mdi-arrow-top-right'
                    }
                    else if (response.data == "down"){
                        this.classeCss='decreasing'
                        this.icon='mdi-arrow-bottom-right'
                    }
                     else if (response.data == "stable"){
                        this.classeCss='stable'
                        this.icon='mdi-arrow-right'
                    }

                    this.doneCallingApi = true;
                }).catch(err => {
                    if (err.response.status === 400) {
                        this.$refs.toastTendancy.displayToast('error', err.response.data.message, 10);
                    }
                    this.doneCallingApi = true;
                });
                    
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