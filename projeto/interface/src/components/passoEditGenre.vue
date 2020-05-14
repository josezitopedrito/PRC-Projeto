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
        <v-form ref="form3" method="post" enctype="multipart/form-data" v-if="position == 'first'">
            <h1>Edit Genre</h1>
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
                  :headers="hgeneros"
                  :items="generos"
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
                    <v-btn icon @click="editGenre(item.id.split('#')[1])" >
                      <v-icon
                        small
                        class="mr-2"
                      >
                        mdi-eye
                      </v-icon>
                      EDIT
                    </v-btn>
                  </template>
                  <template v-slot:no-data>
                    <v-alert :value="true" color = "warning" icon = "warning">
                      The genre list is still loading. Wait a second
                    </v-alert> 
                  </template>
                </v-data-table>
            </v-container>
        </v-form>
        <v-form ref="form" method="post" enctype="multipart/form-data" v-if="position == 'second'">
            <h1>Insert Genre</h1>
            <v-container>
              <v-text-field           
                  label="Genre Name"
                  v-model="genre.genreName"
                  required
              ></v-text-field>
              <v-textarea               
                  label="Information on the Genre"
                  v-model="genre.genreInfo"
              ></v-textarea>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="save();" v-bind:class="{disabled: disableButton}" :disabled="disableButton">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkip();" class="orange white--text" :disabled="disableButton">Saltar</v-btn>
            </v-container>
        </v-form>
        <v-form ref="form2" method="post" enctype="multipart/form-data" v-if="position != 'first' && position != 'second'">
            <h1>Insert Genre</h1>
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
                  :headers="hgeneros"
                  :items="generos"
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
                    <v-btn icon @click="addGenre(item.id.split('#')[1])" >
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
                      The genre list is still loading. Wait a second
                    </v-alert> 
                  </template>
                </v-data-table>
                <div v-if="position == 'genreArtist' && artist.genreArtist.length>0">
                  <h3>Genres of this artist's music:</h3>
                  <ul v-for="n in artist.genreArtist" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
                <div v-if="position == 'groupGenre' && group.groupGenre.length>0">
                  <h3>Genres of this musical group's music:</h3>
                  <ul v-for="n in group.groupGenre" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
                <div v-if="position == 'supergenreGenre' && genre.supergenreGenre.length>0">
                  <h3>SuperGenres of this genre:</h3>
                  <ul v-for="n in genre.supergenreGenre" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
                <div v-if="position == 'subgenreGenre' && genre.subgenreGenre.length>0">
                  <h3>SubGenres of this genre:</h3>
                  <ul v-for="n in genre.subgenreGenre" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
                <div v-if="position == 'fusiongenreGenre' && genre.fusiongenreGenre.length>0">
                  <h3>Genres whose fusion resulted in this genre:</h3>
                  <ul v-for="n in genre.fusiongenreGenre" :key="n">
                      <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                  </ul>
                </div>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="saveGroup();" v-if="position == 'groupGenre'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipGroup();" class="orange white--text" :disabled="disableButton" v-if="position == 'groupGenre'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveArtist();" v-if="position == 'genreArtist'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipArtist();" class="orange white--text" :disabled="disableButton" v-if="position == 'genreArtist'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveSuperGenre();" v-if="position == 'supergenreGenre'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipSuperGenre();" class="orange white--text" :disabled="disableButton" v-if="position == 'supergenreGenre'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveSubGenre();" v-if="position == 'subgenreGenre'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipSubGenre();" class="orange white--text" :disabled="disableButton" v-if="position == 'subgenreGenre'">Saltar</v-btn>

              <v-btn ref="submit" class="green white--text" @click="saveFusionGenre();" v-if="position == 'fusiongenreGenre'">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipFusionGenre();" class="orange white--text" :disabled="disableButton" v-if="position == 'fusiongenreGenre'">Saltar</v-btn>
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
      genre:{
        idGenre:"",
        genreName:"",
        genreInfo:"",
        supergenreGenre:[],
        subgenreGenre:[],
        fusiongenreGenre:[],
        genreArtist:[],
        groupGenre:[],
        skip:0
      },
      artist:{
        idArtist:"",
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
        idGroup:"",
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
      hgeneros:[
        {text:"Id",sortable:true, value:'id',filterable: false,class:'subtitle-1'},
        {text:"Name",sortable:true, value:'name',class:'subtitle-1'},
        {text:'Options',value:'options',sortable: false}
      ],
      generos:[],
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
      let response = await axios.get(this.lhost + "/genres")
      this.generos = response.data
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
      if(this.position == 'first' || this.position == 'second' || this.position == 'supergenreGenre' || this.position == 'subgenreGenre' || this.position == 'fusiongenreGenre'){
        this.genre.idGenre=this.obj.idGenre
        this.genre.genreName=this.obj.genreName
        this.genre.genreInfo=this.obj.genreInfo
        this.genre.groupGenre=this.obj.groups
        this.genre.genreArtist=this.obj.artists
        this.genre.supergenreGenre=this.obj.superGenres
        this.genre.subgenreGenre=this.obj.subGenres
        this.genre.fusiongenreGenre=this.obj.fusionGenres
      }
      else if(this.position == 'groupGenre'){
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
    },
    deleteItem(n){
      if(this.position == 'genreArtist'){
        var index1 = this.artist.genreArtist.indexOf(n);
        if (index1 > -1) {
          this.artist.genreArtist.splice(index1, 1);
        }
      }
      else if(this.position == 'groupGenre'){
        var index2 = this.group.groupGenre.indexOf(n);
        if (index2 > -1) {
          this.group.groupGenre.splice(index2, 1);
        }
      }
      else if(this.position == 'supergenreGenre'){
        var index3 = this.genre.supergenreGenre.indexOf(n);
        if (index3 > -1) {
          this.genre.supergenreGenre.splice(index3, 1);
        }
      }
      else if(this.position == 'subgenreGenre'){
        var index4 = this.genre.subgenreGenre.indexOf(n);
        if (index4 > -1) {
          this.genre.subgenreGenre.splice(index4, 1);
        }
      }
      else if(this.position == 'fusiongenreGenre'){
        var index5 = this.genre.fusiongenreGenre.indexOf(n);
        if (index5 > -1) {
          this.genre.fusiongenreGenre.splice(index5, 1);
        }
      }
    },
    editGenre: async function(idGenre){
        try{
          console.log(idGenre)
            let response = await axios.get(this.lhost + "/genres/" + idGenre)
            console.log(response.data)
            this.genre.idGenre = response.data.Genre[0].Genre
            this.genre.genreName = response.data.Genre[0].name
            this.genre.genreInfo = response.data.Genre[0].abs
            for(let i=0;i<response.data.artist.length;i++){
                this.genre.genreArtist.push(response.data.artist[i].artist.split('#')[1])
            }
            for(let i=0;i<response.data.Band.length;i++){
                this.genre.groupGenre.push(response.data.Band[i].band.split('#')[1])
            }
            for(let i=0;i<response.data.SupraGenre.length;i++){
                this.genre.supergenreGenre.push(response.data.SupraGenre[i].genre.split('#')[1])
            }
            for(let i=0;i<response.data.SubGenre.length;i++){
                this.genre.subgenreGenre.push(response.data.SubGenre[i].genre.split('#')[1])
            }
            for(let i=0;i<response.data.FusionGenre.length;i++){
                this.genre.fusiongenreGenre.push(response.data.FusionGenre[i].genre.split('#')[1])
            }
            this.save()
        }catch(e){
            console.log(e)
            return e
        }
    },
    reset () {
      //needs work for more resets
      if(this.position == 'second'){
        this.$refs.form.reset()
        this.genre.genreName = "",
        this.genre.genreInfo = ""
      }
      else{
        this.$refs.form2.reset()
      }
    },
    save (){
      this.$emit('atualizaGenre', this.genre)
    },
    saveSkip (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaGenre', this.genre)
    },
    addGenre(id){
      if(this.position == 'genreArtist'){
        this.artist.genreArtist.push(id)
      }
      else if(this.position == 'supergenreGenre'){
        this.genre.supergenreGenre.push(id)
      }
      else if(this.position == 'subgenreGenre'){
        this.genre.subgenreGenre.push(id)
      }
      else if(this.position == 'fusiongenreGenre'){
        this.genre.fusiongenreGenre.push(id)
      }
      else if(this.position == 'groupGenre'){
        this.group.groupGenre.push(id)
      }

    },
    saveArtist (){
      this.$emit('atualizaArtist', this.artist)
    },
    saveSkipArtist (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaArtist', this.artist)
    },
    saveGroup (){
      this.$emit('atualizaGroup', this.group)
    },
    saveSkipGroup (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaGroup', this.group)
    },
    saveSuperGenre (){
      this.$emit('atualizaGenre', this.genre)
    },
    saveSkipSuperGenre (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaGenre', this.genre)
    },
    saveSubGenre (){
      this.$emit('atualizaGenre', this.genre)
    },
    saveSkipSubGenre (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaGenre', this.genre)
    },
    saveFusionGenre (){
      this.$emit('atualizaGenre', this.genre)
    },
    saveSkipFusionGenre (){
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
      if (this.genre.genreName.length > 1)
        return false
      else
        return true
    } 
  }
}
</script>