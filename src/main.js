import Vue from 'vue'
import App from './App.vue'
import AlleEmner from "@/components/AlleEmner"
import Hello from "@/components/Hello"
import Enkeltemne from "@/components/Enkeltemne"
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from "vue-router"
import VueSessionStorage from "vue-sessionstorage"
Vue.use(VueSessionStorage)

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.config.productionTip = false


const routes = [
  {path: '/emner', component: AlleEmner},
  {path: '/', component: Hello},
  {path: '/emne/:id', component: Enkeltemne}
]
const router = new VueRouter({
  routes
})
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
