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
                                    <v-list class="tile" v-for="SubGenre in genre.SubGenre" :key="`sub${SubGenre.genre}`">
                                        <v-list-item link @click="changePage(SubGenre)">{{ SubGenre.genreName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.SupraGenre[0]">
                            <td class="text-left">Supragenres</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list class="tile" v-for="SupraGenre in genre.SupraGenre" :key="`supra${SupraGenre.genre}`">
                                        <v-list-item link @click="changePage(SupraGenre)">{{ SupraGenre.genreName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.FusionGenre[0]">
                            <td class="text-left">Fusion Genres</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list class="tile" v-for="FusionGenre in genre.FusionGenre" :key="`fusion${FusionGenre.genre}`">
                                        <v-list-item link @click="changePage(FusionGenre)">{{ FusionGenre.genreName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.Band[0]">
                            <td class="text-left">Musical Group</td>
                            <div style="width:1700px; overflow:auto">
                                <td>
                                    <v-layout justify-center >
                                        <v-list class="tile" v-for="band in genre.Band" :key="band.band">
                                            <v-list-item link :to="'/groups/' + band.band.split('#')[1]">{{ band.bandName }}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </div>
                        </tr>
                        <tr v-if="genre.Artist[0]">
                            <td class="text-left">Artists</td>
                            <div style="width:1700px; overflow:auto">
                                <td>
                                    <v-layout justify-center>
                                        <v-list class="tile" v-for="artist in genre.Artist" :key="artist.artist">
                                            <v-list-item link :to="'/artists/' + artist.artist.split('#')[1]">{{ artist.artistName }}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </div>
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
      genre:{Genre:[{}],SubGenre:[{genre:""}],SupraGenre:[{genre:""}],FusionGenre:[{genre:""}],Band:[{band:""}],Artist:[{artist:""}]},
      lhost:'http://localhost:5001/api'
    }
  },
  methods:{
    changePage:async function(FusionGenre){
        try{
            this.$router.push({path:`/genres/${FusionGenre.genre.split('#')[1]}`})
            this.$emit('changePage')
        }catch(e){
            console.log(e)
        }
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + this.$route.path)
      
      this.genre = response.data
    }catch(e){
      console.log(e)
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