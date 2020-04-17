<template>
    <div id="singleLabel">
        <v-container fluid>
            <v-simple-table dense>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td class="text-left">Name</td>
                            <td>
                                <v-layout justify-center>
                                    {{ label.RecordLabel[0].name }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="label.RecordLabel[0].hq">
                            <td class="text-left">Sede</td>
                            <td>
                                <v-layout justify-center>
                                    {{ label.RecordLabel[0].hq}}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="label.RecordLabel[0].fy">
                            <td class="text-left">Ano de Fundação</td>
                            <td>
                                <v-layout justify-center>
                                    {{ label.RecordLabel[0].fy }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="label.RecordLabel[0].fn">
                            <td class="text-left">Fundador</td>
                            <td>
                                <v-layout justify-center>
                                    {{ label.RecordLabel[0].fn }}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="label.album[0]">
                            <td class="text-left">Álbuns</td>
                            <td>
                                <v-layout justify-center>
                                    <v-list v-for="album in label.album" :key="album">
                                        <v-list-item link :to="'/albums/' + album.album.split('#')[1]">{{ album.albumName }}</v-list-item>
                                    </v-list>
                                </v-layout>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Informações acerca do label</td>
                            <td>
                                <v-layout justify-center>
                                    {{ label.RecordLabel[0].abs }}
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
  name: 'RecordLabel',
  data(){
    return{
      label:{},
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