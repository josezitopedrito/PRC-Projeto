<template>
  <div id="Groups">
  <v-card flat class="card">
    <v-card-title class="title">
      Group list
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
        class="table"
        :headers="hgroups"
        :items="groups"
        :search="search"
        :sort-by="['Name','Options']"
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
          <v-btn icon :to="'/groups/' + item.id.split('#')[1]">
            <v-icon
              small
              class="mr-2"
            >
              mdi-eye
            </v-icon>
            Individual page
          </v-btn>
        </template>
        <template v-slot:no-data>
          <v-alert :value="true" color = "warning" icon = "warning">
            The group list is still loading. Wait a second
          </v-alert> 
        </template>
      </v-data-table>
    </v-card-text>
    <v-toolbar class="card" flat>
      <div class="spacer"></div>
      <v-btn to="/" style="background-color:darkgrey;">Main Menu</v-btn>
    </v-toolbar>
  </v-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Groups',
  data(){
    return{
      search:'',
      hgroups:[
        // {text:"Id",sortable:true, value:'id',filterable: false,class:'subtitle-1'},
        {text:"Name",sortable:true, value:'name',class:'subtitle-1'},
        {text:'Options',value:'options',sortable: false,class:'subtitle-1'}
      ],
      groups:[],
      lhost:'http://localhost:5001/api'
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + "/groups")
      this.groups = response.data
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
  #Groups {
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
    .table{
        background-color: rgba(255,255,255,0.5);
    }
    .title{
        color:aliceblue;
    }
    .card {
      background-color: transparent!important;
      opacity: 1;
    }
</style>