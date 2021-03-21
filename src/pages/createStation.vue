<template>
    <div id="main">
        <v-card width="800" elevation="2" outlined shaped tile>
            <v-card-title>{{titleCard}}</v-card-title>
            <v-form ref="form" class="mb-4">
                <v-card style="padding : 1rem; margin: 1rem">
                    <v-text-field v-model="newStation.name" label="Nom de la station" required></v-text-field>

                    <v-text-field v-model="newStation.longitude" type="number" label="Longitude" required></v-text-field>
                    <v-text-field v-model="newStation.latitude" type="number" label="Lattitude" required></v-text-field>
                </v-card>

                <div id="actionMenu" style="padding : 1rem; margin: 1rem">
                    <v-btn v-if="typeForm == 'create' " color="success" class="mt-4" @click="createStation">Créer la station</v-btn>
                    <v-btn v-if="typeForm == 'update' " color="success" class="mt-4" @click="updateStation">Modifier la station</v-btn>

                    <v-btn color="primary" class="mt-4 ml-4" @click="resetForm">Reset</v-btn>    

                    <toast ref="toast"></toast>
                </div>
            </v-form>
        </v-card>
        <datatable :items="stationsList" :headers="headers" 
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
            headers : [
                {text: 'Id', value: 'trainStationId'},
                {text: 'Nom de la station', value: 'name'},
                {text: 'Longitute', value: 'longitude'},
                {text: 'Latitude', value: 'latitude'}
            ],
            typeForm : 'create',
            titleCard : 'Créer une nouvelle station',
            stationsList: []
        }
    },
    mounted () {
        axios
            .get('https://projet-web-trains.herokuapp.com/train-stations')
            .then(response => (this.stationsList = response.data))
    },
    methods: {
        editStation: function(item) {
            //form has values of the selected station
            this.newStation = item;
            this.typeForm = 'update';
            this.titleCard = 'Modifier la station '+this.newStation.name;
        },
        updateStation: function(){
            console.log("station modified : "+JSON.stringify(this.newStation) );
        },
        deleteStation: function(stationToDelete) {
            console.log("item to delete : "+JSON.stringify(stationToDelete) );
            //implement this function
        },
        createStation: function() {
            let errorAlert = this.checkFields();
            
            //if not error in form we create the new station
            if(errorAlert === 'La station doit avoir ') {
                this.createStations();
            } else {
                this.$refs.toast.displayToast('error', errorAlert, 6);
            }
        },
        resetForm: function() {
            this.newStation = { name: '', longitude: 0.0, latitude: 0.0  };
            this.typeForm = 'create';
            this.titleCard = 'Créer une nouvelle station';
        },
        checkFields: function() {
            let errorAlert = 'La station doit avoir ';

            if(!this.newStation.name|| 0 === this.newStation.name.length) {
                errorAlert += 'un nom';
            }
            if(!this.newStation.longitude) {
                if(errorAlert.includes('un nom')) {
                    errorAlert += ', ';
                }
                errorAlert += 'une longitude';
            } 
            if(!this.newStation.latitude) {
                if(errorAlert.includes('un nom') || errorAlert.includes('une longitude') ) {
                    errorAlert += ', ';
                }

                errorAlert += 'une latitude';
            }

            return errorAlert;
        },
        createStations: function() {
            axios.post(
                    'https://projet-web-trains.herokuapp.com/train-stations', 
                    JSON.stringify(this.newStation),
                    {
                        headers: { 
                            'Content-Type' : 'application/json' 
                        }
                    }

            );
        }
    }
}
</script>