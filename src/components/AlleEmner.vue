<template>
  <div id="app">
    <b-table hover
             striped
             :items="courses"
             :fields="fields"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             sort-icon-left
             @row-clicked="onClick"
             :busy="isBusy"
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>&nbsp;Henter data...</strong>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import Api from '@/api.js'
import * as Data from '@/dataClass.js'
export default {
  name: "AlleEmner",
  components: {}
  ,
  data(){
    return{
      sortBy: 'emnekode',
      isBusy: false,
      sortDesc: false,
      courses: [],
      fields: [
        {key: 'emnekode', sortable: true,
          thClass: 'text-left',
          tdClass: 'text-left'},
        {key: 'emnenavn', sortable: true,
          thClass: 'text-left',
          tdClass: 'text-left'},
        {key: 'emneansvarlig', sortable: true,
          thClass: 'text-left',
          tdClass: 'text-left'},
        {key: 'faggruppe', sortable: true,
          thClass: 'text-left',
          tdClass: 'text-left'},
        {key: 'antall_komplett', sortable: false,
          thClass: 'text-left',
          tdClass: 'text-left'},
        {key: 'veileder/kommisjon', sortable: false,
          thClass: 'text-left',
          tdClass: 'text-left'}
      ]
    }
  },
  async created(){
    this.emner = new Data.emner(this.$session.get('currentTerm'))
    this.emner.loadCourses()
    .then(()=>{
      this.courses.loadCourseStats()
      .then(()=>{
        this.courses = this.emner.courses
      })
    })

    this.$root.$on('TermChanged', ()=>{
      this.courses = []
      this.getCourses()
    })
  },
  methods: {
    async getCourses() {
      this.isBusy = true
      let records = await Api.get('vurderingsenhet', 'filter=termin,eq,' + this.$session.get('currentTerm') + '&join=emner,brukere&join=emner,faggrupper')
      for(let record of records){
        let stats = await this.getCourseStats(record.id)
        this.courses.push(
            {emnekode: record.emne.emnekode,
              emnenavn: record.emne.emnenavn,
              emneansvarlig: record.emne.emneansvarlig.fornavn.charAt(0) + '. ' + record.emne.emneansvarlig.navn,
              faggruppe: record.emne.faggruppe.forkortelse,
              antall_komplett: stats.komplett + '/' + stats.antall,
              'veileder/kommisjon': stats.veileder + '/' + stats.kommisjon,
              id: record.id
            }
        )
      }
      this.isBusy = false
    },
    async getCourseStats(id){
      let res = await Api.get('vurderingsmelding', 'filter=vurderingsenhet,eq,' + id)
      let stats = {
        antall: 0,
        komplett: 0,
        veileder: 0,
        kommisjon: 0
      }
      for(let melding in res){
        stats.antall += 1
        if(melding.locked){
          stats.komplett += 1
        }
        if(melding.veileder){
          stats.veileder += 1
        }
        if(melding.kommisjon){
          stats.kommisjon += 1
        }
      }
      return stats
    },
    onClick(item){
      // console.log(item)
      this.$router.push({path: `/emne/${item.id}`})
    }
  },

}
</script>

<style scoped>
.sr-only {display: none;}
</style>