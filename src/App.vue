<template>
  <div id="app">
    <b-container fluid>
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
.container {
  margin-left: 100px;
  margin-right: 100px;
}
</style>
