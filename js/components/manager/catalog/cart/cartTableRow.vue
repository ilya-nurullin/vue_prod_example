<template lang="pug">
  tr(:class="{ 'error': errorRows.includes(item.fullItem.id.toString()) }")
    td {{ item.fullItem.article_code }}
    td(v-if="hasImage").no-padding
      a.item-image-popup(:href="imageSrc", v-if="iHaveImage")
        img(:src="imageSrc")
    td(v-if="hasBrand") {{ item.fullItem.params_values.brand }}
    td.white-space-normal {{ item.fullItem.text }}
    td(v-if="hasInPackage") {{ item.fullItem.params_values.in_package }}
    td {{ item.fullItem.params_values.units }}
    td {{ item.fullItem.count }}
    td
      select.ui.dropdown(v-model="item.priceLevel", :name="'priceLevel['+item.fullItem.id+']'")
        option(v-for="(val, index) in item.priceLevels", :key="index", :value="val.id") {{ val.title }} ({{ (val.value * 100).toFixed(2) }}%)
    td
      span(v-if="additionalPrintablePrices === ''") {{ userPrintablePrice }}
      b(v-else) {{ userPrintablePrice }} (за {{ item.fullItem.params_values.units }})
      span(v-html="additionalPrintablePrices")
    td
      .ui.input.mr-1
        input(required, type='number', min="0", v-model.number="count", @input="updateCount", :name="'cart['+item.fullItem.id+']'", :readonly="isCartLoading")
      button.ui.red.icon.button(type="button", @click="removeItemFromCart", :disabled="isCartLoading")
        i.ui.icon(:class="[isCartLoading ? 'spinner loading' : 'close']")
  //
</template>

<style lang="scss" scoped>
  .ui.input.mr-1 {
    width: 5rem;
  }

  select.ui.dropdown {
    width: auto;
  }

  .no-padding {
    padding: 0 !important;
  }
</style>

<script>
  export default {
    props: [
      'item',
      'errorRows',
      'hasInPackage',
      'hasImage',
      'hasBrand',
    ],
    data() {
      return {
        'count': this.item.count,
        'isCartLoading': false,
        'imageSrc': window.itemImageSrc(this.item.fullItem.image),
      }
    },
    created() {
      this.$bus.$on('catalog.addToCart', () => {
        this.count = this.item.count;
      });
    },
    methods: {
      updateCount() {
        this.$bus.$emit('cart.update.itemCount', { itemId: this.item.fullItem.id, count: this.count });
      },
      removeItemFromCart() {
        this.count = 0;
        this.updateCount();
      }
    },
    computed: {
      price() {
        let price = this.item.fullItem.user_price;
        if (this.item.priceLevel === 0)
          return price;
        return (price * (1 + parseFloat(this.item.priceLevels.filter(l => l.id === this.item.priceLevel)[0].value))).toFixed(2);
      },
      userPrintablePrice: function () {
        return parseFloat(this.price).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      },
      iHaveImage: function () {
        return this.item.fullItem.image != null;
      },
      additionalPrintablePrices: function () {
        let params = this.item.fullItem.params_values;
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
