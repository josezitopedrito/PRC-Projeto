<template>
    <div id="singleAlbum">
        <v-container fluid>
            <v-row justify="space-around">
            <v-col cols="5">
                <div class="title mb-1">Foto de álbum</div>
                <!--<v-img v-bind:src="userPic" aspect-ratio="1.7"/>-->
            </v-col>
            <v-col cols="5">
                <v-simple-table dense>
                    <template v-slot:default>
                        <tbody>
                            <tr>
                                <td class="text-left">Name</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ album.album[0].name }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Tipo de álbum</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ album.album[0].at}}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Data de lançamento</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ album.album[0].rd }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Duração do álbum</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ album.album[0].rt }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Grupo/Artista Musical</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ creator }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Empresa de gravação</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-label v-for="label in album.recordLabel" :key="label">{{ label.rlabelname }}</v-label>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Produzido por</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-label v-for="producer in album.producer" :key="producer">{{ producer.producerName }}</v-label>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Informações acerca do álbum</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ album.album[0].abs }}
                                    </v-layout>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Album',
  data(){
    return{
      creator:'',
      album:{},
      lhost:'http://localhost:5001/api'
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + this.$route.path)
      this.album = response.data
      if(response.data.band[0].bandName){
          this.creator = response.data.band[0].bandName
      } else {
          this.creator = response.data.artist[0].artistName
      }
    }catch(e){
      return e
    }
  }
}
</script>