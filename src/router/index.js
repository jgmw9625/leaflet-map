import Vue from 'vue'
import VueRouter from 'vue-router'
import Foo from '@/components/HelloWorld'

Vue.use(VueRouter)

const routes = [
  { path: '/home', component: Foo },
]

const router = new VueRouter({
  routes,
})

export default router