import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as VeeValidate from 'vee-validate'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faTimes,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faUserShield
} from '@fortawesome/free-solid-svg-icons'

library.add(faTimes,
    faUser,
    faUserPlus,
    faSignInAlt,
    faSignOutAlt,
    faUserShield)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VeeValidate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')