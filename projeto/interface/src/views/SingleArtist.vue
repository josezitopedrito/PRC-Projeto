<template>
    <div id="singleArtist">
        <v-container fluid>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td class="text-left">Name</td>
                            <td>
                                <v-layout justify-center>
                                    {{ artista.artist[0].name }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="artista.artist[0].bd">
                            <td class="text-left">Data de Nascimento</td>
                            <td>
                                <v-layout justify-center>
                                    {{ artista.artist[0].bd}}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="artista.artist[0].bpn">
                            <td class="text-left">Local de Nascimento</td>
                            <td>
                                <v-layout justify-center>
                                    {{ artista.artist[0].bpn }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="artista.artist[0].dd">
                            <td class="text-left">Data da Morte</td>
                            <td>
                                <v-layout justify-center>
                                    {{ artista.artist[0].dd }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="artista.artist[0].g">
                            <td class="text-left">Género</td>
                            <td>
                                <v-layout justify-center>
                                    {{ artista.artist[0].g }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="artista.band[0]">
                            <td class="text-left">Grupo Musical</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list v-for="band in artista.band" :key="band">
                                        <v-list-item link :to="'/groups/' + band.band.split('#')[1]">{{ band.bandName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="artista.album[0]">
                            <td class="text-left">Álbuns</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list v-for="album in artista.album" :key="album">
                                        <v-list-item link :to="'/albums/' + album.album.split('#')[1]">{{ album.albumName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Informações acerca do artista</td>
                            <td>
                                <v-layout justify-center>
                                    {{ artista.artist[0].abs }}
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
  name: 'Album',
  data(){
    return{
      artista:{},
      lhost:'http://localhost:5001/api'
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + this.$route.path)
      this.artista = response.data
      console.log(this.artista)
    }catch(e){
      return e
    }
  }
}
</script>