<template>
  <b-form-select
      v-model="selectedValue"
      :options="this.faggrupper"
      value-field="id"
      text-field="forkortelse"
      disabled-field="!active"
      @change="changedFaggruppe(selectedValue, id)"
  >
    <template #first>
      <b-form-select-option value="null">--</b-form-select-option>
    </template>
  </b-form-select>
</template>

<script>
export default {
  name: "FaggruppeSelector",
  props: ['faggrupper', 'selected', 'id'],
  data(){
    return {
      selectedValue: null
    }
  },
  methods: {
    changedFaggruppe(selected, id){
      this.$emit('changedFaggruppe', selected, id)
    }
  },
  mounted(){
    this.selectedValue = this.selected
    // console.log(this.selectedValue)
  }
}
</script>

<style scoped>

</style>