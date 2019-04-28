// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// !!! ?? Is store really being used here since state is set in store/index.js ??  Look into later.
/* jshint esversion: 6 */
import Vue from 'vue'
import App from './App'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'https://api.guildwars2.com'

Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#app',
  template: '<App/>',
  components: { App },
  store
})
