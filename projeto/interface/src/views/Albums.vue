<template>
  <v-card class="ma-2">
    <v-card-title>
      Lista de Álbuns
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="halbuns"
        :items="albuns"
        :search="search"
        :sort-by="['Nome','Artist/Group']"
        :sort-desc="[true,true]"
        multi-sort
        :footer-props="{
          showFirstLastPage: true,
          firstIcon: 'mdi-arrow-collapse-left',
          lastIcon: 'mdi-arrow-collapse-right',
          prevIcon: 'mdi-minus',
          nextIcon: 'mdi-plus'
        }"
      >
        <template v-slot:no-data>
          <v-alert :value="true" color = "warning" icon = "warning">
            Ainda nao foi possivel apresentar a lista dos álbuns
          </v-alert> 
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Albums',
  data(){
    return{
      search:'',
      halbuns:[
       {text:"Nome",sortable:true, value:'name',class:'subtitle-1'},
       {text:"Artist/Group",sortable:true, value:'creator',class:'subtitle-1'}
      ],
      albuns:[],
      lhost:'http://localhost:5001/api'
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + "/albums")
      console.log("Albuns: " + response.data)
      this.albuns = response.data
    }catch(e){
      return e
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
