<template>
  <div id="registar">
    <v-sheet
    color="grey lighten-4"
    height="900"
    tile
    >
      <v-row
      class="fill-height"
      align="center"
      justify="center"
      >
        <v-form ref="form" method="post" enctype="multipart/form-data" v-if="position == 'first'">
            <h1>Insert Artist</h1>
            <v-container>
              <v-text-field           
                  label="Artist Name"
                  v-model="artist.artistName"
                  required
              ></v-text-field>
              <v-container fluid>
                <label>Artist Gender</label>
                <v-radio-group v-model="artist.gender" column>
                    <v-radio label="Male" value="Male"></v-radio>
                    <v-radio label="Female" value="Female"></v-radio>
                    <v-radio label="Other" value="Other"></v-radio>
                </v-radio-group>
              </v-container>
              <v-text-field           
                  label="Birth Place"
                  v-model="artist.birthPlace"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Birth Date"
                  v-model="artist.birthDate"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Death Date"
                  v-model="artist.deathDate"
                  required
              ></v-text-field>
              <v-textarea               
                  label="Information on the Artist"
                  v-model="artist.artistInfo"
              ></v-textarea>
              <v-row align="center">
                  <label>Artist Photo</label>
                  <v-file-input show-size label="Foto" v-model="artist.foto"></v-file-input>
              </v-row>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="save();" v-bind:class="{disabled: disableButton}" :disabled="disableButton">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkip();" class="orange white--text" :disabled="disableButton">Saltar</v-btn>
            </v-container>
        </v-form>
        <v-form ref="form2" method="post" enctype="multipart/form-data" v-if="position != 'first'">
            <h1>Insert Artist</h1>
            <v-container>
                <v-data-table
                  class="table"
                  :headers="hartistas"
                  :items="artistas"
                  :search="search"
                  :sort-by="['Id','Nome','Options']"
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
                    <v-btn icon @click="addArtist(item.id.split('#')[1])" >
                      <v-icon
                        small
                        class="mr-2"
                      >
                        mdi-eye
                      </v-icon>
                      Add
                    </v-btn>
                  </template>
                  <template v-slot:no-data>
                    <v-alert :value="true" color = "warning" icon = "warning">
                      The artist list is still loading. Wait a second
                    </v-alert> 
                  </template>
                </v-data-table>
                <div v-if="position == 'genreArtist'">
                  <ul v-for="n in genre.genreArtist" :key="n">
                      <li>{{n}}</li>
                  </ul>
                </div>
                <div v-if="position == 'groupArtist'">
                  <ul v-for="n in group.groupArtist" :key="n">
                      <li>{{n}}</li>
                  </ul>
                </div>
                <div v-if="position == 'albumArtist'">
                  <ul v-for="n in album.albumArtist" :key="n">
                      <li>{{n}}</li>
                  </ul>
                </div>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="saveGenre();" v-if="position == 'genreArtist'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipGenre();" class="orange white--text" :disabled="disableButton" v-if="position == 'genreArtist'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveGroup();" v-if="position == 'groupArtist'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipGroup();" class="orange white--text" :disabled="disableButton" v-if="position == 'groupArtist'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveAlbum();" v-if="position == 'albumArtist'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipAlbum();" class="orange white--text" :disabled="disableButton" v-if="position == 'albumArtist'">Saltar</v-btn>
            </v-container>
        </v-form>
      </v-row>
    </v-sheet>
  </div>
</template>
<script>
import axios from 'axios'
//depois usar para estabelecer as rules dos campos do form
//import { required, email, max } from 'vee-validate/dist/rules'
//import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
// @ is an alias to /src

