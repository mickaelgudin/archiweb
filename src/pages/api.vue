<template>
    <div id="main">
      <v-card id="cardBackground">
        <v-toolbar style="margin-top: 80px;" color="#e8e8e8" dark flat>
            <v-toolbar-title class="titlesApi">{{ $t('apiTitle') }}</v-toolbar-title>
        </v-toolbar>

        <v-btn id="swaggerButton" rounded color="#60378c" dark href="https://projet-web-trains.herokuapp.com" target="_blank">
            {{ $t('buttonToSwagger') }}
        </v-btn>

        <v-toolbar id="titleSources" color="#e8e8e8" dark flat>
            <v-toolbar-title class="titlesApi">Nos sources d'inspirations</v-toolbar-title>
        </v-toolbar>

        <v-row>
          <v-col cols="12" sm="12" md="8" lg="6" xl="6">
             <v-btn rounded color="#60378c" style="margin-left: 2rem; " dark href="https://canaltp.github.io/navitia-playground/" target="_blank">
                Nativia API
            </v-btn>
          </v-col>
        </v-row>

        <v-row justify="center" style="margin-bottom: 5%">
          <v-col cols="11" sm="8" md="6" lg="4" xl="2">
            <h2>{{ $t('apiButtonsHeader') }}</h2>
          </v-col>
        </v-row>

        <div id="divMargin">
          <v-row align="center" justify="center">

              <v-dialog height="1000" width="800">
                  <template v-slot:activator="{ on, attrs }">
                    <v-row justify="center">
                      <v-col cols="12" sm="5" md="3" lg="3" xl="2" >
                        <v-btn  rounded color="#60378c" dark v-bind="attrs" @click="selectedButton = 'journeys'" v-on="on">
                          {{ $t('exempleJourneysButton') }}
                        </v-btn>
                      </v-col>
                      <v-col cols="12" sm="5" md="3" lg="3" xl="2" >
                        <v-btn  rounded color="#60378c" dark v-bind="attrs" v-on="on" @click="selectedButton = 'stations/lines'">
                          {{ $t('exempleStationButton') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </template>

                  <v-card>
                      <v-img v-if="selectedButton == 'journeys'" :src="items[0].src" height="800" width="1000"/>
                      <v-img v-else-if="selectedButton == 'stations/lines'" :src="items[1].src" height="800" width="1000"/>
                  </v-card>
              </v-dialog>
          </v-row>

        </div>
      </v-card>
    </div>
</template>

<script>
export default {
    name: "api",
    data () {
      return {
        selectedButton : '',
        items: [
          {
            src: require('../../public/journeys.png'),
          },
          {
            src: require('../../public/stations_lines.png'),
          }
        ],
      }
    },
}
</script>

<style>

:root{
  --main-purple-color: #60378c;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

#main{
  background-color: var(--main-purple-color);;
  height:100%;
}

#cardBackground{
  height:90%;
  margin-left:5%;
  margin-right:5%;
}

#swaggerButton{
  margin-left: 2rem;
  margin-top: 20px;
}

#titleSources{
  margin-top: 80px;
  margin-bottom: 20px;
}

.titlesApi {
  color: var(--main-purple-color);
}

#divMargin{
  margin-left: 2%;
  margin-right:2%
}
</style>