<template>
    <div id="singleAlbum">
        <v-container fluid>
            <v-row justify="space-around">
            <v-col cols="5">
                <v-toolbar class="card" flat>
                    <h2 class="title">{{ album.album[0].name }}</h2>
                    <div class="spacer"></div>
                    <div v-if="$store.state.jwt != '' && fav==false">
                        <v-btn @click="newFav(idalbum)">Add to Favorites</v-btn>
                    </div>
                    <div v-if="$store.state.jwt != '' && fav==true">
                        <v-btn @click="elimFav(idalbum)">Remove from Favorites</v-btn>
                    </div>
                </v-toolbar>
                <v-img contain v-bind:src="imagem" aspect-ratio="1" max-width="600px"/>
            </v-col>
            <v-col cols="5">
                <v-simple-table class="table" dense>
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
                                <td class="text-left">Album Type</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ album.album[0].at}}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Release Date</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ album.album[0].rd }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Duration of the album</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ album.album[0].rt }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="bandas.length>0">
                                <td class="text-left">Musical Group</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-list class="tile" v-for="band in album.band" :key="band.band">
                                            <v-list-item link :to="'/groups/' + band.band.split('#')[1]"
                                            >{{ band.bandName }}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="artistas.length>0">
                                <td class="text-left">Artist</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-list class="tile" v-for="artist in album.artist" :key="artist.artist">
                                            <v-list-item link :to="'/artists/' + artist.artist.split('#')[1]">{{ artist.artistName }}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="album.recordLabel.length>0">
                                <td class="text-left">Record Label</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-list class="tile" v-for="label in album.recordLabel" :key="label.rlabel">
                                            <v-list-item link :to="'/recordLabels/' + label.rlabel.split('#')[1]">{{ label.rlabelName}}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="album.producer.length > 0" >
                                <td class="text-left">Produced by</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-list class="tile" v-for="producer in album.producer" :key="producer.producer">
                                            <v-list-item link :to="'/producers/' + producer.producer.split('#')[1]">{{ producer.producerName }}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Album information</td>
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
        <v-toolbar class="card" flat>
            <v-btn to="/albums" style="background-color:darkgrey;">Album List</v-btn>
            <div class="spacer"></div>
            <v-btn to="/" style="background-color:darkgrey;">Main Menu</v-btn>
        </v-toolbar>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Album',
  data(){
    return{
      idalbum: this.$route.path.split("/")[2],
      bandas:[],
      artistas:[],
      album:{album:[{}],recordLabel:{},producer:{}},
      lhost:'http://localhost:5001/api',
      url:'',
      imagem:'',
      fav:false
    }
  },
  methods:{
    fileName: function(str){
        if(str.substring(0,5) == 'File:' && (str.substring(str.length - 4,str.length) == '.jpg'||str.substring(str.length - 5,str.length) == '.jpeg'||str.substring(str.length - 4,str.length) == '.png'||str.substring(str.length - 4,str.length) == '.gif')){
            return str.substring(5,str.length)
        }else{
            return 'nothing'
        }
    },
    elimFav: async function(id){
        try{
            confirm("Are you sure you want to delete this album from your favourites?") && await axios.post(this.lhost + '/users/elimFav',{
                            user:this.$store.state.user,
                            fav:id
                        },{headers: { token: `${this.$store.state.jwt}` }}) && (this.fav = false)
        }catch(e){
            console.log(e)
        }
    },
    newFav:async function(id){
        confirm("Are you sure you want to add this album to your favourites?") && await axios.post(this.lhost + '/users/newFav',{
                    user:this.$store.state.user,
                    fav:id
                },{headers: { token: `${this.$store.state.jwt}` }}) && (this.fav = true)
    },

},
created: async function(){
    try{
      let response = await axios.get(this.lhost + this.$route.path)
      this.album = response.data
      if( this.$store.state.jwt != ''){
          let responseFav = await axios.post(this.lhost + '/users/myFavs',{email:this.$store.state.user.email},{headers: { token: `${this.$store.state.jwt}` }})
          for(let i = 0; i < responseFav.data.favs.length;i++){
                if(responseFav.data.favs[i] == this.idalbum){
                    this.fav = true
                    break;
                }
            }
      }
      if(response.data.band.length > 0){
          this.bandas = this.bandas.concat(response.data.band)
      } 
      if (response.data.artist.length > 0){
          this.artistas = this.artistas.concat(response.data.artist)
      }
    }catch(e){
      console.log(e)
      return e
    }
    this.url = "https://en.wikipedia.org/w/api.php"; 

    this.url = this.url + "?origin=*";
    this.url += "&action=query";
    this.url += "&prop=images";

    var replaced = this.album.album[0].name;
    replaced = replaced.split("&").join("%26")

    this.url += "&titles=" + replaced;
    this.url += "&format=json";

    this.url = this.url.split(" ").join("_")

    try{
      let response2 = await axios.get(this.url,{'Access-Control-Allow-Origin':'*'})
      var pages = response2.data.query.pages;
        for (var page in pages) {
            for (var img of pages[page].images) {
                var str = this.fileName(img.title)
                if(str!='nothing'){
                    str = str.split(" ").join("_")
                    try{
                        let schyper = await axios.get('https://api.hashify.net/hash/md5/hex?value=' + str,{'Access-Control-Allow-Origin':'*'})
                        var schipheredStr = schyper.data['Digest']
                        var url2 = 'https://upload.wikimedia.org/wikipedia/en/' + schipheredStr.charAt(0) + '/' + schipheredStr.charAt(0) + schipheredStr.charAt(1) + '/' + str                 
                        let finalresponse = await axios.get(url2,{responseType:'arraybuffer','Access-Control-Allow-Origin':'*'})
                        var image = new Buffer(finalresponse.data, 'binary').toString('base64')                 
                        this.imagem = `data:${finalresponse.headers['content-type'].toLowerCase()};base64,${image}`
                        break
                    }catch{
                        //console.log('wrongFile')
                    }
                }
            }
        }
    }catch(e){
      console.log(e)
      return e
    }
  }
}
</script>
<style scoped>
    #singleAlbum {
        background-image: url("../assets/black-vinyl-player-145707.jpg");
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
    .title{
        color:aliceblue;
    }
    .table{
        background-color: rgba(255,255,255,0.5);
    }
    .card {
      background-color: transparent!important;
      opacity: 1;
    }
</style>