<template>
  <div id="registar">
      <v-card height="100%" width="100%">
        <v-card-title>
          <!-- <h1>Página de Registo</h1> -->
        </v-card-title>
        <v-card-actions>
            <v-row
            class="fill-height"
            align="center"
            justify="center"
            >
            <div>
                <h1>Página de Registo</h1>
                <h3>Já possui uma conta?</h3>
                <v-btn depressed link :to="`/login`">Faça o login</v-btn>
                <v-alert v-if="message.length > 0" type="warning">
                  {{ message }}
                </v-alert>
                <v-form ref="form" method="post" enctype="multipart/form-data">
                    <v-container>
                        <v-text-field
                            label="Username"
                            v-model="pedido.username"
                            required                      
                        ></v-text-field>
                        <v-text-field
                        label="Password"
                        type='password'
                        v-model="pedido.pw"
                        required            
                        ></v-text-field>
                        <v-text-field
                            label="Email"
                            v-model="pedido.email"
                            :rules="[rules.required, rules.email]"
                            required                     
                        ></v-text-field>
                        <v-container fluid>
                        <label>Tipo</label>
                        <v-radio-group v-model="pedido.tipo" column >
                            <v-radio label="Admin" value="Admin"></v-radio>
                            <v-radio label="Leitor" value="Leitor"></v-radio>
                        </v-radio-group>
                        </v-container>
                        <br>
                        <v-btn class="blue white--text" @click.prevent="reset">Reset</v-btn>
                        <v-btn ref="submit" class="green white--text" @click="post()" v-bind:class="{disabled: disableButton}" :disabled="disableButton" >Submeter</v-btn>
                    </v-container>
                </v-form>
                </div>
            </v-row>
          </v-card-actions>
      </v-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return{
      message:"",
      pedido:{
        username:"",
        pw:"",
        email:"",
        tipo:"",
      },
      dialog:false,
      ajuda:'registo',
      valid:true,
      rules: {
          required: value => !!value || 'Required.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if(pattern.test(value)){
              this.valid = true
            }else{
              this.valid = false
            }
            return pattern.test(value) || 'Invalid e-mail.'
          },
      },
    }
  },
  methods:{
    post: function() {
        axios.post('http://localhost:5001/api/users/registo',{
            email: this.pedido.email,
            username: this.pedido.username,
            password: this.pedido.pw,
            tipo: this.pedido.tipo
        },
        {
          headers:{
            token:`${this.$store.state.jwt}`
          },
        }).then((data) => {
            console.log(data.data.status)
            this.reset(data.data.status)
            if(data.data.status=="inserido")
              this.$router.push( {path:`/login`})
        }).catch(e => {
            console.log(e)
            this.errors.push(e)
        })
    },
    reset (status) {
      this.$refs.form.reset()
      this.pedido.username=''
      this.pedido.pw=''
      this.pedido.email=''
      this.pedido.tipo = false
      this.message=status
      console.log(this.message.length)
    }
  },
  created(){
    this.pedido.username=''
    this.pedido.pw=''
    this.pedido.email=''
    this.pedido.tipo = false
  },
  computed:{
    disableButton (){
        if(this.pedido.username){
            if (this.valid && this.pedido.username.length > 0 && this.pedido.pw.length > 0 && this.pedido.email.length > 0  && this.pedido.tipo)
                return false
            else
                return true
        }
        else{
            return true
        }
    } 
  }
}
</script>
<style scoped>
  #registar *{
            box-sizing: border-box;
  }
  #registar{
            margin: 20px auto;
            max-width: 800px;
            margin-bottom: 80px;
  }
  #checkboxes input{
            display: inline-block;
            margin-right: 10px;
  }
  #checkboxes label{
            display: inline-block;
  }
</style>
