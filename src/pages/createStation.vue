<template>
    <div id="main">
        <v-card width="800" elevation="2" outlined shaped tile>
            <v-card-title v-if="typeForm == 'create'">{{$t('createStation')}}</v-card-title>
            <v-card-title v-if="typeForm == 'update'">{{$t('modifyStation')+ this.newStation.name}}</v-card-title>

            <v-form ref="form" class="mb-4">
                <v-card style="padding : 1rem; margin: 1rem">
                    <v-text-field v-model="newStation.name" :label="$t('nameOfStation')" required></v-text-field>

                    <v-text-field v-model="newStation.longitude" type="number" :label="$t('longitude')" required></v-text-field>
                    <v-text-field v-model="newStation.latitude" type="number" :label="$t('latitude')" required></v-text-field>
                </v-card>

                <div id="actionMenu" style="padding : 1rem; margin: 1rem">
                    <v-btn v-if="typeForm == 'create' " color="success" class="mt-4" @click="createStation">{{ $t('createStation') }}</v-btn>
                    <v-btn v-if="typeForm == 'update' " color="success" class="mt-4" @click="updateStation">{{ $t('modifyStation') }}</v-btn>

                    <v-btn color="primary" class="mt-4 ml-4" @click="resetForm">{{ $t('resetForm') }}</v-btn>    

                    <toast ref="toast"></toast>
                </div>
            </v-form>
        </v-card>
        <datatable :items="stationsList" :headers="$t('headersStationCrud')" 
                v-on:edit="editStation" v-on:delete="deleteStation"></datatable>
    
    </div>
</template>



<script>
import axios from 'axios'
import toast from '../components/toast.vue'
import datatable from '../components/datatable.vue'

export default {
    components: { toast, datatable },
    name: "createStation",
    data () {
        return{
            newStation : { name: '', longitude: 0.0, latitude: 0.0  },
            typeForm : 'create',
            stationsList: []
        }
    },
    created () {
        this.titleCard = this.$t('createStationTitle');
    },
    mounted () {
        axios
            .get('https://projet-web-trains.herokuapp.com/train-stations')
            .then(response => (this.stationsList = response.data))
    },
    methods: {
        /**
        * defining a method to edit station in table
        * @param  {Object} item station to be modify
        */
        editStation: function(item) {
            //form has values of the selected station
            this.newStation.trainStationId = item.trainStationId;
            this.newStation.name = item.name;
            this.newStation.longitude = item.longitude;
            this.newStation.latitude = item.latitude;
            this.typeForm = 'update';
        },
        /**
        * handle onclick button update
        */
        updateStation: function(){
            this.updateStationById(this.newStation.trainStationId);
        },
        /**
        * handle onclick button delete
        */
        deleteStation: function(stationToDelete) {
            this.deleteStationById(stationToDelete.trainStationId);
        },

        /**
        * create new station and checking for error
        */
        createStation: function() {
            let errorAlert = this.checkFields();
            
            //if not error in form we create the new station
            if(errorAlert === this.$t('errorFormStation')) {
                this.createStations();
            } else {
                this.$refs.toast.displayToast('error', errorAlert, 6);
            }
        },

        /**
        * reset form by emptying the fields
        */
        resetForm: function() {
            this.newStation = { name: '', longitude: 0.0, latitude: 0.0  };
            this.typeForm = 'create';
        },

        /**
        * check fields for error
        * @return errorMessage
        */
        checkFields: function() {
            let errorAlert = this.$t('errorFormStation');

            if(!this.newStation.name|| 0 === this.newStation.name.length) {
                errorAlert += this.$t('nameOfStation');
            }
            if(!this.newStation.longitude) {
                if(errorAlert.includes(this.$t('nameOfStation'))) {
                    errorAlert += ', ';
                }
                errorAlert += this.$t('longitude');
            } 
            if(!this.newStation.latitude) {
                if(errorAlert.includes(this.$t('nameOfStation')) || errorAlert.includes(this.$t('longitude')) ) {
                    errorAlert += ', ';
                }

                errorAlert += this.$t('latitude');
            }

            return errorAlert;
        },

        /**
        * calling api to create new station
        */
        createStations: function() {
            axios.post(
                    'https://projet-web-trains.herokuapp.com/train-stations', 
                    JSON.stringify(this.newStation),
                    {
                        headers: { 
                            'Content-Type' : 'application/json' 
                        }
                    }
            )
            .then((response) => {
                this.stationsList.push(response.data);
            });

        },

        /**
        * calling api to delete the station with given id
        * @param id id of the station to delete
        */
        deleteStationById: function(id) {
            axios.delete(
                    'https://projet-web-trains.herokuapp.com/train-stations/' + id, 
                    {
                        headers: { 
                            'Content-Type' : 'application/json' 
                        }
                    }
            )
            .then((response) => {
                console.log(response.data);
                this.stationsList = this.stationsList.filter(station => {
                    return station.trainStationId != id;
                })   
            });
        },

        /**
        * calling api to update station with given
        * @param id train station id to update
        */
        updateStationById: function(id) {
            axios.put(
                    'https://projet-web-trains.herokuapp.com/train-stations/' + id, 
                    JSON.stringify(this.newStation),
                    {
                        headers: { 
                            'Content-Type' : 'application/json' 
                        }
                    }
            )
            .then((response) => {
                let stations = [];
                this.stationsList.forEach(station => {
                    if (station.trainStationId == id) {
                        stations.push(response.data);
                    }
                    else {
                        stations.push(station);
                    }
                });
                this.stationsList = stations;   
            }); 
        }
    }
}
</script>