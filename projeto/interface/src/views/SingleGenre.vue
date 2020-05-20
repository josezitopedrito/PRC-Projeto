<template>
    <SingleGenre v-if="renderComponent" @changePage=changePage($event)></SingleGenre>
</template>
<script>
import SingleGenre from '@/components/SingleGenre.vue'
export default {
  name: 'Principal',
  components: {
    SingleGenre
  },
  data(){
    return{
      renderComponent:true
    }
  },
  methods:{
    changePage: async function(){
      this.renderComponent = false
      this.$nextTick(() =>{
        this.renderComponent = true
      })
    }
  }
}
</script>