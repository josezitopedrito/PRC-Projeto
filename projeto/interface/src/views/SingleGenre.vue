<template>
    <div id="singleGenre">
        <v-container fluid>
            <v-simple-table class="table" dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td class="text-left">Name</td>
                            <td>
                                <v-layout justify-center>
                                    {{ genre.Genre[0].name }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.SubGenre[0]">
                            <td class="text-left">Subgenres</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list class="tile" v-for="SubGenre in genre.SubGenre" :key="SubGenre">
                                        <v-list-item link :to="'/genres/' + SubGenre.genre.split('#')[1]">{{ SubGenre.genreName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.SupraGenre[0]">
                            <td class="text-left">Supragenres</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list class="tile" v-for="SupraGenre in genre.SupraGenre" :key="SupraGenre">
                                        <v-list-item link :to="'/genres/' + SupraGenre.genre.split('#')[1]">{{ SupraGenre.genreName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.FusionGenre[0]">
                            <td class="text-left">Fusion Genres</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list class="tile" v-for="FusionGenre in genre.FusionGenre" :key="FusionGenre">
                                        <v-list-item link :to="'/genres/' + FusionGenre.genre.split('#')[1]">{{ FusionGenre.genreName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.Band[0]">
                            <td class="text-left">Musical Group</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list class="tile" v-for="Band in genre.Band" :key="Band">
                                        <v-list-item link :to="'/groups/' + band.band.split('#')[1]">{{ Band.bandName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Genre information</td>
                            <td>
                                <v-layout justify-center>
                                    {{ genre.Genre[0].abs }}
                                </v-layout>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-container>
        <v-toolbar class="card" flat>
            <v-btn to="/genres" style="background-color:darkgrey;">Genre List</v-btn>
            <div class="spacer"></div>
            <v-btn to="/" style="background-color:darkgrey;">Main Menu</v-btn>
        </v-toolbar>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Género',
  data(){
    return{
      genre:{},
      lhost:'http://localhost:5001/api'
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + this.$route.path)
      
      this.genre = response.data
      console.log(this.genre)
    }catch(e){
      return e
    }
  }
}
</script>
<style scoped>
    #singleGenre {
        background-image: url("../assets/group-of-men-holding-drums-performing-on-stage-2888802.jpg");
        background-color: #cccccc;
        min-height: 94%;
        background-size: cover;
        background-position:50% 50%;
    }
    .tile{
        background-color:transparent;
    }
    .tile:hover{
        background-color: burlywood;
    }
    .tile:active{
        background-color: aliceblue;
    }
    .table{
        background-color: rgba(255,255,255,0.5);
    }
    .card {
      background-color: transparent!important;
      opacity: 1;
    }
</style>