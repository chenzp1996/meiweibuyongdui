// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Cookies from 'js-cookie'
//引入请求库
import axios from 'axios'
import VueAxios from 'vue-axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';

Vue.config.productionTip = false
//使用vant组件库
import VueLazyload from 'vue-lazyload'
import Vant from 'vant'
import 'vant/lib/index.css'
//状态管理
import Vuex from 'vuex'
import store from './vuex/store.js'

Vue.use(Vuex)
Vue.use(Vant)
Vue.use(VueLazyload)
Vue.use(VueAxios, axios)
Vue.use(Cookies)
Vue.use(ElementUI) 

Vue.use(VueSocketio, socketio('http://localhost:3000/'));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
