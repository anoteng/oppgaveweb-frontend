<template>
  <v-select
    :options="this.kommisjoner"
    label="kommisjonsnr"
    @input="changedKommisjon"
    :placeholder="this.placeholder"
    :value="this.selectedValue"
  ></v-select>
</template>

<script>
import Api from '@/api.js'
export default {
  name: "KommisjonSelector",
  props: ['vurdid', 'nextKey', 'kommisjoner', 'kommisjon'],
  data(){
    return{
      selectedValue: {
        id: 0,
        kommisMembers: [],
        kommisjonsnr: '',
        vurdenhet: 0
      },
      kommisjonerComputed: [],
      placeholder: "Velg kommisjon",
    }
  },
  mounted(){
    // console.log(this.kommisjoner)
    this.kommisjonerComputed.push(this.selectedValue)
    for(let i in this.kommisjoner){
      this.kommisjonerComputed.push(this.kommisjoner[i])
    }
    if(this.kommisjon){
      this.selectedValue = this.kommisjon
    }
  },
  methods: {
    changedKommisjon(value){
      this.$emit('kommisjonChanged', value, this.nextKey)
      Api.update('vurderingsmelding', this.nextKey, {
        kommisjon: value.id
      })
      this.selectedValue = value
    }
  }
}
</script>

<style scoped>

</style>