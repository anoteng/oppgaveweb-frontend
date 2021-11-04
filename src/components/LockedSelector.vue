<template>
  <b-form-select
      v-model="selected"
      :options="options"
      v-on:change="$emit('toggleLocked', selected)"
  ></b-form-select>
</template>

<script>
export default {
  name: "LockedSelector",
  props: ['selected'],
  data(){
    return {
      options: [
        {value: true, text: 'låst'},
        {value: false, text: 'ulåst'}],
    }
  }
}
</script>

<style scoped>

</style>