<template lang="pug">
  a.item(:href="myHref", :class="{'active': active}")
    i.icon.shopping.cart
    | Корзина
    span.ui.red.label {{ cartItems.length }} стр.
    span.ui.red.label(v-if="cartItems.length > 0") {{ totalPrice }} руб.
</template>


<style scoped lang="scss">

</style>

<script>
  export default {
    props: ['cartId', 'active', 'myHref'],
    computed: {
      totalPrice() {
        return this.$store.getters['cart/formatTotalPrice'](this.cartId);
      },
      cartItems() {
        return this.$store.state.cart.carts[this.cartId] || []
      },
    },
    mounted() {
      this.$store.dispatch('cart/updateCartFromServer', {cartId: this.cartId});
    }
  }
</script>
