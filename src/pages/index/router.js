import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'

import axios from '../../utils/axios'
import {redirectToLogin} from '../../utils/common'
import storage from '../../utils/storage'
import { apiPath,pubPath, shPath } from "./config";

Vue.use(Router)

const router = new Router({
  routes: [{
    path:'/',
    name:'home',
    component:Home
  },
  {
    path: '/panorama',
    name: 'panorama',
    component: () => import( /* webpackChunkName: "panorama" */ './views/panorama.vue')
  },
  {
    path: '/history',
    name: 'history',
    component: () => import( /* webpackChunkName: "history" */ './views/history.vue')
  },
  {
    path: '/guide',
    name: 'guide',
    component: () => import( /* webpackChunkName: "guide" */ './views/guide.vue')
  },
  {
    path: '/scene',
    name: 'scene',
    component: () => import( /* webpackChunkName: "scene" */ './views/scene.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import( /* webpackChunkName: "search" */ './views/search.vue')
  },
  {
    path: '/tourist',
    name: 'tourist',
    component: () => import( /* webpackChunkName: "tourist" */ './views/tourist.vue')
  },
  {
    path: '/public',
    name: 'public',
    component: () => import( /* webpackChunkName: "public" */ './views/public.vue')
  },

  {
    path: '/spotList',
    name: 'spotList',
    component: () => import( /* webpackChunkName: "spotList" */ './views/spotList.vue')
  },
  {
    path: '/spotDetail',
    name: 'spotDetail',
    component: () => import( /* webpackChunkName: "spotDetail" */ './views/spotDetail.vue')
  },
  {
    path: '/myNoteList',
    name: 'myNoteList',
    component: () => import( /* webpackChunkName: "myNoteList" */ './views/myNoteList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/publicNoteList',
    name: 'publicNoteList',
    component: () => import( /* webpackChunkName: "publicNoteList" */ './views/publicNoteList.vue')
  },
  {
    path: '/myComplainList',
    name: 'myComplainList',
    component: () => import( /* webpackChunkName: "myComplainList" */ './views/myComplainList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/myComplainDetail',
    name: 'myComplainDetail',
    component: () => import( /* webpackChunkName: "myComplainDetail" */ './views/myComplainDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/myConsultList',
    name: 'myConsultList',
    component: () => import( /* webpackChunkName: "myConsultList" */ './views/myConsultList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/myConsultDetail',
    name: 'myConsultDetail',
    component: () => import( /* webpackChunkName: "myConsultDetail" */ './views/myConsultDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/noteDetail',
    name: 'noteDetail',
    component: () => import( /* webpackChunkName: "noteDetail" */ './views/noteDetail.vue')
  },
  {
    path: '/noteEditor',
    name: 'noteEditor',
    component: () => import( /* webpackChunkName: "noteEditor" */ './views/noteEditor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/publicDetail',
    name: 'publicDetail',
    component: () => import( /* webpackChunkName: "publicDetail" */ './views/publicDetail.vue')
  },
  {
    path: '/trainTime',
    name: 'trainTime',
    component: () => import( /* webpackChunkName: "trainTime" */ './views/trainTime.vue')
  },
  {
    path: '/busTime',
    name: 'busTime',
    component: () => import( /* webpackChunkName: "busTime" */ './views/busTime.vue')
  },
  {
    path: '/publicTime',
    name: 'publicTime',
    component: () => import( /* webpackChunkName: "publicTime" */ './views/publicTime.vue')
  },
  {
    path: '/transportLive',
    name: 'transportLive',
    component: () => import( /* webpackChunkName: "transportLive" */ './views/transportLive.vue')
  },
    {
      path: '/importantNews',
      name: 'importantNews',
      component: () => import( /* webpackChunkName: "importantNews" */ './views/importantNews.vue')
    },
    {
      path: '/popularConsultation',
      name: 'popularConsultation',
      component: () => import( /* webpackChunkName: "popularConsultation" */ './views/popularConsultation.vue')
    },
    {
      path: '/popularConsultationDetail',
      name: 'popularConsultationDetail',
      component: () => import( /* webpackChunkName: "popularConsultationDetail" */ './views/popularConsultationDetail.vue')
    }],
    scrollBehavior (to, from, savedPosition) {
      // return 期望滚动到哪个的位置
      return { x: 0, y: 0 }
    }
})

//路由进入前，页面滚动到顶部，并且全局检测登录状态
router.beforeEach((to, from, next) => {
  //alert(111)
  console.log(from)
  let token = storage.get('token')
  if(token){
    //if(to.meta.requiresAuth){
      Vue.prototype.$axios.get(shPath + "/user/checkLogin?version="+ new Date().getTime()).then((res)=>{
        let {code,msg} = res.data
        if(code !== 0){
          storage.remove('token')
          storage.remove('account')
        }
      })
    //}
    
  }
  
  //window.scrollTo(0,0)
  next()
})

export default router