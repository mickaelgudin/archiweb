<template>
  <div id="main" style="background-color:#60378c">
    <div style=" margin: 2% 2% 2% 2%">
      <v-row justify="center" style="margin-top:5%">
        <v-col cols="12" sm="12" md="8" lg="6" xl="6" justify="center">
          <v-card width="800" elevation="2" outlined shaped tile>
            <v-row justify="center" style="margin-top:1%">
               <v-toolbar style="width: 50%" color="#e8e8e8" dark flat>
                  <v-card-title v-if="typeForm == 'create'" class="stationsPageTitle">{{$t('createStation')}}</v-card-title>
                  <v-card-title v-if="typeForm == 'update'" class="stationsPageTitle">{{$t('modifyStation')+ this.newStation.name}}</v-card-title>
               </v-toolbar>
            </v-row>
            <v-form ref="form" class="mb-4">
              <v-card style="padding : 1rem; margin: 1rem">
                <v-text-field v-model="newStation.name" :label="$t('nameOfStation')" color="#60378c" required></v-text-field>
                <v-text-field v-model="newStation.longitude" type="number" :label="$t('longitude')" color="#60378c" required></v-text-field>
                <v-text-field v-model="newStation.latitude" type="number" :label="$t('latitude')" color="#60378c" required></v-text-field>
              </v-card>

              <div id="actionMenu" style="padding : 1rem; margin: 1rem">
                <v-row justify="center">
                  <v-btn v-if="typeForm == 'create' " color="#ffe6cc" class="mt-4" @click="createStation" style="color:#60378c">{{ $t('createStation') }}</v-btn>
                  <v-btn v-if="typeForm == 'update' " color="#ffe6cc" class="mt-4" @click="updateStation" style="color:#60378c">{{ $t('modifyStation') }}</v-btn>

                  <v-btn color="#ffe6cc" class="mt-4 ml-4" @click="resetForm" style="color:#60378c">{{ $t('resetForm') }}</v-btn>
                </v-row>
                <toast ref="toast"></toast>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
      <toast ref="toastDatatable"></toast>
      <v-row justify="center" style="margin-bottom: 2%">
        <v-col cols="12" sm="12" md="8" lg="6" xl="6" justify="center">
          
          <datatable :items="stationsList" :headers="$t('headersStationCrud')"
                     v-on:edit="editStation" v-on:delete="deleteStation" ></datatable>
        </v-col>
      </v-row>
    </div>
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
      window.scrollTo(0,0);
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
                'https://projet-web-trains.herokuapp.com/train-stations/'+this.$i18n.locale, 
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
    * calling api to delete the station with given id, custom error is throw by if id don't exist
    * @param id id of the station to delete
    */
    deleteStationById: function(id) {
        axios.delete(
                'https://projet-web-trains.herokuapp.com/train-stations/'+this.$i18n.locale+'/'+ id, 
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
        }).catch(err => {
            if (err.response.status === 400) {
                this.$refs.toastDatatable.displayToast('error', err.response.data.message, 10);
            }
        });
        
    },

    /**
    * calling api to update station with given, there is custom error from api if id don't exist
    * @param id train station id to update
    */
    updateStationById: function(id) {
        axios.put(
                'https://projet-web-trains.herokuapp.com/train-stations/'+this.$i18n.locale+'/'+ id, 
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
        }).catch(err => {
            if (err.response.status === 400) {
                this.$refs.toast.displayToast('error', err.response.data.message, 10);
            }
        });
    }
  }
}
</script>

<style>

:root{
  --main-purple-color: #60378c;
}
.stationsPageTitle{
  font-size: 25px;
  color:var(--main-purple-color);
}

.v-application .blue--text.text--darken-2 {
  color: var(--main-purple-color) !important;
  caret-color: var(--main-purple-color) !important;
}

</style>