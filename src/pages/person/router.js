import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'
import Register from './views/register.vue'
import ResetPass from './views/resetPass.vue'



Vue.use(Router)

const router = new Router({
  routes: [{
    path:'/login',
    name:'login',
    component:Login
  },
  {
    path:'/register',
    name:'register',
    component:Register
  },
  {
    path:'/resetPass',
    name:'reset-pass',
    component:ResetPass
  },]
})

//路由进入前，页面滚动到顶部
router.beforeEach((to, from, next) => {
  
  window.scrollTo(0,0)
  next()
})

export default router