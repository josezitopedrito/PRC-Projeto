<template>
    <div id="PerfilFavorites">
        <div v-if="profileComplete == true">
            <v-container id="content" fluid fill-height>
                <v-row align-center>
                    <v-col>
                        <v-toolbar id="contenttoolbar" class="card" flat>
                            <h2 class="title">Profile</h2>
                        </v-toolbar>
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
                        <div style="overflow:auto; max-height:500px;">
                            <v-simple-table>
                                <tr>
                                    <th class="text-left">Favourites</th>
                                </tr>
                                <tr v-for="n in nomesFavoritos" :key="n">
                                    <td>
                                        <p>{{n}}<v-icon large @click="elimFav(n)">mdi-delete</v-icon></p>
                                        
                                    </td>     
                                </tr>
                            </v-simple-table>
                        </div>
                        <v-btn @click="dialog=true">Do you wish to add another favourite?</v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-dialog v-model="dialog" max-width="1000px">
                <v-toolbar class="card" flat>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                    ></v-text-field>
                </v-toolbar>
                <v-data-table
                    class="table"
                    :headers="halbuns"
                    :items="albuns"
                    :search="search"
                    :sort-by="['Name','Options']"
                    :sort-desc="[true,false]"
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
                    </template>
                    <template v-slot:no-data>
                    <v-alert :value="true" color = "warning" icon = "warning">
                        The album list is still loading. Wait a second
                    </v-alert> 
                    </template>
                </v-data-table>
            </v-dialog>
        </div>
        <div id="main" v-else>
            <div class="loader"></div> 
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return{
      profileComplete:false,
      info:{},
      search:'',
      halbuns:[
       {text:"Name",sortable:true, value:'name',class:'subtitle-1'},
      //  {text:"Artist/Group",sortable:true, value:'creator',class:'subtitle-1'},
       {text:'Options',value:'options',sortable: false,class:'subtitle-1'}
      ],
      lhost:'http://localhost:5001/api',
      nomesFavoritos:[],
      dialog:false,
      albuns:[]
    }
  },
  created: async function(){
    try{
            let response = await axios.get(this.lhost + "/albums")
            this.albuns = response.data
        }catch(e){
            return e
        }
    try{
      let response = await axios.post(this.lhost + '/users/myFavs',{email:this.$store.state.user.email},{headers: { token: `${this.$store.state.jwt}` }})
      for(let i = 0; i < response.data.favs.length;i++){
        let responseAlbum = await axios.get(this.lhost + '/albums/' + response.data.favs[i])
        
        this.info[response.data.favs[i]] = responseAlbum.data.album[0].name
        
        this.nomesFavoritos.push(responseAlbum.data.album[0].name)
      }
      this.profileComplete = true
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
                            user:this.$store.state.user,
                            fav:key
                        },{headers: { token: `${this.$store.state.jwt}` }}) && this.removeFavs(this.$store.state.user.email,key)
        }catch(e){
            console.log(e)
        }
    },
    replaceFavs: async function(email,idfav){
        let responseAlbum = await axios.get(this.lhost + '/albums/' + idfav)
        this.info[idfav] = responseAlbum.data.album[0].name
        this.nomesFavoritos.push(responseAlbum.data.album[0].name)
        this.$store.commit('mudaFavUtilizador')
    },
    removeFavs: async function(email,idfav){
        let name = this.info[idfav]
        delete this.info[idfav]
        let index = this.nomesFavoritos.indexOf(name)
        this.nomesFavoritos.splice(index)
        this.$store.commit('mudaFavUtilizador')
    },
    newFav:async function(id){
        let keys = Object.keys(this.info)
        if(keys.includes(id)){
            alert("This album is already a favourite!")
            return;
        }
        confirm("Are you sure you want to add this album to your favourites?") && await axios.post(this.lhost + '/users/newFav',{
                    user:this.$store.state.user,
                    fav:id
                },{headers: { token: `${this.$store.state.jwt}` }}) && this.replaceFavs(this.$store.state.user.email,id) && (this.dialog = false) 
    },

  }
}
</script>

<style scoped>

#PerfilFavorites{
    background-color: beige;
    background-size: cover;
    top:0px;
    bottom: 50px;
    width: 100%;
    position: absolute;
}

#main{
        background-color: beige;
        background-size: cover;
        top:0px;
        bottom: 50px;
        width: 100%;
        position: absolute;
        
    }

.loader {
    border: 16px solid #f3f3f3;
    border-radius: 50%;
    border-top: 16px solid #3498db;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
    position:relative;
}

@keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

#content {
    /* background-color: beige; */
    max-width: 850px;
}

#contenttoolbar{
    /* background-color: beige; */
}

/* .v-data-table{
    background-color:beige;
} */

.v-text-field{
    background-color: white;
}

</style>