<template>
  <div>
    <div id="form">
      <h3>Ainda não possui uma conta?</h3>
      <v-btn depressed link :to="`/registo`">Registe-se aqui</v-btn>
      <v-form ref="form" method="login">
        <v-container>
          <v-text-field
            label="Email"
            v-model="email"
            required            
            ></v-text-field>
          <v-text-field
            label="Password"
            type='password'
            v-model="password"
            required            
            ></v-text-field>
          <br>
          <v-btn class="red white--text" @click="postLogin">Entrar</v-btn>
          <v-row>
            <v-checkbox :label="`Manter sessão iniciada`"></v-checkbox>
          </v-row>

        </v-container>
      </v-form>
    </div>    
    <div class="centered" >

      <ul>
        <li class="centered_tab" >
          <v-btn text>Recuperar palavra passe</v-btn>
        </li>
        <li class="centered_tab">
          <v-btn text>Créditos</v-btn>
        </li>
        <li class="centered_tab">
          <v-btn text>Saber Mais</v-btn>
        </li>
        <li class="centered_tab">
          <v-btn text>Termos</v-btn>
        </li>
        <li class="centered_tab">
          <v-btn text>Privacidade</v-btn>
        </li>
      </ul>

    </div>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-text>
          Email ou password inválidos, por favor tente de novo.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
            :to="`/login`"
          >
            Fechar janela
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {  
  data(){
    return {
      email : "",
      password : "",
      dialog: false,
      ajuda:'login'
    }
  },
  methods:{
    postLogin: function () {
      axios.post('http://localhost:5001/api/users/login',{
        email: this.email,
        password: this.password
      }).then(data => {
          console.log(data)
          if (data.data.error){
            this.$refs.form.reset()
            this.dialog = !this.dialog
          }
          else if(data.data.user && (data.data.token!=undefined)){
            console.log("aaa")
            console.log('token ->' + data.data.token)
            console.log('user ->' + data.data.user._id)
            this.$store.commit("guardaTokenUtilizador", data.data.token)
            this.$store.commit("guardaNomeUtilizador", data.data.user)
            this.$router.push( {path:`/`})
          }
      }) .catch(function (error) {
            console.log(error);
      })
    }

  }
}
</script>
<style scoped>
  #login *{
            box-sizing: border-box;
  }
  #form{
            margin: 20px auto;
            max-width: 800px;
  }
  #links{
            margin: 20px auto;
            max-width: 1000px;
            justify-content: centerd;
  }
  .centered {
      text-align: center;
      width: 100%;
  }

  .centered_tab {
      float:none; /*to make sure there is no active float*/
      display: inline-block;
  }
  #checkboxes input{
            display: inline-block;
            margin-right: 10px;
  }
  #checkboxes label{
            display: inline-block;
  }
</style>
