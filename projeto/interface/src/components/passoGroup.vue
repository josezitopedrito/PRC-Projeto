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
            <h1>Insert Group</h1>
            <v-container>
              <v-text-field           
                  label="Group Name"
                  v-model="group.groupName"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Formation Date"
                  v-model="group.formationDate"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Dsibanding Date"
                  v-model="group.disbandingDate"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Homepage"
                  v-model="group.homepage"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Hometown"
                  v-model="group.hometown"
                  required
              ></v-text-field>
              <v-textarea               
                  label="Information on the Group"
                  v-model="group.groupInfo"
              ></v-textarea>
              <v-row align="center">
                  <label>Group Photo</label>
                  <v-file-input show-size label="Foto" v-model="group.foto"></v-file-input>
              </v-row>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="save();" v-bind:class="{disabled: disableButton}" :disabled="disableButton">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkip();" class="orange white--text" :disabled="disableButton">Saltar</v-btn>
            </v-container>
        </v-form>
        <v-form ref="form2" method="post" enctype="multipart/form-data" v-if="position != 'first'">
            <h1>Insert Group</h1>
            <v-container>
                <v-data-table
                  class="table"
                  :headers="hgroups"
                  :items="groups"
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
                    <v-btn icon @click="addGroup(item.id.split('#')[1])">
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
                      The group list is still loading. Wait a second
                    </v-alert> 
                  </template>
                </v-data-table>
                <div v-if="position == 'albumGroup' && album.albumGroup.length>0">
                  <h3>Groups who created this album:</h3>
                  <ul v-for="n in album.albumGroup" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
                <div v-if="position == 'groupArtist' && artist.groupArtist.length>0">
                  <h3>Groups this artist has been a part of:</h3>
                  <ul v-for="n in artist.groupArtist" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
                <div v-if="position == 'groupGenre' && genre.groupGenre.length>0">
                  <h3>Groups whose music falls into this genre:</h3>
                  <ul v-for="n in genre.groupGenre" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="saveAlbum();" v-if="position == 'albumGroup'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipAlbum();" class="orange white--text" :disabled="disableButton" v-if="position == 'albumGroup'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveArtist();" v-if="position == 'groupArtist'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipArtist();" class="orange white--text" :disabled="disableButton" v-if="position == 'groupArtist'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveGenre();" v-if="position == 'groupGenre'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipGenre();" class="orange white--text" :disabled="disableButton" v-if="position == 'groupGenre'">Saltar</v-btn>
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
      group:{
        groupName:"",
        formationDate:"",
        disbandingDate:"",
        homepage:"",
        hometown:"",
        groupInfo:"",
        albumGroup:[],
        groupArtist:[],
        groupGenre:[],
        foto:{},
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
      genre:{
        genreName:"",
        genreInfo:"",
        groupGenre:[],
        skip:0
      },  
      search:'',
      hgroups:[
        {text:"Id",sortable:true, value:'id',filterable: false,class:'subtitle-1'},
        {text:"Name",sortable:true, value:'name',class:'subtitle-1'},
        {text:'Options',value:'options',sortable: false}
      ],
      groups:[],
      lhost:'http://localhost:5001/api'
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
      let response = await axios.get(this.lhost + "/groups")
      this.groups = response.data
      console.log(this.groups)
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
      else if(this.position == 'albumGroup'){
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
        this.artist.idArtist=this.obj.idArtist
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
      else if(this.position == 'groupGenre'){
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
    deleteItem(n){
      if(this.position == 'groupArtist'){
        var index1 = this.artist.groupArtist.indexOf(n);
        if (index1 > -1) {
          this.artist.groupArtist.splice(index1, 1);
        }
      }
      else if(this.position == 'albumGroup'){
        var index2 = this.album.albumGroup.indexOf(n);
        if (index2 > -1) {
          this.album.albumGroup.splice(index2, 1);
        }
      }
      else if(this.position == 'groupGenre'){
        var index3 = this.genre.groupGenre.indexOf(n);
        if (index3 > -1) {
          this.genre.groupGenre.splice(index3, 1);
        }
      }
    },
    reset () {
      //needs work for more resets
      if(this.position == 'first'){
        this.$refs.form.reset()
        this.group.groupName = "",
        this.group.formationDate = "",
        this.group.disbandingDate = "",
        this.group.homepage = "",
        this.group.hometown = "",
        this.group.groupInfo = "",
        this.group.foto = {}
      }
      else{
        this.$refs.form2.reset()
      }
    },
    save (){
      this.$emit('atualizaGroup', this.group)
    },
    saveSkip (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaGroup', this.group)
    },
    addGroup(id){
      if(this.position == 'albumGroup'){
        this.album.albumGroup.push(id)
      }
      else if(this.position == 'groupArtist'){
        this.artist.groupArtist.push(id)
      }
      else if(this.position == 'groupGenre'){
        this.genre.groupGenre.push(id)
      }
    },
    saveAlbum (){
      this.$emit('atualizaAlbum', this.album)
    },
    saveSkipAlbum (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaAlbum', this.album)
    },
    saveArtist (){
      this.$emit('atualizaArtist', this.artist)
    },
    saveSkipArtist (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaArtist', this.artist)
    },
    saveGenre(){
      this.$emit('atualizaGenre', this.genre)
    },
    saveSkipGenre (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaGenre', this.genre)
    }

    
    /*
    atualizarInfo(){
      this.$emit('atualizarInfoPasso1','skip')
    }*/
  },
  computed:{
    disableButton (){
      if (this.group.groupName.length > 1)
        return false
      else
        return true
    } 
  }
}
</script>