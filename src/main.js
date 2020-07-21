import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VeeValidate from 'vee-validate'
// import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm'
// import {ValidationObserver} from 'vee-validate'
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
// Vue.component('ValidationProvider', ValidationProvider)
// Vue.component('ValidationObserver', ValidationObserver)

Vue.use(VeeValidate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')