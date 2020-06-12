<template>
  <div id="Request">
  <v-card flat class="card">
    <v-card-title class="title">
      Request List
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
        :headers="hpedidos"
        :items="pedidos"
        :search="search"
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
          <v-btn icon @click="confirmRegistration(item)">
            <v-icon
              small
              class="mr-2"
            >
              mdi-eye
            </v-icon>
            Confirm Request
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="eraseRegistration(item.email)">
            <v-icon
              small
              class="mr-2"
            >
              mdi-eye
            </v-icon>
            Erase Request
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
  name: 'Pedidos',
  data(){
    return{
      search:'',
      hpedidos:[
       {text:"Username",sortable:true, value:'username',class:'subtitle-1'},
       {text:"Email",sortable:true, value:'email',class:'subtitle-1'},
       {text:"Type",sortable:true, value:'tipo',class:'subtitle-1'},
       {text:'Options',value:'options',sortable: false,class:'subtitle-1'}
      ],
      pedidos:[],
      lhost:'http://localhost:5001/api'
    }
  },
  methods:{
      confirmRegistration : async function (item){
          try{
              confirm("Are you sure you want to accept this request?") && await axios.post(this.lhost + '/users/pedidos',{
                            user:item
                        },{headers: { token: `${this.$store.state.jwt}`, type:`${this.$store.state.user.tipo}` }})
              this.$router.go("/pedidos")
          } catch(e){
              console.log(e)
          }
      },
      eraseRegistration : async function (id){
          try{
              confirm("Are you sure you want to erase this request?") && await axios.delete(this.lhost + '/users/pedidos/' + id,{headers: { token: `${this.$store.state.jwt}`, type:`${this.$store.state.user.tipo}` }})
              this.$router.go("/pedidos")
          } catch(e){
              console.log(e)
          }
      }
  },
  created: async function(){
    try{
      let response = await axios.get(this.lhost + "/users/pedidos",{headers: { token: `${this.$store.state.jwt}`, type:`${this.$store.state.user.tipo}` }})
      this.pedidos = response.data
    }catch(e){
      return e
    }
  }
}
</script>
