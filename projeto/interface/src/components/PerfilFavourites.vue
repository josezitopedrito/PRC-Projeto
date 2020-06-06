<template>
    <div id="PerfilFavorites">
        <v-container fluid>
            <v-row justify="space-around">
            <v-col cols="5">
                <v-toolbar class="card" flat>
                    <h2 class="title">Profile</h2>
                </v-toolbar>
                <v-img contain v-bind:src="imagem" aspect-ratio="1" max-width="600px"/>
            </v-col>
            <v-col cols="5">
                <v-simple-table class="table" dense>
                    <template v-slot:default>
                        <tbody>
                            <tr>
                                <td class="text-left">Username</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ $store.state.user.username }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Email</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ $store.state.user.email}}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Type of Account</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ $store.state.user.tipo}}
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
//import axios from 'axios'
export default {
  data(){
    return{
      info:{},
      lhost:'http://localhost:5001/api'
    }
  },
  created: async function(){
    try{
      //let response = await axios.get(this.lhost + '/users/' + this.$store.state.user.email)
      
      //this.label = response.data
    }catch(e){
      console.log(e)
      return e
    }
  }
}
</script>