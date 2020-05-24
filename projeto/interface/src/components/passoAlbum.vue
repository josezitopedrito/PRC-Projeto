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
            <h1>Insert Album</h1>
            <v-container>
              <v-text-field           
                  label="Album Name"
                  v-model="album.albumName"
                  required
              ></v-text-field>
              <v-container fluid>
                <label>Album Type</label>
                <v-radio-group v-model="album.type" column>
                    <v-radio label="LP" value="LP"></v-radio>
                    <v-radio label="EP" value="EP"></v-radio>
                    <v-radio label="Soundtrack" value="Soundtrack"></v-radio>
                    <v-radio label="Compilation" value="Compilation"></v-radio>
                    <v-radio label="Live" value="Live"></v-radio>
                    <v-radio label="Single" value="Single"></v-radio>
                    <v-radio label="Cover" value="Cover"></v-radio>
                </v-radio-group>
              </v-container>
              <v-text-field           
                  label="Release Date"
                  v-model="album.releaseDate"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Album Runtime"
                  v-model="album.runtime"
                  required
              ></v-text-field>
              <v-textarea               
                  label="Information on the Album"
                  v-model="album.albumInfo"
              ></v-textarea>
              <v-row align="center">
                  <label>Album Cover</label>
                  <v-file-input show-size label="Foto" v-model="album.foto"></v-file-input>
              </v-row>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="save();" v-bind:class="{disabled: disableButton}" :disabled="disableButton">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkip();" class="orange white--text" :disabled="disableButton">Saltar</v-btn>
            </v-container>
        </v-form>
        <v-form ref="form2" method="post" enctype="multipart/form-data" v-if="position != 'first'">
            <h1>Insert Album</h1>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-container>
                <v-data-table
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
                    <v-btn icon @click="addAlbum(item.id.split('#')[1])" >
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
                      The album list is still loading. Wait a second
                    </v-alert> 
                  </template>
                </v-data-table>
                <div v-if="position == 'albumGroup' && group.albumGroup.length>0">
                  <h3>Albums this musical group has created:</h3>
                  <ul v-for="n in group.albumGroup" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
                <div v-if="position == 'albumLabel' && label.albumLabel.length>0">
                  <h3>Albums this record label has put out:</h3>
                  <ul v-for="n in label.albumLabel" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
                <div v-if="position == 'albumArtist' && artist.albumArtist.length>0">
                  <h3>Albums this artist has created:</h3>
                  <ul v-for="n in artist.albumArtist" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
                <div v-if="position == 'albumProducer' && producer.albumProducer.length>0">
                  <h3>Albums this producer has produced:</h3>
                  <ul v-for="n in producer.albumProducer" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="saveGroup();" v-if="position == 'albumGroup'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipGroup();" class="orange white--text" v-if="position == 'albumGroup'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveLabel();" v-if="position == 'albumLabel'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipLabel();" class="orange white--text" v-if="position == 'albumLabel'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveArtist();" v-if="position == 'albumArtist'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipArtist();" class="orange white--text" v-if="position == 'albumArtist'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveProducer();" v-if="position == 'albumProducer'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipProducer();" class="orange white--text" v-if="position == 'albumProducer'">Saltar</v-btn>
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
      producer:{
        producerName:"",
        firstActiveYear:"",
        producerInfo:"",
        albumProducer:[],
        skip:0
      },
      label:{
        labelName:"",
        headquarters:"",
        foundingYear:"",
        founder:"",
        labelInfo:"",
        albumLabel:[],
        skip:0
      },
      search:'',
      halbuns:[
       {text:"Name",sortable:true, value:'name',class:'subtitle-1'},
       {text:"Artist/Group",sortable:true, value:'creator',class:'subtitle-1'},
       {text:'Options',value:'options',sortable: false}
      ],
      albuns:[],
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
      let response = await axios.get(this.lhost + "/albums")
      this.albuns = response.data
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
      else if(this.position == 'albumArtist'){
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
      else if(this.position == 'albumGroup'){
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
      else if(this.position == 'albumLabel'){
        this.label.labelName=this.obj.labelName
        this.label.headquarters = this.obj.headquarters,
        this.label.foundingYear = this.obj.foundingYear,
        this.label.founder = this.obj.founder,
        this.label.labelInfo=this.obj.labelInfo
        this.label.albumLabel=this.obj.albums
      }
      else if(this.position == 'albumProducer'){
        this.producer.producerName=this.obj.producerName
        this.producer.firstActiveYear=this.obj.firstActiveYear
        this.producer.producerInfo=this.obj.producerInfo
        this.producer.albumProducer=this.obj.albums
      }
    },
    deleteItem(n){
      if(this.position == 'albumGroup'){
        var index1 = this.group.albumGroup.indexOf(n);
        if (index1 > -1) {
          this.group.albumGroup.splice(index1, 1);
        }
      }
      else if(this.position == 'albumLabel'){
        var index2 = this.label.albumLabel.indexOf(n);
        if (index2 > -1) {
          this.label.albumLabel.splice(index2, 1);
        }
      }
      else if(this.position == 'albumProducer'){
        var index3 = this.producer.albumProducer.indexOf(n);
        if (index3 > -1) {
          this.producer.albumProducer.splice(index3, 1);
        }
      }
      else if(this.position == 'albumArtist'){
        var index4 = this.artist.albumArtist.indexOf(n);
        if (index4 > -1) {
          this.artist.albumArtist.splice(index4, 1);
        }
      }
    },
    reset () {
      //needs work for more resets
      if(this.position == 'first'){
        this.$refs.form.reset()
        this.album.albumName = "",
        this.album.type = "",
        this.album.releaseDate = "",
        this.album.runtime = "",
        this.album.albumInfo = "",
        this.album.foto = {}
      }
      else{
        this.$refs.form2.reset()
      }
    },
    save (){
      this.$emit('atualizaAlbum', this.album)
    },
    saveSkip (){
      this.album.skip = 1
      this.$emit('atualizaAlbum', this.album)
    },
    addAlbum(id){
      if(this.position == 'albumArtist'){
        this.artist.albumArtist.push(id)
      }
      else if(this.position == 'albumGroup'){
        this.group.albumGroup.push(id)
      }
      else if(this.position == 'albumLabel'){
        this.label.albumLabel.push(id)
      }
      else if(this.position == 'albumProducer'){
        this.producer.albumProducer.push(id)
      }
    },
    saveArtist (){
      this.$emit('atualizaArtist', this.artist)
    },
    saveSkipArtist (){
      this.artist.skip = 1
      this.$emit('atualizaArtist', this.artist)
    },
    saveGroup (){
      this.$emit('atualizaGroup', this.group)
    },
    saveSkipGroup (){
      this.group.skip = 1
      this.$emit('atualizaGroup', this.group)
    },
    saveLabel (){
      this.$emit('atualizaLabel', this.label)
    },
    saveSkipLabel (){
      this.label.skip = 1
      this.$emit('atualizaLabel', this.label)
    },
    saveProducer (){
      this.$emit('atualizaProducer', this.producer)
    },
    saveSkipProducer (){
      this.producer.skip = 1
      this.$emit('atualizaProducer', this.producer)
    }
    
    /*
    atualizarInfo(){
      this.$emit('atualizarInfoPasso1','skip')
    }*/
  },
  computed:{
    disableButton (){
      if (this.album.albumName.length > 1 && this.album.type && this.album.releaseDate.length > 0 && this.album.runtime)
        return false
      else
        return true
    } 
  }
}
</script>