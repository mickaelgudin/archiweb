<template>
    <div id="tendancy" v-if="hasSearch">
        <toast ref="toastTendancy"></toast>
            
        <v-card v-if="showToast == false" style="border: 2px solid #60378c; margin-bottom:10%">
            
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
            <v-divider></v-divider>
            <v-sparkline
            :value="values"
            :gradient="gradient"
            smooth="10"
            padding="6"
            line-width="4"
            stroke-linecap="round"
            gradient-direction="top"
            :fill="false"
            type="trend"
            :auto-line-width="false"
            auto-draw
            >
            
            <template v-slot:label="item">
                {{ item.value }}€
            </template>
            
            </v-sparkline>
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
      values : [],
      gradient : ['red', 'orange', 'green'],
      showToast : false
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
            this.showToast = false;
            this.values = [];
            this.classeCss = '';
            this.icon = '';

            if(idStationDepart && idStationArrival){
                axios
                .get('https://spring-boot-h2-crud.onrender.com/journeys/'+this.$i18n.locale+'/tendancy?id-from='+idStationDepart+'&id-to='+idStationArrival)
                .then(response => {
                    let data = response.data;

                    if (data.tendancy == "up"){
                        this.classeCss='increasing'
                        this.icon='mdi-arrow-top-right'
                    }
                    else if (data.tendancy == "down"){
                        this.classeCss='decreasing'
                        this.icon='mdi-arrow-bottom-right'
                    }
                     else if (data.tendancy == "stable"){
                        this.classeCss='stable'
                        this.icon='mdi-arrow-right'
                    }
                    this.values = data.allFarePrices;
                    //avoid line not drawed if array has only one fare price
                    if(data.allFarePrices && data.allFarePrices.length == 1) {
                        this.values.push(data.allFarePrices[0]);
                    }

                    //we want to avoid reduncance in data display(we only want to show price changes not all prices)
                    if(data.allFarePrices && data.allFarePrices.length > 3) {
                        let valuesFiltered = [];
                        let currentPrice = data.allFarePrices[0];
                        valuesFiltered.push(data.allFarePrices[0]);

                        for(let i=1; i<data.allFarePrices.length; i+=1) {
                            if(data.allFarePrices[i] != currentPrice) {
                                valuesFiltered.push(data.allFarePrices[i]);
                                currentPrice = data.allFarePrices[i];
                            } 
                        }
                        if(valuesFiltered.length == 1) {
                            //special case - we need at least two values
                            valuesFiltered.push(data.allFarePrices[0]);
                        }
                        this.values = valuesFiltered;
                    }

                    this.doneCallingApi = true;
                    
                }).catch(err => {
                    if (err.response.status === 400) {
                        this.$refs.toastTendancy.displayToast('error', err.response.data.message, -1);
                        this.showToast = true;
                    }
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