<template>
    <div id="singleGroup">
        <v-container fluid>
            <v-row justify="space-around">
            <v-col cols="5">
                <h2 class="title">{{ group.band[0].name }}</h2>
                <v-img v-if="imagem != ''" contain v-bind:src="imagem" aspect-ratio="1.7" max-width="600px"/>
                <v-img v-else contain src="@/assets/default_group_normal.png" aspect-ratio="1.7" max-width="600px"/>
            </v-col>
            <v-col cols="7">
                <v-simple-table class="table" dense>
                    <template v-slot:default>
                        <tbody>
                            <tr>
                                <td class="text-left">Name</td>
                                <td>
                                    <v-layout justify-center>
                                        <h3>{{ group.band[0].name }}</h3>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="group.band[0].sd">
                                <td class="text-left">Formation Date</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ group.band[0].sd}}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="group.band[0].ed">
                                <td class="text-left">Disbanding Date</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ group.band[0].ed }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="group.band[0].hp">
                                <td class="text-left">Group Homepage</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ group.band[0].hp }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="group.band[0].ht">
                                <td class="text-left">Hometown</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ group.band[0].ht }}
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="group.artist[0]">
                                <td class="text-left">Members</td>
                                <div style="height:200px; overflow-y:auto">
                                    <td style="width:900px">
                                        <v-item-group>
                                            <v-row>
                                                <v-col class="tile" v-for="artist in group.artist" :key="artist.artist" cols="12" md="2">
                                                    <v-list-item link :to="'/artists/' + artist.artist.split('#')[1]">{{ artist.artistName }}</v-list-item>
                                                </v-col>
                                            </v-row>
                                        </v-item-group>
                                    </td>
                                </div>
                            </tr>
                            <tr v-if="group.album[0]">
                                <td class="text-left">Albums</td>
                                <div style="height:200px; overflow-y:auto">
                                    <td style="width:900px">
                                        <v-item-group>
                                            <v-row>
                                                <v-col class="tile" v-for="album in group.album" :key="album.album" cols="12" md="2">
                                                    <v-list-item link :to="'/albums/' + album.album.split('#')[1]">{{ album.albumName }}</v-list-item>
                                                </v-col>
                                            </v-row>
                                        </v-item-group>
                                    </td>
                                </div>
                            </tr>
                            <tr v-if="group.genre[0]">
                                <td class="text-left">Genres</td>
                                <div style="height:200px; overflow-y:auto">
                                    <td style="width:900px">
                                        <v-item-group>
                                            <v-row>
                                                <v-col class="tile" v-for="genre in group.genre" :key="genre.genre" cols="12" md="2">
                                                    <v-list-item link :to="'/genres/' + genre.genre.split('#')[1]">{{ genre.genreName }}</v-list-item>
                                                </v-col>
                                            </v-row>
                                        </v-item-group>
                                    </td>
                                </div>
                            </tr>
                            <tr>
                                <td class="text-left">Group information</td>
                                <td>
                                    <v-layout justify-center>
                                        {{ group.band[0].abs }}
                                    </v-layout>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
            </v-row>
        </v-container>
        <v-toolbar class="card mb-11" flat>
            <v-btn to="/groups" style="background-color:darkgrey;">Group List</v-btn>
            <div class="spacer"></div>
            <v-btn to="/" style="background-color:darkgrey;">Main Menu</v-btn>
        </v-toolbar>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Group',
  data(){
    return{
      group:{band:[{}],artist:[{artist:""}],album:[{album:""}],genre:[{genre:""}]},
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
      
      this.group = response.data
    }catch(e){
      console.log(e)
      return e
    }
    this.url = "https://en.wikipedia.org/w/api.php"; 

    this.url = this.url + "?origin=*";
    this.url += "&action=query";
    this.url += "&prop=images";

    var replaced = this.group.band[0].name;
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
                        var url2 = 'https://upload.wikimedia.org/wikipedia/commons/' + schipheredStr.charAt(0) + '/' + schipheredStr.charAt(0) + schipheredStr.charAt(1) + '/' + str       
                        let finalresponse = await axios.get(url2,{responseType:'arraybuffer','Access-Control-Allow-Origin':'*'})
                        var image = new Buffer(finalresponse.data, 'binary').toString('base64')
                        this.imagem = `data:${finalresponse.headers['content-type'].toLowerCase()};base64,${image}`
                        break
                    }catch(e){
                        try{
                            if(this.imagem == ''){
                                url2 = 'https://upload.wikimedia.org/wikipedia/en/' + schipheredStr.charAt(0) + '/' + schipheredStr.charAt(0) + schipheredStr.charAt(1) + '/' + str        
                                let finalresponse = await axios.get(url2,{responseType:'arraybuffer','Access-Control-Allow-Origin':'*'})
                                image = new Buffer(finalresponse.data, 'binary').toString('base64')
                                this.imagem = `data:${finalresponse.headers['content-type'].toLowerCase()};base64,${image}`
                            }
                        }catch{
                            // console.log('wrongFile')
                        }
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
    #singleGroup {
        background-image: url("../assets/people-at-concert-1105666.jpg");
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