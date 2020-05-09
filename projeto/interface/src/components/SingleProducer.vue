<template>
    <div id="singleProducer">
        <v-container fluid>
            <v-simple-table class="table" dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td class="text-left">Name</td>
                            <td>
                                <v-layout justify-center>
                                    {{ label.Producer[0].name }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="label.Producer[0].hq">
                            <td class="text-left">Active since</td>
                            <td>
                                <v-layout justify-center>
                                    {{ label.Producer[0].hq}}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="label.album[0]">
                            <td class="text-left">Albums produced</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list class="tile" v-for="album in label.album" :key="album.album">
                                        <v-list-item link :to="'/albums/' + album.album.split('#')[1]">{{ album.albumName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Producer information</td>
                            <td>
                                <v-layout justify-center>
                                    {{ label.Producer[0].abs }}
                                </v-layout>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-container>
        <v-toolbar class="card" flat>
            <v-btn to="/producers" style="background-color:darkgrey;">Producer List</v-btn>
            <div class="spacer"></div>
            <v-btn to="/" style="background-color:darkgrey;">Main Menu</v-btn>
        </v-toolbar>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Producer',
  data(){
    return{
      label:{Producer:[{}],album:[{album:""}]},
      lhost:'http://localhost:5001/api'
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + this.$route.path)
      
      this.label = response.data
      console.log(this.label)
    }catch(e){
      return e
    }
  }
}
</script>
<style scoped>
    #singleProducer {
        background-image: url("../assets/person-adjusting-audio-of-a-sound-mixer-3531867.jpg");
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