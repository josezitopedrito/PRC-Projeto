<template>
    <div id="singleGroup">
        <v-container fluid>
            <v-simple-table dense>
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
                            <td class="text-left">Subgéneros</td>
                            <td>
                                <v-layout justify-center>
                                    <ul v-for="SubGenre in genre.SubGenre" :key="SubGenre"><li>{{ SubGenre.genreName }}</li></ul>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.SupraGenre[0]">
                            <td class="text-left">Supragéneros</td>
                            <td>
                                <v-layout justify-center>
                                    <ul v-for="SupraGenre in genre.SupraGenre" :key="SupraGenre"><li>{{ SupraGenre.genreName }}</li></ul>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.FusionGenre[0]">
                            <td class="text-left">Géneros originados a partir da fusão com outro género</td>
                            <td>
                                <v-layout justify-center>
                                    <ul v-for="FusionGenre in genre.FusionGenre" :key="FusionGenre"><li>{{ FusionGenre.genreName }}</li></ul>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="genre.Band[0]">
                            <td class="text-left">Musical Group</td>
                            <td>
                                <v-layout justify-center>
                                    <ul v-for="Band in genre.Band" :key="Band"><li>{{ Band.bandName }}</li></ul>
                                </v-layout>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Informações acerca do genre</td>
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