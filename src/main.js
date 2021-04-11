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
import api from "@/pages/api";

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
    {path: '/stations', component: stations},
    {path: '/api', component : api}
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
    headersStationCrud : [{text: 'Id', value: 'trainStationId'},{text: 'Nom de la station', value: 'name'},
      {text: 'Longitude', value: 'longitude'},{text: 'Latitude', value: 'latitude'}
    ],
    journeysResulsHeader: 'Trajets en lien avec votre recherche',
    journeysResultsLine: 'Ligne',
    journeysResultsEmpty: 'Aucun trajet trouvé pour votre recherche',
    journeysTendancyTitle : 'Tendances des prix sur votre trajet',
    journeysTendancySecondTitle : 'Sur tous les trajets existants',
    hoursSelect :[{ text: 'Départ à' }, { text: 'Arrivée à'}],
    selectHourLabel : 'Sélectionnez l\'heure',
    searchLabel : 'Rechercher',
    selectStationDeparture : 'Gare de Départ',
    selectStationArrival : 'Gare d\'Arrivée',
    selectDate : 'Sélectionnez la date',
    backButton : 'Retour',
    menuHome: 'Accueil',
    menuCrudStation : 'Stations',
    priceLabel : 'Prix',
    menuApi : 'Api',
    searchFormTitle : 'Rechercher un trajet',
    searchResultsTitle : 'Résultats de votre recherche',
    apiTitle : 'Notre API',
    buttonToSwagger : 'Accéder à swagger',
    apiButtonsHeader : 'Partie de l\'api que nous avons utilisé',
    exempleJourneysButton : 'EXEMPLE DE TRAJET',
    exempleStationButton : 'EXEMPLE DE STATION & LIGNES',
  },
  en: {
    createStationTitle : 'Creating a new station',
    createStation: 'Create a new station',
    modifyStation: 'Modify the station ',
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
    hoursSelect :[{ text: 'Departure at', icon: 'mdi-clock' },{ text: 'Arrival at', icon: 'mdi-clock-time-eight' }],
    selectHourLabel : 'Select the hour',
    searchLabel : 'Search',
    selectStationDeparture : 'Station of departure',
    selectStationArrival : 'Station of arrival',
    selectDate : 'Select the date',
    backButton : 'Back',
    menuHome: 'Home',
    menuCrudStation : 'Stations',
    priceLabel : 'Price',
    menuApi : 'Api',
    searchFormTitle : 'Search for a journey',
    searchResultsTitle : 'Your search results',
    apiTitle : 'Our API',
    buttonToSwagger : 'Access to swagger',
    apiButtonsHeader : 'Part of the API we used',
    exempleJourneysButton : 'EXAMPLE OF A JOURNEY',
    exempleStationButton : 'EXAMPLE OF STATION & LINES',
  },
  es: {
    createStationTitle : 'Creando una nueva estación',
    createStation: 'Crea una nueva estación',
    modifyStation: 'Modificar la estación ',
    nameOfStation : 'Nombre de la estación',
    longitude : 'longitud',
    latitude : 'latitud',
    errorFormStation : 'Debes completar los siguientes campos: ',
    resetForm: 'Reiniciar',
    headersStationCrud : [
      {text: 'Id', value: 'trainStationId'},
      {text: 'Nombre de la estación', value: 'name'},
      {text: 'Longitud', value: 'longitude'},
      {text: 'Latitud', value: 'latitude'}
    ],
    journeysResulsHeader: 'Viajes relacionados con sus criterios de búsqueda',
    journeysResultsLine: 'Línea',
    journeysResultsEmpty: 'No se encontró ningún viaje que coincida con sus criterios',
    journeysTendancyTitle : 'Tendencia de precios en tu viaje',
    journeysTendancySecondTitle : 'En todos los viajes existentes',
    hoursSelect :[{ text: 'Salida a las', icon: 'mdi-clock' },{ text: 'Llegada a', icon: 'mdi-clock-time-eight' }],
    selectHourLabel : 'Seleccione la hora',
    searchLabel : 'Búsqueda',
    selectStationDeparture : 'Estación de salida',
    selectStationArrival : 'Estación de llegada',
    selectDate : 'Seleccione la fecha',
    backButton : 'Atrás',
    menuHome: 'Página principal',
    menuCrudStation : 'Estaciones',
    priceLabel : 'Precio',
    menuApi : 'Api',
    searchFormTitle : 'Busca un viaje',
    searchResultsTitle : 'Tus resultados de búsqueda',
    apiTitle : 'Nuestra API',
    buttonToSwagger : 'Acceso swagger',
    apiButtonsHeader : 'Parte de la API que usamos',
    exempleJourneysButton : 'EJEMPLO DE VIAJE',
    exempleStationButton : 'EJEMPLO DE ESTACIÓN Y LÍNEAS',
  },
  it: {
    createStationTitle : 'Creazione di una nuova stazione',
    createStation: 'Crea una nuova stazione',
    modifyStation: 'Modifica la stazione ',
    nameOfStation : 'Nome stazione',
    longitude : 'lunghezza',
    latitude : 'latitudine',
    errorFormStation : 'È necessario completare i seguenti campi : ',
    resetForm: 'Ricomincia',
    headersStationCrud : [
      {text: 'Id', value: 'trainStationId'},
      {text: 'Nome stazione', value: 'name'},
      {text: 'lunghezza', value: 'longitude'},
      {text: 'latitudine', value: 'latitude'}
    ],
    journeysResulsHeader: 'Viaggi relativi ai tuoi criteri di ricerca',
    journeysResultsLine: 'Linea',
    journeysResultsEmpty: 'Non sono state trovate corse che corrispondono ai tuoi criteri',
    journeysTendancyTitle : 'Andamento dei prezzi durante il viaggio',
    journeysTendancySecondTitle : 'In tutti i viaggi esistenti',
    hoursSelect :[{ text: 'Partenza alle', icon: 'mdi-clock' },{ text: 'Arrivare a', icon: 'mdi-clock-time-eight' }],
    selectHourLabel : 'Seleziona l\'ora',
    searchLabel : 'Ricerca',
    selectStationDeparture : 'Stazione di partenza',
    selectStationArrival : 'Stazione di arrivo',
    selectDate : 'Seleziona la data',
    backButton : 'Dietro a',
    menuHome: 'Homepage',
    menuCrudStation : 'Le stagioni',
    priceLabel : 'Prezzo',
    menuApi : 'Api',
    searchFormTitle : 'Cerca un viaggio',
    searchResultsTitle : 'I tuoi risultati di ricerca',
    apiTitle : 'La nostra API',
    buttonToSwagger : 'Accedi alla swagger',
    apiButtonsHeader : 'Parte dell\'API che abbiamo utilizzato',
    exempleJourneysButton : 'ESEMPIO DI VIAGGIO',
    exempleStationButton : 'ESEMPIO DI STAZIONE E LINEE',
  },
  de: {
    createStationTitle : 'Neue Station erstellen',
    createStation: 'Erstellen Sie eine neue Station',
    modifyStation: 'Bearbeiten Sie den Sender ',
    nameOfStation : 'Stationsname',
    longitude : 'Länge',
    latitude : 'Breite',
    errorFormStation : 'Sie müssen die folgenden Felder ausfüllen : ',
    resetForm: 'Neustart',
    headersStationCrud : [
      {text: 'Id', value: 'trainStationId'},
      {text: 'Stationsname', value: 'name'},
      {text: 'Länge', value: 'longitude'},
      {text: 'Breite', value: 'latitude'}
    ],
    journeysResulsHeader: 'Reisen im Zusammenhang mit Ihren Suchkriterien',
    journeysResultsLine: 'Linie',
    journeysResultsEmpty: 'Es wurden keine Fahrten gefunden, die Ihren Kriterien entsprechen',
    journeysTendancyTitle : 'Preistrends während der Reise',
    journeysTendancySecondTitle : 'Bei allen bestehenden Reisen',
    hoursSelect :[{ text: 'Abfahrt um', icon: 'mdi-clock' },{ text: 'Komm zu', icon: 'mdi-clock-time-eight' }],
    selectHourLabel : 'Wählen Sie die Zeit',
    searchLabel : 'Forschung',
    selectStationDeparture : 'Abfahrtsstation',
    selectStationArrival : 'Ankunftsstation',
    selectDate : 'Wählen Sie das Datum',
    backButton : 'Hinter',
    menuHome: 'Startseite',
    menuCrudStation : 'Jahreszeiten',
    priceLabel : 'Preis',
    menuApi : 'Api',
    searchFormTitle : 'Suche nach einer Reise',
    searchResultsTitle : 'Ihre Suchergebnisse',
    apiTitle : 'Unsere API',
    buttonToSwagger : 'Zugriff auf swagger',
    apiButtonsHeader : 'Ein Teil der von uns verwendeten API',
    exempleJourneysButton : 'BEISPIEL EINER REISE',
    exempleStationButton : 'BEISPIEL FÜR STATION & LINIEN',
  },
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
