export default new Vuex.Store({
  modules: {
    cart: require('./modules/cart').default,
    catalogItems: require('./modules/catalogItems').default
  }
});
