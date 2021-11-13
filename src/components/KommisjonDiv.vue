<template>
  <div>
    <kommisjon-modal
      :id="this.kommisjon"
    ></kommisjon-modal>
    <span
        v-for="item in this.kommisjon.members"
        :key="item.id">
      <a :href="'mailto:' + item.userID.email">{{item.userID.navn}}, {{item.userID.fornavn}}</a>,
    </span>
  </div>
</template>

<script>
import Api from '@/api'
import KommisjonModal from "@/components/KommisjonModal";
export default {
  name: "KommisjonDiv",
  created(){
    this.getKommisjonMembers()
    this.$root.$on('kommisjonChanged', (kommisjon, nextKey)=>{
      if(nextKey == this.nextKey){
        this.kommisjon = kommisjon
        this.getKommisjonMembers()
        console.log(kommisjon)
      }
    })
  },
  props: ['kommisjon', 'nextKey'],
  methods: {
    async getKommisjonMembers(){
      this.kommisjonMembers = []
      this.kommisjonMembers = await Api.get('kommisMembers', 'filter=kommisId,eq,' + this.kommisjon)
    }
  },
  data(){
    return {
      kommisjonMembers: []
    }
  },
  components: {
    KommisjonModal
  }
}
</script>

<style scoped>

</style>