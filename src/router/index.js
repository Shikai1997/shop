import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import login from '../components/pages/login'
import dashboard from '../components/Dashboard'
import Products from '../components/pages/Products'

Vue.use(VueRouter)

  const routes = [
  {
    // 亂輸入網址導向
    path: '*',
    redirect: 'login',
  },
  {
    path: '/',
    name: 'login',
    component: login,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/admin',
    name: 'Home',
    component: dashboard,
    children: [{
      path: 'Products',
      name: 'Products',
      component: Products, 
      meta: { requiresAuth: true }
    }]
  },
]

const router = new VueRouter({
  routes
})

export default router
