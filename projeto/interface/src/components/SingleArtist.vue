<template>
    <div id="singleArtist">
        <v-container fluid>
            <v-row justify="space-around">
            <v-col cols="5">
                <h2 class="title">{{ artista.artist[0].name }}</h2>
                <v-img v-if="imagem != ''" v-bind:src="imagem" contain aspect-ratio="1.7" max-width="700px" />
                <v-img v-else-if="imagem == '' && artista.artist[0].g == 'female' " contain src="@/assets/images.jpeg" aspect-ratio="1" max-width="600px"/>
                <v-img v-else src="@/assets/765-default-avatar.png" contain aspect-ratio="1.7" max-width="700px" />
            </v-col>
            <v-col cols="7">
                <v-simple-table class="table" dense>
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
                                <td class="text-left">Birth Date</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ artista.artist[0].bd}}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="artista.artist[0].bpn">
                                <td class="text-left">Birth Place</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ artista.artist[0].bpn }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="artista.artist[0].dd">
                                <td class="text-left">Date of Passing</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ artista.artist[0].dd }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="artista.artist[0].g">
                                <td class="text-left">Gender</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ artista.artist[0].g }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="artista.band[0]">
                                <td class="text-left">Musical Groups</td>
                                <div style="width:930px; overflow:auto">
                                    <td>
                                        <v-layout justify-center>
                                            <v-list class="tile" v-for="band in artista.band" :key="band.band">
                                                <v-list-item link :to="'/groups/' + band.band.split('#')[1]">{{ band.bandName }}</v-list-item>
                                            </v-list>
                                        </v-layout>
                                    </td>
                                </div>
                            </tr>
                            <tr v-if="artista.album[0]">
                                <td class="text-left">Solo Albums</td>
                                <div style="width:930px; overflow:auto">
                                    <td>
                                        <v-layout justify-center>
                                            <v-list class="tile" v-for="album in artista.album" :key="album.album">
                                                <v-list-item link :to="'/albums/' + album.album.split('#')[1]">{{ album.albumName }}</v-list-item>
                                            </v-list>
                                        </v-layout>
                                    </td>
                                </div>
                            </tr>
                            <tr v-if="artista.genre[0]">
                                <td class="text-left">Genres</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-list class="tile" v-for="genre in artista.genre" :key="genre.genre">
                                            <v-list-item link :to="'/genres/' + genre.genre.split('#')[1]">{{ genre.genreName }}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Artist Information</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ artista.artist[0].abs }}
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
            <v-btn to="/artists" style="background-color:darkgrey;">Artist List</v-btn>
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
      artista:{artist:[{}],band:[{band:""}],album:{},genre:[{genre:""}]},
      lhost:'http://localhost:5001/api',
      url:'',
      imagem:''
    }
  },
  methods:{
    fileName: function(str){
        if(str.substring(0,5) == 'File:' && (str.substring(str.length - 4,str.length) == '.jpg'||str.substring(str.length - 5,str.length) == '.jpeg'||str.substring(str.length - 4,str.length) == '.png'||str.substring(str.length - 4,str.length) == '.gif')){
            return str.substring(5,str.length)
        }else{
            return 'nothing'
        }
    }

},
  created: async function(){
    try{
      let response = await axios.get(this.lhost + this.$route.path)
      this.artista = response.data
    }catch(e){
      console.log(e)
      return e
    }
    this.url = "https://en.wikipedia.org/w/api.php"; 

    this.url = this.url + "?origin=*";
    this.url += "&action=query";
    this.url += "&prop=images";

    var replaced = this.artista.artist[0].name;
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
                        var url2 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + schipheredStr.charAt(0) + '/' + schipheredStr.charAt(0) + schipheredStr.charAt(1) + '/' + str + '/800px-' + str       
                        let finalresponse = await axios.get(url2,{responseType:'arraybuffer','Access-Control-Allow-Origin':'*'})
                        var image = new Buffer(finalresponse.data, 'binary').toString('base64')                 
                        this.imagem = `data:${finalresponse.headers['content-type'].toLowerCase()};base64,${image}`
                        break
                    }catch{
                        // console.log('wrongFile')
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
    #singleArtist {
        background-image: url("../assets/brown-and-black-cut-away-acoustic-guitar-1010519.jpg");
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