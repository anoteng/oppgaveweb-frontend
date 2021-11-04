<template>
  <div id="app">
    <b-container>
      <NavBar/>
      <router-view></router-view>
    </b-container>

  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  },
  mounted(){
    if(!this.$session.get('currentTerm')){
      this.$session.set('currentTerm', '218')
    }
  }
}
</script>

<style>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/

  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
.sr-only {display: none !important;}
}
</style>
