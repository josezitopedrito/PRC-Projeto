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
                                    {{ group.band[0].name }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="group.band[0].sd">
                            <td class="text-left">Data de Formação</td>
                            <td>
                                <v-layout justify-center>
                                    {{ group.band[0].sd}}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="group.band[0].ed">
                            <td class="text-left">Data de Término</td>
                            <td>
                                <v-layout justify-center>
                                    {{ group.band[0].ed }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="group.band[0].hp">
                            <td class="text-left">Página do grupo</td>
                            <td>
                                <v-layout justify-center>
                                    {{ group.band[0].hp }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="group.band[0].ht">
                            <td class="text-left">Cidade de origem</td>
                            <td>
                                <v-layout justify-center>
                                    {{ group.band[0].ht }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="group.artist[0]">
                            <td class="text-left">Membros</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list v-for="artist in group.artist" :key="artist">
                                        <v-list-item link :to="'/artists/' + artist.artist.split('#')[1]">{{ artist.artistName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="group.album[0]">
                            <td class="text-left">Álbuns</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list v-for="album in group.album" :key="album">
                                        <v-list-item link :to="'/albums/' + album.album.split('#')[1]">{{ album.albumName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="group.genre[0]">
                            <td class="text-left">Géneros</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list v-for="genre in group.genre" :key="genre">
                                        <v-list-item link :to="'/genres/' + genre.genre.split('#')[1]">{{ genre.genreName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Informações acerca do group</td>
                            <td>
                                <v-layout justify-center>
                                    {{ group.band[0].abs }}
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
  name: 'Group',
  data(){
    return{
      group:{},
      lhost:'http://localhost:5001/api'
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + this.$route.path)
      
      this.group = response.data
      console.log(this.group)
    }catch(e){
      return e
    }
  }
}
</script>