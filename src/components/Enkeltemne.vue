<template>
<div>
  <b-table hover
           striped
           :items="students"
           :fields="fields"
           :sort-by.sync="sortBy"
           :sort-desc.sync="sortDesc"
           sort-icon-left
           :busy="isBusy"
           v-model="value"
  >
    <template #cell(locked)="data">
      <LockedSelector
          :selected="data.item.locked"
          v-on:toggleLocked="toggleLocked(data.item.id, $event)"
      >
      </LockedSelector>
    </template>
    <template #cell(veileder_faggruppe)="data">
      <FaggruppeSelector
        :selected="data.item.veileder_faggruppe"
        :faggrupper="data.item.faggrupper"
        :id="data.item.id"
        :nextKey="data.item.key"
      ></FaggruppeSelector>
    </template>
    <template #cell(veileder)="data">
      <VeilederSelector
          :selected="data.item.veileder"
          :veiledere="data.item.veiledere"
          :faggruppe="data.item.veileder_faggruppe"
          :id="data.item.id"
          v-if="data.item.veileder_faggruppe != null"
          :key="data.item.key"
          :nextKey="data.item.key"
      ></VeilederSelector>
    </template>
    <template #table-busy>
      <div class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>&nbsp; Henter data...</strong>
      </div>
    </template>
  </b-table>

</div>
</template>

<script>
import Api from '@/api.js'
import LockedSelector from '@/components/LockedSelector'
import FaggruppeSelector from'@/components/FaggruppeSelector'
import VeilederSelector from '@/components/VeilederSelector'
export default {
  name: "Enkeltemne",
  async created(){
    await this.refresh()
  },
  components: {
    LockedSelector,
    FaggruppeSelector,
    VeilederSelector
  },
  methods: {
    refreshVeiledere(id){
      this.componentKey[id] += 1
    },
    async refresh(){
      this.toggleBusy()
      await this.getVeiledere()
      await this.getFaggrupper()
      await this.getStudents()
      this.toggleBusy()
      this.$root.$on('TermChanged', ()=>{
        this.students = []
        this.getStudents()
      })
      this.$root.$on('faggruppeChanged', (faggruppe, student)=>{
        this.setFaggruppe(faggruppe, student)
        // this.refreshVeiledere(student)
        // let nyStudent = this.students[nextKey]
        // nyStudent.veileder_faggruppe = faggruppe
        // this.$set(this.students, nextKey, nyStudent)

      })
    },
    toggleLocked(id, state){
      console.log(id, state)
    },
    async getVeiledere(){
      this.veiledere = await Api.get('brukere',
          'filter=active,eq,1&filter=rolle,eq,2')
      for(let i in this.veiledere){
        this.veiledere[i].fullName = this.veiledere[i].navn + ', ' + this.veiledere[i].fornavn
      }
    },
    async setFaggruppe(faggruppe, vurdid){
      let data = {}
      if(faggruppe == 'null'){
        data = {
          'veileder_faggruppe': null
        }
      }else{
        data = {
          'veileder_faggruppe': faggruppe
        }
      }
      let res = await Api.update('vurderingsmelding', vurdid, data)
      console.log(res)
    },
    async getFaggrupper(){
      this.faggrupper = await Api.get('faggrupper', 'filter=active,eq,1')
      // this.faggrupper = records
    },
    toggleBusy() {
      this.isBusy = !this.isBusy
    },
    async getStudents(){
      let records = await Api.get('vurderingsmelding',
        'filter=vurderingsenhet,eq,' + this.id +
          '&join=studenter&join=brukere&join=kommisjoner,kommisMembers,brukere&join=gruppe,studenter&join=faggrupper'
      )
      let groups = await Api.get('groupMembers',
        'filter=vurdid,eq,' + this.id + '&join=groups&join=studenter')
      for(let group of groups){
        console.log(group)
      }
      for(let rec of records) {
        // console.log(rec)
        let veileder_faggruppe
        if(rec.veileder_faggruppe == null){
          veileder_faggruppe = null
        }else{
          veileder_faggruppe = rec.veileder_faggruppe.id
        }
        this.componentKey[rec.studentid.id] = rec.studentid.id + veileder_faggruppe
        console.dir(this.componentKey)
        let index = this.students.push({
          StudId: rec.studentid.id,
          id: rec.id,
          navn: rec.studentid.navn,
          epost: rec.studentid.epost,
          veileder: rec.veileder,
          veiledere: this.veiledere,
          veileder_faggruppe: veileder_faggruppe,
          faggrupper: this.faggrupper,
          kommisjon: rec.kommisjon,
          kommisjonsmedlemmer: rec.kommisjon,
          locked: rec.locked
            }) -1
        this.students[index].key = index
      }
    }
  },
  data(){
    return {
      componentKey: {},
      isBusy: false,
      sortBy: 'navn',
      sortDesc: false,
      selected: null,
      value: [],
      students: [],
      faggrupper: {},
      groups: [],
      veiledere: {},
      id: this.$route.params.id,
      fields: [
        {key: "StudId", title: "Studnr.", sortable: false},
        {key: "navn", sortable: true},
        {key: "epost", sortable: true},
        {key: "veileder_faggruppe", label: "Veiledning faggruppe", sortable: true},
        {key: "veileder", sortable: true},
        {key: "kommisjon", sortable: true},
        {key: "kommisjonsmedlemmer", sortable: true},
        {key: "locked", sortable: true, label: 'Låst'}
      ]
    }
  }
}
</script>

<style scoped>
.sr-only {display: none;}
</style>