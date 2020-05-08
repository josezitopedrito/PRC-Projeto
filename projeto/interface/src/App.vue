<template>
  <v-app>
    <v-content>
      <!-- A navDraw é so para ser permitida a users registados -->
      <navDraw></navDraw>
      <router-view></router-view>
      <appFooter></appFooter>
    </v-content>
  </v-app>
</template>

<script>

import Footer from './components/footer.vue'
import NavDraw from './components/navDraw.vue'
export default {

  components: {
    'appFooter':Footer,
    'navDraw': NavDraw
  },

  data: () => ({
    //
  }),
};
</script>