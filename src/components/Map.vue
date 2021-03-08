<template>
<div>
  <l-map  :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker :lat-lng="marker"></l-marker>
  </l-map>

</div>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
export default {
name: "Map",

  data () {
    return{
      center: L.latLng(46.1313689,-2.4361319),
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.413220, -1.219482),
      zoom: 6,


      L.map('map').setView([46.1313689,-2.4361319], 6),

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map),

//on definit les marqueur clickable(gare de montparnasse et gare de bordeaux st jean)
      L.marker([48.8402, 2.3193]).addTo(map)
      .on('click', function(){
        onClickMarqueur('paris montparnasse');
      }, false),

      L.marker([44.8260022,-0.558805]).addTo(map).on('click', function(){
        onClickMarqueur('bordeaux st jean');
      }, false),

      L.marker([48.5850571,7.7323068]).addTo(map).on('click', function(){
        onClickMarqueur('strasbourg');
      }, false),

    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
}
</script>

<style scoped>

</style>