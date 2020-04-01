<template lang="pug">
  tr(:class="{ 'error': errorRows.includes(item.id.toString()) }")
    td.hide-on-mobile {{ item.article_code }}
    td(v-if="hasProviderTitle") {{ item.provider_title }}
    td(v-if="hasVendorCode").hide-on-mobile {{ item.params_values.vendor_code }}
    td(v-if="hasImage").no-padding
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
          input(type='number', min="0", :max="item.count", v-model.number="count", @blur="updateCount", :name="'cart['+item.id+']'", :readonly="isCartLoading")
    td.no-padding.price-mobile-deformation
      .d-flex.flex-line-center
        b.text-padding
          | =
        span.text-padding {{ countInCart }}
    td.price-mobile-deformation
      button.ui.red.icon.button(type="button", @click="removeItemFromCart", :disabled="isCartLoading")
        i.ui.icon(:class="[isCartLoading ? 'spinner loading' : 'close']")
  //
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
      width: auto !important;
      display: inline-block !important;
    }
    .add-rub-mobile::after {
      content: ' руб';
    }
  }
</style>

<script>
  import {additionalPrintablePrices, deliveryTime} from "../../libs/table_row_functions";

  export default {
    props: [
      'item',
      'briefCart',
      'errorRows',
      'hasInPackage',
      'hasImage',
      'hasBrand',
      'cartId',
      'hasVendorCode',
      'hasProviderTitle',
      'isAnonClient',
      'hasDeliveryTime'
    ],
    data() {
      return {
        'count': this.toUserInputCount(),
        'isCartLoading': false,
        'imageSrc': window.itemImageSrc(this.item.image),
      }
    },
    created() {
      this.$bus.$on('full-cart-updated', () => {
        // checkme: possible problem with updating the number of items in cart
        setTimeout(() => this.count = this.toUserInputCount(), 0);
      });
    },
    methods: {
      updateCount() {
        this.isCartLoading = true;
        this.$store.dispatch('cart/updateCount', {
          'cartId': this.cartId,
          'itemToCart': {
            'itemId': this.item.id,
            'count': this.count
          }
        }).then(() => {
          this.isCartLoading = false;
          this.$bus.$emit('cart-item-count-updated');
        });
      },
      removeItemFromCart() {
        this.count = 0;
        this.updateCount();
      },
      toUserInputCount() {
        return this.briefCart[this.item.id] / this.item.multiplicity;
      }
    },
    computed: {
      userPrintablePrice: function () {
        return parseFloat(this.item.user_price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
