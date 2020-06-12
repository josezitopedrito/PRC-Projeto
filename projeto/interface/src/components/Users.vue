<template>
  <div id="Request">
  <v-card flat class="card">
    <v-card-title class="title">
      User List
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-data-table
        class="table"
        :headers="husers"
        :items="users"
        :sort-by="['Username','Email','Type','Options']"
        :sort-desc="[true,true,true,false]"
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
          <v-spacer></v-spacer>
          <v-btn icon @click="eraseUser(item.email)">
            <v-icon
              small
              class="mr-2"
            >
              mdi-eye
            </v-icon>
            Erase User
          </v-btn>
        </template>
        <template v-slot:no-data>
          <v-alert :value="true" color = "warning" icon = "warning">
            The requests list is still loading. Wait a second
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
      husers:[
       {text:"Username",sortable:true, value:'username',class:'subtitle-1'},
       {text:"Email",sortable:true, value:'email',class:'subtitle-1'},
       {text:"Type",sortable:true, value:'tipo',class:'subtitle-1'},
       {text:'Options',value:'options',sortable: false,class:'subtitle-1'}
      ],
      users:[],
      lhost:'http://localhost:5001/api'
    }
  },
  methods:{
      eraseUser : async function (id){
          try{
              confirm("Are you sure you want to erase this user?") && await axios.delete(this.lhost + '/users/' + id,{headers: { token: `${this.$store.state.jwt}`, type:`${this.$store.state.user.tipo}` }})
              this.$router.go("/users")
          } catch(e){
              console.log(e)
          }
      }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + "/users/",{headers: { token: `${this.$store.state.jwt}`, type:`${this.$store.state.user.tipo}` }})
      this.users = response.data
    }catch(e){
      return e
    }
  }
}
</script>
