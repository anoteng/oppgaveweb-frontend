<template>
  <div>
  <multiselect
      label="name"
      track-by="id"
      :multiple="false"
      :option-height="104"
      :custom-label="customLabel"
      :show-labels="false"
    :options="kommisjoner"
    :v-model:="selectedValue"
    @select="changedKommisjon"
    :placeholder="placeholder"
    :value="selectedValue"
  >
    <template slot="singleLabel" slot-scope="props"><span class="option__desc"><span class="option__title">{{ props.option.kommisjonsnr }}</span></span></template>
    <template slot="option" slot-scope="props">
      <div class="option__desc"><span class="option__title">{{ props.option.kommisjonsnr }}</span><span class="option__small"> - {{ props.option.desc }}</span></div>
    </template>
  </multiselect>
  <b-modal id="bv-modal-nyKommisjon" hide-footer hide-header-close>
    <template #modal-title>
      Ny kommisjon {{nextKommisjon}}
    </template>
    <div class="d-block text-center">
      <h3>Kommisjonsmedlemmer</h3>

    </div>
    <ul v-for="item in this.newKommisMembers" :key="item.id">
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
  </b-modal></div>
</template>

<script>
import Api from '@/api.js'
import VeilederSelector from '@/components/VeilederSelector2'
export default {
  name: "KommisjonSelector",
  props: ['kommisjoner', 'kommisjon'],
  components: {VeilederSelector},
  data(){
    return{
      selectedValue: {
        id: 0,
        kommisMembers: [],
        kommisjonsnr: '',
        vurdenhet: 0
      },
      kommisjonerComputed: [],
      newKommisMembers: [],
      brukere: [],
      placeholder: "Velg kommisjon",
      myToggle: false,
      nextKommisjon: 0
    }
  },
  created(){
    if(this.kommisjon){
      this.selectedValue = this.kommisjon
    }
  },
  methods: {
    sensorAdded(value){
      console.log(value)
    },
    getNextKommisjon(){
      console.log(this.kommisjoner)
      let j = 1
      for(let i of this.kommisjoner){
        if(i.kommisjonsnr){
          if (i.kommisjonsnr == j){
            j++
          }else{
            this.nextKommisjon = j+1
          }
        }
      }
    },
    async getBrukere(){
      let brukere = await Api.get('brukere', 'filter=active,eq,1&join=faggrupper&join=roller&order=navn&order=fornavn')
      for(let item of brukere){
        this.brukere[item.id] = item
      }
    },
    customLabel ({ title, desc }) {
      return `${title} – ${desc}`
    },
    async changedKommisjon(value){
      this.$emit('kommisjonChanged', value, this.nextKey)
      if(value.id === -1){
        console.log('Lag ny kommisjon')
        await this.getNextKommisjon()
        this.$bvModal.show('bv-modal-nyKommisjon')
      }else{
        Api.update('vurderingsmelding', this.nextKey, {
          kommisjon: value.id
        })
      }

    },
    async closeModal(save){
      if(save){
        this.$emit('updateKommisjon', true)
        //Lagre ny kommisjon
      }
      this.$bvModal.hide('bv-modal-nyKommisjon')
      this.myToggle=false

    }

  }
}
</script>

<style scoped>
.multiselect .multiselect__content-wrapper {
  min-width: 100%;
  width: auto;
  border-top: 1px solid #e8e8e8;
}

.multiselect--active .multiselect__tags {
  border-bottom: none;
}
</style>