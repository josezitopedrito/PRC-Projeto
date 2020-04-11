<template>
    <div id="singleProducer">
        <v-container fluid>
            <v-simple-table dense>
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
                            <td class="text-left">Ano de Começo</td>
                            <td>
                                <v-layout justify-center>
                                    {{ label.Producer[0].hq}}
                                </v-layout>
                            </td>
                        </tr>
                        <tr v-if="label.album[0]">
                            <td class="text-left">Álbuns</td>
                            <td>
                                <v-layout justify-center>
                                    <ul v-for="album in label.album" :key="album"><li>{{ album.albumName }}</li></ul>
                                </v-layout>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">Informações acerca do produtor</td>
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
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Producer',
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