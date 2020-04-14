<template>
  <v-card class="ma-2">
    <v-card-title>
      Lista de Grupos
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
        <template v-slot:item.options="{ item }">
          <v-btn icon :to="'/groups/' + item.id.split('#')[1]">
            <v-icon
              small
              class="mr-2"
            >
              mdi-eye
            </v-icon>
            Consultar grupo musical
          </v-btn>
        </template>
        <template v-slot:no-data>
          <v-alert :value="true" color = "warning" icon = "warning">
            Ainda nao foi possivel apresentar a lista dos grupos musicais
          </v-alert> 
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Groups',
  data(){
    return{
      search:'',
      hgroups:[
        {text:"Id",sortable:true, value:'id',filterable: false,class:'subtitle-1'},
        {text:"Nome",sortable:true, value:'name',class:'subtitle-1'},
        {text:'Options',value:'options',sortable: false}
      ],
      groups:[],
      lhost:'http://localhost:5001/api'
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