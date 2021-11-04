<template>
  <div>
    <b-nav-form>
      <b-form-group
          label="Semestervelger"
      >
        <b-form-select
            v-model="selected"
            :options="options"
            @change="changeTerm(selected)"
        ></b-form-select>

      </b-form-group>
    </b-nav-form>

  </div>
</template>

<script>
import api from '@/api'
export default {
  name: "Semestervelger",
  data (){
    return{
      options: [],
      selected: this.$session.get('currentTerm')
    }
  },
  async created (){
    await this.getOptions()
  },
  methods: {
    async getOptions(){
      let options = await api.getSemesters()
      for(let option of options){
        // console.log(option)
        let obj = {
          value: option.id,
          text: option.year + '-' + option.month
        }
        this.options.push(obj)
      }
      // console.log(this.options)
    },
    changeTerm (term) {
      this.$session.set('currentTerm', term)
      console.log('Changed term to: ' + this.$session.get('currentTerm'))
      this.$root.$emit('TermChanged', term)
    }
  }

}
</script>

<style scoped>

</style>