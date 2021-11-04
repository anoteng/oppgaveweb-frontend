<template>
  <b-nav tabs>
<!--    <b-nav-text>OppgaveWeb</b-nav-text>-->

    <b-nav-item v-for="link in navLinks" :to="link.href" :key="link.key">{{link.title}}</b-nav-item>
    <b-nav-item target="_blank" href="https://studntnu.sharepoint.com/sites/TeamSite/2906/_layouts/15/WopiFrame.aspx?sourcedoc={1031454c-f6c3-4db8-be02-5e2bf083f039}&action=edit&wd=target%28%2F%2FStartside%20-%20Landing%20page.one%7Cc7f4920f-e57b-4ece-8962-07985e4187d3%2FIBM%20Administrasjonsguide%7Cc13dff82-908d-4612-ae29-1a44f2f109aa%2F%29">Administrasjonsguiden</b-nav-item>
    <Semestervelger/>

  </b-nav>
</template>

<script>
import Semestervelger from './Semestervelger'
export default {
  components: {
    Semestervelger
  },
  data(){
    return{
      navLinks: [
        {key: 'home', href: '/', title: 'OppgaveWeb', active: true},
        {key: 'emner', href: '/emner', title: 'Alle emner'},

      ]
    }
  },
  name: "NavBar"
}
</script>

<style scoped>

</style>