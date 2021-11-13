<template>
  <div>
    <KommisjonDiv :kommisjon="kommisjon" :nextKey="this.nextKey" v-if="kommisjon != null"></KommisjonDiv>
    <KommisjonSelector
        :vurdid="this.vurdId"
        :nextKey="this.nextKey"
        :kommisjoner="this.kommisjoner"
    ></KommisjonSelector>
  </div>

</template>

<script>
import KommisjonDiv from "@/components/KommisjonDiv";
import KommisjonSelector from "@/components/KommisjonSelector";
export default {
  name: "Kommisjon",
  components: {
    KommisjonSelector,
    KommisjonDiv
  },
  props: ['kommisjon', 'id', 'nextKey', 'kommisjoner'],
  created(){
    console.log('Props: ' + this.kommisjoner)
  },
  data(){
    return {
      vurdId: this.$route.params.id
    }
  }
}
</script>

<style scoped>

</style>