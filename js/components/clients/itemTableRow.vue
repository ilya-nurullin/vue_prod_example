<template lang="pug">
  tr
    td.hide-on-mobile
      .d-flex.flex-column
        div {{ item.article_code }}
    td(v-if="hasProviderTitle") {{ item.provider_title }}
        //.d-flex
        //  button.text
        //    i.star.icon
        //  button.text A
    td(v-if="hasVendorCode").hide-on-mobile {{ item.params_values.vendor_code }}
    td(v-if="hasImage").no-padding.image-wrapper
      a.item-image-popup(:href="imageSrc", v-if="iHaveImage")
        img(:src="imageSrc")
    td(v-if="hasBrand").hide-on-mobile {{ item.params_values.brand }}
    td.white-space-normal {{ item.text }}
    td(v-if="hasInPackage").hide-on-mobile {{ item.params_values.in_package }}
    td {{ item.params_values.units }}
    td.hide-on-mobile(v-if="! isAnonClient") {{ item.count }}
    td.hide-on-mobile(v-if="hasDeliveryTime") {{ deliveryTime }}
    td
      span(v-if="additionalPrintablePrices === ''").add-rub-mobile {{ userPrintablePrice }}
      b(v-else) {{ userPrintablePrice }} (за {{ item.params_values.units }})
      span(v-html="additionalPrintablePrices")
    td.no-padding.price-mobile-deformation
      .d-flex.flex-line-center.flex-justify-space-between
        span.text-padding {{ item.multiplicity }} {{ item.params_values.units }}
        b.text-padding &times;
        .ui.input
          input(type='number', v-model.number="count", :max="item.count - inCart", min="1")
    td.no-padding.price-mobile-deformation
      .d-flex.flex-column
        small.color-red.text-align-center(v-if="inCart > 0") &nbsp;
        div.d-flex.flex-line-center.flex-justify-space-between
          b.text-padding
            | =
          span.text-padding {{ countInCart }}
          button.ui.icon.red.button(@click="addToCart", :disabled="isCartLoading")
            i.icon(:class="[isCartLoading ? 'spinner loading' : 'shopping cart']")
        small.color-red.text-align-center(v-if="inCart > 0")
          | {{ inCart }}
          span(v-if="!isSpec")  в корзине
          span(v-if="isSpec")  в спец-ии
</template>

<style lang="scss" scoped>
  @import "!/sass/_adaptivity.scss";

  .ui.input {
    width: 5.5rem;
  }

  .no-padding {
    padding: 0 !important;
  }

  .text-padding {
    padding-left: 3px;
    padding-right: 3px;
  }

  @include mobile {
    .ui.table tr > td.price-mobile-deformation {
      width: 50% !important;
      display: inline-block !important;
    }
    .add-rub-mobile::after {
      content: ' руб';
    }
  }
</style>

<script>
  import {additionalPrintablePrices, deliveryTime} from "../libs/table_row_functions";

  export default {
    props: [
      'item',
      'hasInPackage',
      'hasImage',
      'hasBrand',
      'cartId',
      'isSpec',
      'hasVendorCode',
      'isAnonClient',
      'hasProviderTitle',
      'hasDeliveryTime'
    ],
    data() {
      return {
        'count': 1,
        'isCartLoading': false,
        'imageSrc': window.itemImageSrc(this.item.image)
      }
    },
    methods: {
      addToCart() {
        if (this.count < 1) {
          alert("Количество товара не может быть меньше 1");
          this.count = 1;
          return;
        }
        this.isCartLoading = true;
        this.$store.dispatch('cart/addToCart', {
          cartId: this.cartId,
          itemToCart: {
            'itemId': this.item.id,
            'count': this.count
          }
        }).then(() => {
          this.count = 1;
          this.isCartLoading = false;
          this.$bus.$emit('cart-item-count-updated');
        });
      }
    },
    computed: {
      inCart() {
        let cartItems = this.$store.state.cart.carts[this.cartId] || [];
        let nullableItemArray = cartItems.filter(x => x.itemId === this.item.id);
        if (nullableItemArray.length === 0)
          return 0;
        return nullableItemArray[0].count;
      },
      userPrintablePrice: function () {
        return moneyFormat(this.item.user_price);
      },
      iHaveImage: function () {
        return this.item.image != null;
      },
      countInCart() {
        return this.count * parseInt(this.item.multiplicity);
      },
      deliveryTime,
      additionalPrintablePrices
    }
  }
</script>
