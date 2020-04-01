<template lang="pug">
  tr
    td
      .d-flex.flex-column
        div {{ item.article_code }}
        .d-flex
          button.text
            i.star.icon
          button.text A
    td(v-if="hasImage").no-padding.image-wrapper
      a.item-image-popup(:href="imageSrc", v-if="iHaveImage")
        img(:src="imageSrc")
    td(v-if="hasBrand") {{ item.params_values.brand }}
    td.white-space-normal {{ item.text }}
    td(v-if="hasInPackage") {{ item.params_values.in_package }}
    td {{ item.params_values.units }}
    td {{ item.count }}
    td
      select.ui.dropdown(v-model="selectedPriceLevel")
        option(:value="0") Себестоимость
        option(v-for="(val, index) in priceLevels", :key="index", :value="val.id") {{ val.title }} ({{ (val.value * 100).toFixed(2) }}%)
    td
      span(v-if="additionalPrintablePrices === ''") {{ userPrintablePrice }}
      b(v-else) {{ userPrintablePrice }} (за {{ item.params_values.units }})
      span(v-html="additionalPrintablePrices")
    td
      .ui.input.mr-1
        input(type='number', v-model.number="count", :max="item.count - inCart", min="1")
      button.ui.icon.red.button(@click="addToCart", :disabled="isCartLoading || selectedPriceLevel === 0")
        i.icon(:class="[isCartLoading ? 'spinner loading' : 'shopping cart']")
      br
      small.color-red(v-if="inCart > 0") {{ inCart }} в корзине
</template>

<style lang="scss" scoped>
  .ui.input.mr-1 {
    width: 5rem;
  }

  .no-padding {
    padding: 0 !important;
  }
</style>

<script>
  export default {
    props: [
      'item',
      'hasInPackage',
      'hasImage',
      'hasBrand',
      'priceLevels',
      'cart'
    ],
    data() {
      return {
        'count': 1,
        'isCartLoading': false,
        'imageSrc': window.itemImageSrc(this.item.image),
        'selectedPriceLevel': 0
      }
    },
    methods: {
      addToCart() {
        this.$bus.$emit('catalog.addToCart', {
          fullItem: this.item,
          count: this.count,
          priceLevel: this.selectedPriceLevel,
          priceLevels: this.priceLevels
        });
        this.count = 1;
      }
    },
    computed: {
      price() {
        let price = this.item.user_price;
        if (this.selectedPriceLevel === 0)
          return price;
        return (price * (1 + parseFloat(this.priceLevels.filter(l => l.id === this.selectedPriceLevel)[0].value))).toFixed(2);
      },
      inCart() {
        // let cartItems =  || [];
        let nullableItemArray = this.cart.filter(c => c.fullItem.id === this.item.id);
        if (nullableItemArray.length === 0)
          return 0;
        return nullableItemArray[0].count;
      },
      userPrintablePrice: function () {
        return moneyFormat(this.price);
      },
      iHaveImage: function () {
        return this.item.image != null;
      },
      additionalPrintablePrices: function () {
        let params = this.item.params_values;
        let res = "";
        let price = this.price;

        if (params.package_price && parseInt(params.in_package) > 1) {
          res += "<br>" + moneyFormat(price * parseInt(params.in_package)) + ' (за рул/упак)';

          if (params.additional_price === true) {
            let length = params["Длина (м)"];
            let width = params["Ширина (м)"];

            if (length !== undefined && width !== undefined) {
              res += '<br>' + moneyFormat(price * parseInt(params.in_package || 1) / length / width) + " (за кв м)";
            }
          }
        }

        return res;
      }
    }
  }
</script>
