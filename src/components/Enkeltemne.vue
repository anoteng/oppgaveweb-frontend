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
<!--    <template #cell(veileder_faggruppe)="data">-->
<!--&lt;!&ndash;      {{this.faggrupper[data.item.veileder.faggruppe].forkortelse}}&ndash;&gt;-->
<!--      {{data.item.veileder !== null ? faggrupper : 'false'}}-->

<!--    </template>-->
    <template #cell(veileder)="data">
      <VeilederSelector
          :preSelected="data.item.veileder"
          :veiledere="brukere"
          onlySupervisors="true"
          @sensorAdded="settVeileder($event, data.item.id)"
      ></VeilederSelector>
    </template>
    <template #cell(gruppe)="data">
      <input type="number" :value="data.item.gruppe" style="width:50%" maxlength="2"/>
    </template>
    <template #cell(kommisjon)="data">
      <KommisjonSelector
        :kommisjon="data.item.kommisjon"
        :kommisjoner="kommisjoner"
        :nextKey="data.item.id"
      >

      </KommisjonSelector>
    </template>
    <template #cell(kommisjonsmedlemmer)="data">
      <KommisjonDiv
          :kommisjon="data.item.kommisjon"
          :kommisjoner="kommisjoner"
          :nextKey="data.item.id"
          :id="data.item.id"
          :vurdid="id"
          :brukere="brukere"
          :faggrupper="faggrupper"
          @kommisjonChanged="refreshKommisjoner"
      >

      </KommisjonDiv>
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
import VeilederSelector from '@/components/VeilederSelector2'
import KommisjonSelector from '@/components/KommisjonSelector'
import KommisjonDiv from "@/components/KommisjonDiv";
export default {
  name: "Enkeltemne",
  async created(){
    await this.getFaggrupper()

    await this.refresh()
    await this.refreshKommisjoner()
    this.$root.$on('kommisjonCreated', async ()=>{
      await this.refreshKommisjoner()
    })

    this.$root.$on('faggruppeChanged', (faggruppe, student)=>{
      this.setFaggruppe(faggruppe, student)
    })
    this.$root.$on('updateBrukere', async ()=>{
      await this.getBrukere()
    })
  },
  components: {
    LockedSelector,
    VeilederSelector,
    KommisjonSelector,
    KommisjonDiv
  },
  computed: {

  },
  methods: {

    settVeileder(veileder, id){
      console.log(id, veileder)
      Api.update('vurderingsmelding', id, 'veileder=' + veileder)
    },
    async refreshKommisjoner(){
      let kommisjoner = await Api.get('kommisjoner', 'filter=vurdenhet,eq,' + this.id)
      for(let kommisjon of kommisjoner){
        let members = await Api.get('kommisMembers', 'filter=kommisId,eq,' + kommisjon.id + '&join=brukere')
        this.kommisjoner.push({
          id: kommisjon.id,
          kommisjonsnr: kommisjon.kommisjonsnr,
          vurdenhet: kommisjon.vurdenhet,
          members: members
        })
      }
      console.log(this.kommisjoner)
    },
    async refresh(){
      this.toggleBusy()
      // await this.getFaggrupper()
      await this.getStudents()
      await this.getBrukere()

      this.toggleBusy()

    },
    async getBrukere(){
      let brukere = await Api.get('brukere', 'filter=active,eq,1&join=faggrupper&join=roller&order=navn&order=fornavn')
      for(let item of brukere){
        this.brukere[item.id] = item
      }
    },
    toggleLocked(id, state){
      console.log(id, state)
    },
    toggleBusy() {
      this.isBusy = !this.isBusy
    },
    async getFaggrupper(){
      let faggrupper = await Api.get('faggrupper', 'filter=active,eq,1')
      for(let i of faggrupper){
        this.faggrupper[i.id] = i
      }
      // this.faggrupper = records
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
        let veileder_faggruppe
        if(rec.veileder == null){
          veileder_faggruppe = ''
        }else{
          veileder_faggruppe = this.faggrupper[rec.veileder.faggruppe].forkortelse
        }
        let index = this.students.push({
          StudId: rec.studentid.id,
          id: rec.id,
          navn: rec.studentid.navn,
          epost: rec.studentid.epost,
          veileder: rec.veileder,
          veileder_faggruppe: veileder_faggruppe,
          kommisjon: rec.kommisjon,
          kommisjoner: this.kommisjoner,
          kommisjonsmedlemmer: rec.kommisjon,
          locked: rec.locked
            }) -1
        this.students[index].key = index
      }
    }
  },
  data(){
    return {
      brukere: {},
      isBusy: false,
      sortBy: 'navn',
      sortDesc: false,
      selected: null,
      value: [],
      students: [],
      faggrupper: {},
      kommisjoner: [],
      groups: [],
      id: this.$route.params.id,
      fields: [
        {key: "StudId", title: "Studnr.", sortable: false},
        {key: "navn", sortable: true},
        {key: "epost", sortable: true},
        {key: "veileder_faggruppe", label: "Veiledning faggruppe", sortable: true},
        {key: "veileder", sortable: true, thStyle: {width: "30%"}},
        {key: "kommisjon", sortable: true},
        {key: "kommisjonsmedlemmer", sortable: true},
        {key: "gruppe", sortable: true, label: 'Gruppe'},
        {key: "locked", sortable: true, label: 'Låst'},
      ]
    }
  }
}
</script>

<style scoped>
.sr-only {display: none;}
</style>