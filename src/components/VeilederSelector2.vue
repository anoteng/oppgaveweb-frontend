<template>
  <div>
    <multiselect
      v-model="selected"
      :options="hits"
      :loading="isLoading"
      placeholder="Søk etter person"
      label="full_name"
      id="ajax"
      :internal-search="false"
      :options-limit="10"
      :limit="3"
      :limit-text="limitText"
      :show-no-result="false"
      :hide-selected="true"
      :multiple="false"
      :searchable="true"
      @search-change="asyncFind"
      @input="changedVeileder"
    ></multiselect>
  </div>
</template>

<script>
import {findUser} from '@/searchPeople'

export default {
  name: "VeilederSelector",
  props: ['veiledere', 'onlySupervisors', 'preSelected'],
  data(){
    return {
      selected: [],
      veiledereComputed: [],
      isLoading: false,
      hits: [],
    }
  },
  created() {
    if(this.preSelected){
      this.selected = this.preSelected
    }
  },
  mounted(){
  },
  components: {},
  methods: {
    asyncFind(query){
      this.isLoading = true
      findUser(query, 1, this.onlySupervisors).then(response => {
        this.hits = response
        this.isLoading = false
      })
    },
    limitText (count) {
      return `og ${count} andre`
    },
    changedVeileder(selected){
      console.log(selected.id)
      this.$emit('sensorAdded', selected.id)
    },
  },
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