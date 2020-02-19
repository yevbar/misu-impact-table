import Vue from 'vue'
import VTooltip from 'v-tooltip'
import App from './App.vue'

Vue.use(VTooltip)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
