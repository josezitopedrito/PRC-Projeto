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
                            <tr>
                                <td class="text-left">Favourites</td>
                                <td>
                                    <v-layout justify-center>
                                        <ul v-for="n in nomesFavoritos" :key="n">
                                            <li>{{n}}<v-icon large @click="elimFav(n)">mdi-delete</v-icon></li>
                                        </ul>
                                        <v-btn @click="dialog=true">Do you wish to add another favourite?</v-btn>
                                    </v-layout>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        </v-container>
        <v-dialog v-model="dialog">
            <!-- <v-data-table
                  class="table"
                  :headers="halbuns"
                  :items="albuns"
                  :search="search"
                  :sort-by="['Nome','Artist/Group','Options']"
                  :sort-desc="[true,true,false]"
                  multi-sort
                  :footer-props="{
                    showFirstLastPage: true,
                    firstIcon: 'mdi-arrow-collapse-left',
                    lastIcon: 'mdi-arrow-collapse-right',
                    prevIcon: 'mdi-minus',
                    nextIcon: 'mdi-plus'
                  }"
                >
                  <template class="tile" v-slot:item.options="{ item }">
                    <v-btn icon @click="newFav(item.id.split('#')[1])" >
                      <v-icon
                        small
                        class="mr-2"
                      >
                        mdi-plus
                      </v-icon>
                      Add
                    </v-btn>
                  </template> -->
        </v-dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return{
      info:{},
      lhost:'http://localhost:5001/api',
      nomesFavoritos:[],
      dialog:false
    }
  },
  created: async function(){
    try{
      for(let i = 0; i < this.$store.state.user.favs.length;i++){
        let response = await axios.get(this.lhost + '/albums/' + this.$store.state.user.favs[i])
        this.info[this.$store.state.user.favs[i]] = response.data.album[0].name
        this.nomesFavoritos[i] = response.data.album[0].name
      }
    }catch(e){
      console.log(e)
      return e
    }
  },
  methods:{
    elimFav: async function(n){
        let key = Object.keys(this.info).find(key => this.info[key] === n)
        try{
            confirm("Are you sure you want to delete this album from your favourites?") && await axios.post(this.lhost + '/users/elimFav',{
                            user:this.user,
                            fav:key
                        }) && this.replaceFavs()
        }catch(e){
            console.log(e)
        }
    },
    replaceFavs: async function(){
        this.nomesFavoritos=[] 
        this.nomesFavoritos = await axios.get(this.lhost + '/users/myFavs')
        this.$store.commit('mudaFavUtilizador')
    },
    //newFav:async function(){}
  }
}
</script>