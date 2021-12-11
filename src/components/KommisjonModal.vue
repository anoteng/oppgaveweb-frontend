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
        Using <code>$bvModal</code> Methods
      </template>
      <div class="d-block text-center">
        <h3>Hello From This Modal!</h3>
      </div>
      <b-button class="mt-3" block @click="closeModal(false)">Avbryt</b-button>
      <b-button class="mt-3" block @click="closeModal(true)">Lagre</b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "KommisjonModal",
  props: ['id'],
  data(){
    return {
      myToggle: false,
      faggruppe: null,

    }
  },
  methods: {
    async closeModal(save){
      if(save){
        //Lagre ny kommisjon
      }
      this.$bvModal.hide('bv-modal-example')
      this.myToggle=false

    }
  }
}
</script>

<style scoped>

</style>