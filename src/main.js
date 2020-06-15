import '@babel/polyfill';
import 'mutationobserver-shim';
//官方插件
import Vue from 'vue';
import './plugins/bootstrap-vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

//自訂插件
import App from './App.vue';
import router from './router';
import './bus';
import currencyFilter from './Filter/currency';

Vue.component('Loading',Loading);
Vue.filter('currency',currencyFilter);

//將登入存入cookies
axios.defaults.withCredentials = true;

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


router.beforeEach((to, from, next) => {
  console.log('to:',to,'from:', from,'next:', next);
  if(to.meta.requiresAuth){
    const api = 'https://vue-course-api.hexschool.io/api/user/check';
    axios.post(api).then((response) => {
      console.log(response.data)
    if(response.data.success){
        next();
      }else{
        next({
          path: '/login',
        })
      }
      })
  }else{
    next();
  }
})