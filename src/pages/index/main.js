import 'normalize.css'
import '../../styles/base.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from '../../utils/axios'
import {
  Select,
  Option,
  Input,
  Button,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Form,
  FormItem,
  Upload,
  Message,
  Loading,
  MessageBox
} from "element-ui";
import 'element-ui/lib/theme-chalk/index.css'
import Share from 'vue-social-share'
import 'vue-social-share/dist/client.css'
import '../../styles/resetPage.css'

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(Select);
Vue.use(Option);
Vue.use(Dialog);
Vue.use(Input);
Vue.use(Button);
Vue.use(Table);
Vue.use(Form);
Vue.use(Upload);
Vue.use(FormItem);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Share);


Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}

Vue.use(Message)
MessageBox.install = function (Vue, options) {
  Vue.prototype.$confirm = MessageBox
}

Vue.use(MessageBox)

Vue.prototype.$loading = Loading


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')