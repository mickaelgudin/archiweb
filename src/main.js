import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueI18n from 'vue-i18n';
import VueApexCharts from 'vue-apexcharts';
import '@/plugins/apexcharts';
import VueRouter from "vue-router";
import axios from 'axios'
import VueAxios from 'vue-axios'
import { LMap, LTileLayer, LMarker, LPolyline, LPopup } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';



//import NavBarSideBar from "@/components/NavBarSideBar";

import accueil from "@/pages/accueil";
import stations from "@/pages/stations";

Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(VueI18n)

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false


const router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/', component: accueil},
    {path: '/stations', component: stations}
  ]

});

Vue.component('apexchart', VueApexCharts)

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

//defining text for both language french and english
const messages = {
  fr: {
    createStationTitle : 'Création d\'une nouvelle station',
    createStation: 'Créer une nouvelle station',
    modifyStation: 'Modifier la station ',
    nameOfStation : 'nom de la station',
    longitude : 'longitude',
    latitude : 'latitude',
    errorFormStation : 'Vous devez compléter les champs suivants : ',
    resetForm: 'Réinitialiser',
    headersStationCrud : [
        {text: 'Id', value: 'trainStationId'},
        {text: 'Nom de la station', value: 'name'},
        {text: 'Longitude', value: 'longitude'},
        {text: 'Latitude', value: 'latitude'}
    ],
    journeysResulsHeader: 'Trajets en lien avec votre recherche',
    journeysResultsLine: 'Ligne',
    journeysResultsEmpty: 'Aucun trajet trouvé pour votre recherche',
    journeysTendancyTitle : 'Tendances des prix sur votre trajet', 
    journeysTendancySecondTitle : 'Sur tous les trajets existants',
    hoursSelect :[
      { text: 'Départ à' },
      { text: 'Arrivée à'}
    ],
    selectHourLabel : 'Sélectionner l\'heure',
    searchLabel : 'Rechercher',
    selectStationDeparture : 'Gare de départ',
    selectStationArrival : 'Gare d\'arrivée',
    selectDate : 'Sélectionnez la date',
    backButton : 'Retour'
  },
  en: {
    createStationTitle : 'Creating a new station',
    createStation: 'Create a new station',
    modifyStation: 'Modify the station : ',
    nameOfStation : 'Name of the station',
    longitude : 'longitude',
    latitude : 'latitude',
    errorFormStation : 'You must complete the following fields : ',
    resetForm: 'Reset',
    headersStationCrud : [
        {text: 'Id', value: 'trainStationId'},
        {text: 'Name of the station', value: 'name'},
        {text: 'Longitude', value: 'longitude'},
        {text: 'Latitude', value: 'latitude'}
    ],
    journeysResulsHeader: 'Journeys related to your search criteria',
    journeysResultsLine: 'Line',
    journeysResultsEmpty: 'No journey matching your criteria was found',
    journeysTendancyTitle : 'Prices tendancy on your journey', 
    journeysTendancySecondTitle : 'On all existing journeys', 
    hoursSelect :[
      { text: 'Departure at', icon: 'mdi-clock' },
      { text: 'Arrival at', icon: 'mdi-clock-time-eight' }
    ],
    selectHourLabel : 'Select the hour',
    searchLabel : 'Search',
    selectStationDeparture : 'Station of departure',
    selectStationArrival : 'Station of arrival',
    selectDate : 'Select the date',
    backButton : 'Back'
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'fr',
  messages,
})
Vue.component('l-popup', LPopup);
Vue.component('l-polyline', LPolyline);


new Vue({
  vuetify,
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
