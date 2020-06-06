<template>
  <v-app>
    <v-content>
      <!-- A navDraw é so para ser permitida a users registados -->
      <Appheader></Appheader>
      <navDraw v-if="$store.state.jwt != ''"></navDraw>
      <router-view></router-view>
      <appFooter></appFooter>
    </v-content>
  </v-app>
</template>

<script>

import header from './components/header.vue'
import Footer from './components/footer.vue'
import NavDraw from './components/navDraw.vue'
export default {

  components: {
    'Appheader':header,
    'appFooter':Footer,
    'navDraw': NavDraw
  },

  data: () => ({
    //
  })
};
</script>
