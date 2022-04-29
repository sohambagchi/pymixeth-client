import Vue from 'vue'
import App from './App.vue'
// import Router from "vue-router"
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import axios from 'axios';

Vue.prototype.$http = axios;

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
// Vue.use(Router)

// const routes = [

// ]

// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')