/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

window.Vue = require('vue');
window.Vuex = require('vuex');
Vue.use(Vuex);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require("./globalHelpers");
require("./components");

const store = require('./store/store').default;

window.vueApp = new Vue({
  el: '#app',
  store
});

window.vueEventBus = new Vue();

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return window.vueEventBus;
    }
  }
});
