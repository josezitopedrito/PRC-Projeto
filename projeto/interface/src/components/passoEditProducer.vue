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
            <h1>Edit Producer</h1>
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
                    :headers="hprodutores"
                    :items="produtores"
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
                    <v-btn icon @click="editProducer(item.id.split('#')[1])">
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
                        The producer list is still loading. Wait a second
                    </v-alert> 
                    </template>
                </v-data-table>
            </v-container>
        </v-form>
        <v-form ref="form" method="post" enctype="multipart/form-data" v-if="position == 'second'">
            <h1>Insert Producer</h1>
            <v-container>
              <v-text-field           
                  label="Producer Name"
                  v-model="producer.producerName"
                  required
              ></v-text-field>
              <v-text-field           
                  label="Active Since"
                  v-model="producer.firstActiveYear"
                  required
              ></v-text-field>
              <v-textarea               
                  label="Information on the Producer"
                  v-model="producer.producerInfo"
              ></v-textarea>
              <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
              <v-btn ref="submit" class="green white--text" @click="save();" v-bind:class="{disabled: disableButton}" :disabled="disableButton">Submit</v-btn>
              <v-btn ref="skip" @click="saveSkip();" class="orange white--text" :disabled="disableButton">Saltar</v-btn>
            </v-container>
        </v-form>
        <v-form ref="form2" method="post" enctype="multipart/form-data" v-if="position == 'albumProducer'">
            <h1>Insert Producer</h1>
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
                    :headers="hprodutores"
                    :items="produtores"
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
                    <v-btn icon @click="addProducer(item.id.split('#')[1])">
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
                        The producer list is still loading. Wait a second
                    </v-alert> 
                    </template>
                </v-data-table>
              <div v-if="album.albumProducer.length>0">
                <h3>Producers of this album:</h3>
                <ul v-for="n in album.albumProducer" :key="n">
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
        producer:{
            idProducer:"",
            producerName:"",
            firstActiveYear:"",
            producerInfo:"",
            albumProducer:[],
            skip:0
        },
        album:{
          idAlbum:"",
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
        hprodutores:[
            {text:"Id",sortable:true, value:'id',filterable: false,class:'subtitle-1'},
            {text:"Name",sortable:true, value:'name',class:'subtitle-1'},
            {text:'Options',value:'options',sortable: false}
        ],
        produtores:[],
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
      let response = await axios.get(this.lhost + "/producers")
      this.produtores = response.data
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
      if(this.position == 'first' || this.position == 'second'){
        this.producer.idProducer=this.obj.idProducer
        this.producer.producerName=this.obj.producerName
        this.producer.firstActiveYear=this.obj.firstActiveYear
        this.producer.producerInfo=this.obj.producerInfo
        this.producer.albumProducer=this.obj.albums
      }
      else if(this.position == 'albumProducer'){
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
      if(this.position == 'albumProducer'){
        var index = this.album.albumProducer.indexOf(n);
        if (index > -1) {
          this.album.albumProducer.splice(index, 1);
        }
      }
    },
    editProducer: async function(idProducer){
        try{
            let response = await axios.get(this.lhost + "/producers/" + idProducer)
            console.log(response.data)
            this.producer.idProducer = idProducer
            this.producer.producerName = response.data.Producer[0].name
            this.producer.firstActiveYear = response.data.Producer[0].sy
            this.producer.producerInfo = response.data.Producer[0].abs
            for(let i=0;i<response.data.album.length;i++){
                this.producer.albumProducer.push(response.data.album[i].album.split('#')[1])
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
        this.producer.producerName = "",
        this.producer.firstActiveYear = "",
        this.producer.producerInfo = ""
      }
      else{
        this.$refs.form2.reset()
      }
    },
    save (){
      this.$emit('atualizaProducer', this.producer)
    },
    saveSkip (){
      this.skip = 1
      //console.log(this.skip)
      this.$emit('atualizaProducer', this.producer)
    },
    addProducer(id){
        this.album.albumProducer.push(id)
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
      if (this.producer.producerName.length > 1)
        return false
      else
        return true
    } 
  }
}
</script>