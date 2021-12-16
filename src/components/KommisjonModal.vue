<template>
  <div>
    <b-button
        id="show-btn"
        size="sm"
        pill
        :pressed.sync="myToggle"
        @click="$bvModal.show('bv-modal-example')">Rediger</b-button>
    <b-modal id="bv-modal-example" hide-footer>
      <template #modal-title>
        Rediger kommisjon
      </template>
      <div class="d-block text-center">
        <h3>Kommisjonsmedlemmer</h3>

      </div>
      <ul v-for="item in this.kommisjon.kommisMembers" :key="item.id">
        <li><a :href="'mailto:' + item.userID.email">{{item.userID.navn}}, {{item.userID.fornavn}}</a></li>
      </ul>
      <div>
        <VeilederSelector
          :veiledere="this.brukere"
          :onlySupervisors="false"
          @sensorAdded="sensorAdded"
        ></VeilederSelector>
      </div>
      <b-button class="mt-3" block @click="closeModal(false)">Avbryt</b-button>
      <b-button class="mt-3" block @click="closeModal(true)">Lagre</b-button>
    </b-modal>
  </div>
</template>

<script>
import VeilederSelector from '@/components/VeilederSelector2'
export default {
  name: "KommisjonModal",
  props: ['kommisjon', 'brukere'],
  data(){
    return {
      myToggle: false,
      faggruppe: null,

    }
  },
  methods: {
    changedFaggruppe(id) {
      console.log('faggruppe: ' + id)
      this.faggruppe = id[0]
    },
    sensorAdded(sensor){
      console.log('sensorAdded: ' + sensor)
    },
    async closeModal(save){
      if(save){
        //Lagre ny kommisjon
      }
      this.$bvModal.hide('bv-modal-example')
      this.myToggle=false
      this.$emit('updateKommisjon', true)
    }
  },
  components: { VeilederSelector}
}
</script>

<style scoped>

</style>