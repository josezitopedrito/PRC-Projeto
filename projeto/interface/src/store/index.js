import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:{},
    jwt:''
  },
  plugins:[createPersistedState()],
  mutations: {
    guardaTokenUtilizador(state, token) {
      state.jwt = token;
    },
    guardaNomeUtilizador(state, user) {
      state.user = user;
    },
    eliminarToken(state){
      state.user = {}
      state.jwt = ''
    }
  },
  getters:{
    isAuthenticated (state) {
      if (!state.jwt || state.jwt.split('.').length < 3) {
        return false
      }
      const data = JSON.parse(atob(state.jwt.split('.')[1]))
      const exp = new Date(data.exp * 1000) // JS deals with dates in milliseconds since epoch
      const now = new Date()
      return now < exp
    },
    isAdmin(state){
      if(state.user.tipo != 'Admin' ){
        return false
      }
      return true
    }
  },
  actions: {
  },
  modules: {
  }
})
