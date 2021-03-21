import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueApexCharts from 'vue-apexcharts';
import '@/plugins/apexcharts';
import VueRouter from "vue-router";
import axios from 'axios'
import VueAxios from 'vue-axios'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';



//import NavBarSideBar from "@/components/NavBarSideBar";

import accueil from "@/pages/accueil";
import createStation from "@/pages/createStation";

Vue.use(VueRouter)
Vue.use(VueAxios, axios)

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
    {path: '/stations', component: createStation}
  ]

});

Vue.component('apexchart', VueApexCharts)

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);



new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
