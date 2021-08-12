import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import Links from '../components/Links.vue'
import TreeI from '../components/TreeI.vue'
import TreeII from '../components/Tree2.vue'
import RadialTidyTree from '../components/RadialTidyTree.vue'
Vue.use(VueRouter)


const routes = [
  { path: '/bar', component: HelloWorld },
  { path: '/links', component: Links },
  { path: '/tree1', component: TreeI },
  { path: '/tree2', component: TreeII },
  { path: '/radialTidyTree', component: RadialTidyTree },
];

const router = new VueRouter({
  routes, // (缩写) 相当于 routes: routes
});

export default router