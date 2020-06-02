import Vue from 'vue'
import Router from 'vue-router'

import Admin from '../view/admin/Admin.vue'
import Login from '../view/login/Login2.vue'
import Leader from '../view/leader/Leader'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    },
    {
      path:'/leader',
      name:'Leader',
      component:Leader
    }
  ]
})
