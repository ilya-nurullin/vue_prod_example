import Cart from "../../api/cart";

const state = {
  carts: {}
};

const getters = {
  totalPrice(state) {
    return cartId => state.carts[cartId].reduce((a, b) => a + b.price * b.count, 0).toFixed(2);
  },
  formatTotalPrice(state, getters) {
    return cartId => getters.totalPrice(cartId).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
};

const actions = {
  addToCart(context, {cartId, itemToCart}) {
    return Cart.addToCart(cartId, itemToCart).then(() => {
      context.dispatch('updateCartFromServer', {cartId: cartId});
    });
  },

  updateCartFromServer(context, {cartId}) {
    return Cart.getBriefCart(cartId).then(response => {
      context.commit('setCart', {
        'cartId': cartId,
        'items': response.data.cart
      });
    })
  },

  updateCount(context, {cartId, itemToCart}) {
    return Cart.updateCount(cartId, itemToCart).then(() => {
      context.dispatch('updateCartFromServer', {cartId: cartId});
    })
  },
};

const mutations = {
  setCart(state, {cartId, items}) {
    Vue.set(state.carts, cartId, items);
  },

  truncateCart(state, cartId) {
    Vue.set(state.carts, cartId, []);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
