<template>
  <div id="Labels">
  <v-card flat class="card">
    <v-card-title class="title">
      Label list
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
          <v-btn icon :to="'/recordLabels/' + item.id.split('#')[1]">
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
            The record label list is still loading. Wait a second
          </v-alert> 
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Labels',
  data(){
    return{
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
  created: async function(){
    try{
      let response = await axios.get(this.lhost + "/recordLabels")
      this.labels = response.data
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
  #Labels {
        background-image: url("../assets/man-in-a-recording-studio-3925032.jpg");
        background-color: #cccccc;
        min-height: 100%;
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