export default {
  data(){
    return{
      artist:{
        artistName:"",
        birthPlace:"",
        birthDate:"",
        deathDate:"",
        gender:"",
        artistInfo:"",
        foto:{},
        albumArtist:[],
        genreArtist:[],
        groupArtist:[],
        skip:0
      },
      album:{
        albumName:"",
        type:"",
        releaseDate:"",
        runtime:"",
        albumInfo:"",
        foto:{},
        ficheiro:{},
        albumArtist:[],
        albumGroup:[],
        albumLabel:[],
        albumProducer:[],
        skip:0
      },
      genre:{
        genreName:"",
        genreInfo:"",
        genreArtist:[],
        skip:0
      },
      group:{
        groupName:"",
        formationDate:"",
        disbandingDate:"",
        homepage:"",
        hometown:"",
        groupInfo:"",
        foto:{},
        albumGroup:[],
        groupArtist:[],
        groupGenre:[],
        skip:0
      },
      search:'',
      hartistas:[
        {text:"Id",sortable:true, value:'id',filterable: false,class:'subtitle-1'},
        {text:"Name",sortable:true, value:'name',class:'subtitle-1'},
       {text:'Options',value:'options',sortable: false}
      ],
      artistas:[],
      lhost:'http://localhost:5001/api',
    }
  },
  props:{
    obj: {
      type: Object
    },
    position: {
      type: String
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + "/artists")
      this.artistas = response.data
    }catch(e){
      return e
    }
    this.onUpdate()
  },
  watch:{
      obj: {
          immediate: true,
          deep: true,
          handler(){
              this.onUpdate()
          }
      },
      position: {
          immediate: true,
          deep: true,
          handler(){
              this.onUpdate()
          }
      }
  },
  methods:{
    onUpdate(){
      if(this.position == 'first'){
        this.artist.artistName=this.obj.artistName
        this.artist.gender=this.obj.gender
        this.artist.birthPlace=this.obj.birthPlace
        this.artist.birthDate=this.obj.birthDate
        this.artist.deathDate=this.obj.deathDate
        this.artist.artistInfo=this.obj.artistInfo
        this.artist.foto=this.obj.foto
        this.artist.albumArtist=this.obj.albums
        this.artist.groupArtist=this.obj.groups
        this.artist.genreArtist=this.obj.genres
      }
      else if(this.position == 'albumArtist'){
        this.album.idAlbum=this.obj.idAlbum
        this.album.albumName=this.obj.albumName
        this.album.type=this.obj.type
        this.album.releaseDate=this.obj.releaseDate
        this.album.runtime=this.obj.runtime
        this.album.albumInfo=this.obj.albumInfo
        this.album.foto=this.obj.foto
        this.album.albumLabel=this.obj.labels
        this.album.albumGroup=this.obj.groups
        this.album.albumArtist=this.obj.artists
        this.album.albumProducer=this.obj.producers
      }
      else if(this.position == 'groupArtist'){
        this.group.idGroup=this.obj.idGroup
        this.group.groupName=this.obj.groupName
        this.group.formationDate=this.obj.formationDate
        this.group.disbandingDate=this.obj.disbandingDate
        this.group.homepage=this.obj.homepage
        this.group.hometown=this.obj.hometown
        this.group.groupInfo=this.obj.groupInfo
        this.group.foto=this.obj.foto
        this.group.groupArtist=this.obj.members
        this.group.groupGenre=this.obj.genres
        this.group.albumGroup=this.obj.albums
      }
      else if(this.position == 'genreArtist'){
        this.genre.idGenre=this.obj.idGenre
        this.genre.genreName=this.obj.genreName
        this.genre.genreInfo=this.obj.genreInfo
        this.genre.groupGenre=this.obj.groupGenre
        this.genre.genreArtist=this.obj.genreArtist
        this.genre.supergenreGenre=this.obj.supergenreGenre
        this.genre.subgenreGenre=this.obj.subgenreGenre
        this.genre.fusiongenreGenre=this.obj.fusiongenreGenre
      }
    },
    reset () {
      //needs work for more resets
      if(this.position == 'first'){
        this.$refs.form.reset(),
        this.artist.artistName = "",
        this.artist.gender = "",
        this.artist.birthPlace = "",
        this.artist.birthDate = "",
        this.artist.deathDate = "",
        this.artist.artistInfo = "",
        this.artist.foto = {}
      }
      else{
        this.$refs.form2.reset()
      }
    },
    save (){
      this.$emit('atualizaArtist', this.artist)
    },
    saveSkip (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaArtist', this.artist)
    },
    addArtist(id){
      console.log('ID: ' + id)
      if(this.position == 'genreArtist'){
        this.genre.genreArtist.push(id)
      }
      else if(this.position == 'groupArtist'){
        this.group.groupArtist.push(id)
      }
      else if(this.position == 'albumArtist'){
        this.album.albumArtist.push(id)
        console.log('array: ' + this.album.albumArtist)
      }
    },
    saveGenre (){
      this.$emit('atualizaGenre', this.genre)
    },
    saveSkipGenre (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaGenre', this.genre)
    },
    saveGroup (){
      this.$emit('atualizaGroup', this.group)
    },
    saveSkipGroup (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaGroup', this.group)
    },
    saveAlbum (){
      this.$emit('atualizaAlbum', this.album)
    },
    saveSkipAlbum (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaAlbum', this.album)
    }
    
    /*
    atualizarInfo(){
      this.$emit('atualizarInfoPasso1','skip')
    }*/
  },
  computed:{
    disableButton (){
      if (this.artist.artistName.length > 1)
        return false
      else
        return true
    } 
  }
}
</script>