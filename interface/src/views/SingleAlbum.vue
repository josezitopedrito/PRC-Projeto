<template>
    <div id="singleAlbum">
        <v-container fluid>
            <v-row justify="space-around">
            <v-col cols="5">
                <div class="title mb-1">Foto de álbum</div>
                <v-img v-bind:src="imagem" aspect-ratio="1" max-width="600px"/>
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
                            <tr v-if="bandas.length>0">
                                <td class="text-left">Grupo Musical</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-list v-for="band in album.band" :key="band">
                                            <v-list-item link :to="'/groups/' + band.band.split('#')[1]">{{ band.bandName }}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="artistas.length>0">
                                <td class="text-left">Artista Musical</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-list v-for="artist in album.artist" :key="artist">
                                            <v-list-item link :to="'/artists/' + artist.artist.split('#')[1]">{{ artist.artistName }}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="album.recordLabel">
                                <td class="text-left">Empresa de gravação</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-list v-for="label in album.recordLabel" :key="label">
                                            <v-list-item link :to="'/labels/' + label.rlabel.split('#')[1]">{{ label.rlabelname }}</v-list-item>
                                        </v-list>
                                    </v-layout>
                                </td>
                            </tr>
                            <tr v-if="album.producer.length > 0" >
                                <td class="text-left">Produzido por</td>
                                <td>
                                    <v-layout justify-center>
                                        <v-list v-for="producer in album.producer" :key="producer">
                                            <v-list-item link :to="'/producers/' + producer.producer.split('#')[1]">{{ producer.producerName }}</v-list-item>
                                        </v-list>
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
      bandas:[],
      artistas:[],
      album:{},
      lhost:'http://localhost:5001/api',
      url:'',
      imagem:''
    }
  },
  methods:{
    fileName: function(str){
        if(str.substring(0,5) == 'File:' && (str.substring(str.length - 4,str.length) == '.jpg'||str.substring(str.length - 5,str.length) == '.jpeg'||str.substring(str.length - 4,str.length) == '.png'||str.substring(str.length - 4,str.length) == '.gif')){
            console.log('PRINT DECISIVO: ' + str)
            return str.substring(5,str.length)
        }else{
            return 'nothing'
        }
    },
    decodeUTF16LE: function( binaryStr ) {
        var cp = [];
        for( var i = 0; i < binaryStr.length; i+=2) {
            cp.push( 
                binaryStr.charCodeAt(i) |
                ( binaryStr.charCodeAt(i+1) << 8 )
            );
        }

        return String.fromCharCode.apply( String, cp );
    }

},
created: async function(){
    try{
      let response = await axios.get(this.lhost + this.$route.path)
      this.album = response.data
      console.log(this.album)
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

    console.log(this.url)
    try{
      let response2 = await axios.get(this.url)
      var pages = response2.data.query.pages;
        for (var page in pages) {
            for (var img of pages[page].images) {
                console.log(img.title)
                var str = this.fileName(img.title)
                if(str!='nothing'){
                    str = str.split(" ").join("_")
                    console.log(str)
                    try{
                        let schyper = await axios.get('http://api.hashify.net/hash/md5/hex?value=' + str)
                        console.log(schyper)
                        var schipheredStr = schyper.data['Digest']
                        console.log(schipheredStr)
                        var url2 = 'https://upload.wikimedia.org/wikipedia/en/' + schipheredStr.charAt(0) + '/' + schipheredStr.charAt(0) + schipheredStr.charAt(1) + '/' + str                 
                        let finalresponse = await axios.get(url2,{responseType:'arraybuffer'})
                        var image = new Buffer(finalresponse.data, 'binary').toString('base64')                 
                        this.imagem = `data:${finalresponse.headers['content-type'].toLowerCase()};base64,${image}`
                        break
                    }catch(e){
                        console.log('wrongFile')
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