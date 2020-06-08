<template>
  <div id="Albums">
  <v-card flat class="card">
    <v-card-title class="title">
      Favorite Artists
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-data-table
        class="table"
        :headers="hartists"
        :items="artists"
        :sort-by="['Artist Name','Number of votes','Options']"
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
          <v-btn icon :to="'/artists/' + item.artist.split('#')[1]">
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
            The artist list is still loading. Wait a second
          </v-alert> 
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <v-card flat class="card">
    <v-card-title class="title">
      Favorite Albums
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-data-table
        class="table"
        :headers="halbums"
        :items="albums"
        :sort-by="['Album Name','Number of votes','Options']"
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
          <v-btn icon :to="'/albums/' + item.album.split('#')[1]">
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
            The album list is still loading. Wait a second
          </v-alert> 
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <v-card flat class="card">
    <v-card-title class="title">
      Favorite Groups
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-data-table
        class="table"
        :headers="hgroups"
        :items="groups"
        :sort-by="['Group Name','Number of votes','Options']"
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
          <v-btn icon :to="'/groups/' + item.group.split('#')[1]">
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
  </v-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data(){
    return{
      search:'',
      hartists:[
       {text:"Artist Name",sortable:true, value:'name',class:'subtitle-1'},
       {text:'Number of votes',value:'artistvotes',sortable: true,class:'subtitle-1'},
       {text:'Options',value:'options',sortable: false,class:'subtitle-1'}
      ],
      halbums:[
       {text:"Album Name",sortable:true, value:'name',class:'subtitle-1'},
       {text:'Number of votes',value:'albumvotes',sortable: true,class:'subtitle-1'},
       {text:'Options',value:'options',sortable: false,class:'subtitle-1'}
      ],
      hgroups:[
       {text:"Group Name",sortable:true, value:'name',class:'subtitle-1'},
       {text:'Number of votes',value:'groupvotes',sortable: true,class:'subtitle-1'},
       {text:'Options',value:'options',sortable: false,class:'subtitle-1'}
      ],
      item:{artist:[""],group:[""],album:[""]},
      artists:[],
      albums:[],
      groups:[],
      lhost:'http://localhost:5001/api'
    }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + "/albums/favoritos")
      this.artists = response.data.artists
      this.groups = response.data.groups
      this.albums = response.data.albums
      alert(JSON.stringify(response))
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
    #Albums {
        background-color: indigo;
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
    .title{
        color:aliceblue;
    }
    .card {
      background-color: transparent!important;
      opacity: 1;
    }
</style>
