import 'normalize.css'
import '../../styles/base.css'
import Vue from 'vue'
import App from './App.vue'
import qs from 'qs'
import router from './router'
import axios from '../../utils/axios'
import 'element-ui/lib/theme-chalk/index.css'

import {
  Checkbox,
  Dialog,
  Button,
  Message,
  Loading
} from "element-ui";
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(Button)

Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}

Vue.use(Message)

Vue.prototype.$loading = Loading
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')