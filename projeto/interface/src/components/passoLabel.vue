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
            <h1>Insert Label</h1>
            <v-container>
              <v-text-field           
                  label="Label Name"
                  v-model="label.labelName"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Headquarters"
                  v-model="label.headquarters"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Founding Year"
                  v-model="label.foundingYear"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Founder Name"
                  v-model="label.founder"
                  required
              ></v-text-field>
              <v-textarea               
                  label="Information on the Label"
                  v-model="label.labelInfo"
              ></v-textarea>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="save();" v-bind:class="{disabled: disableButton}" :disabled="disableButton">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkip();" class="orange white--text" :disabled="disableButton">Saltar</v-btn>
            </v-container>
        </v-form>
        <v-form ref="form2" method="post" enctype="multipart/form-data" v-if="position == 'albumLabel'">
            <h1>Insert Label</h1>
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
                    :headers="hlabels"
                    :items="labels"
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
                    <v-btn icon @click="addLabel(item.id.split('#')[1])">
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
                        The record label list is still loading. Wait a second
                    </v-alert> 
                    </template>
                </v-data-table>
              <div v-if="album.albumLabel.length>0">
                <h3>Record Labelds who put out this album:</h3>
                <ul v-for="n in album.albumLabel" :key="n">
                    <li>{{n}}<v-btn depressed @click="deleteItem(n)">Eliminar</v-btn></li>
                </ul>
              </div>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="saveAlbum();">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkipAlbum();" class="orange white--text" :disabled="disableButton">Saltar</v-btn>
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
        label:{
            labelName:"",
            headquarters:"",
            foundingYear:"",
            founder:"",
            labelInfo:"",
            albumLabel:[],
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
        search:'',
        hlabels:[
            {text:"Id",sortable:true, value:'id',filterable: false,class:'subtitle-1'},
            {text:"Name",sortable:true, value:'name',class:'subtitle-1'},
        {text:'Options',value:'options',sortable: false}
        ],
        labels:[],
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
      let response = await axios.get(this.lhost + "/recordLabels")
      this.labels = response.data
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
        this.label.labelName=this.obj.labelName
        this.label.headquarters = this.obj.headquarters,
        this.label.foundingYear = this.obj.foundingYear,
        this.label.founder = this.obj.founder,
        this.label.labelInfo=this.obj.labelInfo
        this.label.albumLabel=this.obj.albums
      }
      else if(this.position == 'albumLabel'){
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
    },
    deleteItem(n){
      if(this.position == 'albumLabel'){
        var index = this.album.albumLabel.indexOf(n);
        if (index > -1) {
          this.album.albumLabel.splice(index, 1);
        }
      }
    },
    reset () {
      //needs work for more resets
      if(this.position == 'first'){
        this.$refs.form.reset()
        this.label.labelName = "",
        this.label.headquarters = "",
        this.label.foundingYear = "",
        this.label.founder = "",
        this.label.labelInfo = ""
      }
      else{
        this.$refs.form2.reset()
      }
    },
    save (){
      this.$emit('atualizaLabel', this.label)
    },
    saveSkip (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaLabel', this.label)
    },
    addLabel(id){
        this.album.albumLabel.push(id)
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
      if (this.label.labelName.length > 1)
        return false
      else
        return true
    } 
  }
}
</script>