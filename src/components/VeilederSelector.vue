<template>
 <b-form-select
  :v-model="selectedValue"
  :options="this.veiledereComputed"
  v-if="faggruppe == this.faggruppe"
  value-field="id"
  text-field="fullName"
  @change="changedVeileder(selectedValue, id)"
 >

 </b-form-select>
</template>

<script>
export default {
  name: "VeilederSelector",
  props: ['veiledere', 'selected', 'id', 'faggruppe', 'nextKey'],
  data(){
    return {
      selectedValue: null,
      veiledereComputed: []
    }
  },
  created() {
    this.filter(this.faggruppe)
    this.$root.$on('faggruppeChanged', (faggruppe, student, nextKey)=>{
      if(nextKey == this.nextKey){
        this.veiledereComputed = []
        this.filter(faggruppe)
      }
    })
  },
  mounted(){
    this.selectedValue = this.selected
    // console.log(this.selectedValue)
  },
  methods: {
    changedVeileder(selected, id){
      // console.log(selected)
      this.$root.$emit('veilederChanged', selected, id)
    },
    filter(faggruppe){
      for(let veileder of this.veiledere) {
        if (veileder.faggruppe == faggruppe) {
          this.veiledereComputed.push(veileder)
        }
      }
    }
  },
}
</script>

<style scoped>

</style>