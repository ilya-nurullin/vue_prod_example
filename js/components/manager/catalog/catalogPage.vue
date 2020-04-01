<template lang="pug">
  div
    .ui.top.attached.tabular.menu
      a.item.active(data-tab='first') Каталог
      a.item(data-tab='second')
        template(v-if="!isSpec") Корзина
        template(v-if="isSpec") Спецификация
    .ui.bottom.attached.tab.segment.active.no-padding(data-tab='first')
      smart-search
      catalog-table(:cart="cart", :priceLevels="priceLevels", :categoryId="categoryId")
    .ui.bottom.attached.tab.segment(data-tab='second')
      cart-page(:cart="cart", :is-spec="isSpec", :spec-id="specId")
</template>

<style lang="scss" scoped>
  .no-padding {
    padding: 0;
  }
</style>

<script>
  import Catalog from '../../../api/catalog';

  export default {
    props: ['itemsInSpec', 'specId'],
    data() {
      return {
        cart: JSON.parse(localStorage.getItem('manager_cart')) || [],
        priceLevels: [],
        categoryId: null,
        isSpec: this.itemsInSpec != undefined && this.itemsInSpec.length > 0
      }
    },
    created() {
      this.$bus.$on('catalog.addToCart', this.addToCart);

      let url = new URL(location.href);
      let categoryId = localStorage.getItem('filteredCategoryId') || url.searchParams.get("category_id");
      this.categoryId = categoryId;
      if (! (categoryId == null || isNaN(categoryId)))
        this.loadPriceLevels(categoryId);

      this.$bus.$on('category-selected', data => this.loadPriceLevels(data.id));
      this.$bus.$on('cart.update.itemCount', data => this.updateCount(data));
      this.$bus.$on('cart.truncate', () => this.cart = []);

    },
    components: {
      'catalog-table': require('./catalogItemTable.vue'),
      'cart-page': require('./cart/cart.vue'),
    },
    mounted() {
      $('.menu .item').tab();
      if (this.itemsInSpec) {
        this.cart = [];
        Catalog.getItemsById(this.itemsInSpec.map(i => i.item_id)).then(response => {
          let fullItems = response.data;
          let cart = [];

          for(let i = 0; i < this.itemsInSpec.length; ++i) {
            let item = this.itemsInSpec[i];
            let fullItem = fullItems.filter(itm => itm.id === item.item_id)[0];
            let itemInCart = {};
            itemInCart['count'] = item.count;
            itemInCart['fullItem'] = fullItem;
            itemInCart['priceLevel'] = item.priceLevel;

            Catalog.getPriceLevels(fullItem.category_id).then(response => {
              itemInCart['priceLevels'] = response.data;
              cart.push(itemInCart);
            });
          }
          this.cart = cart;
        });
        $('.menu .item').tab('change tab', 'second');
      }
    },
    methods: {
      addToCart(payload) {
        let inCart = this.cart.filter(c => payload.fullItem.id === c.fullItem.id).pop();
        if (inCart === undefined) {
          this.cart.push(payload);
        }
        else {
          Vue.set(inCart, 'count', inCart.count + payload.count);
          Vue.set(inCart, 'priceLevel', payload.priceLevel);
        }
      },
      updateCount(payload) {
        if (payload.count === 0) {
          this.cart = this.cart.filter(c => payload.itemId !== c.fullItem.id);
        }
        else {
          let inCart = this.cart.filter(c => payload.itemId === c.fullItem.id).pop();
          if (inCart !== undefined) {
            Vue.set(inCart, 'count', payload.count);
          }
        }
      },
      loadPriceLevels(categoryId) {
        Catalog.getPriceLevels(categoryId).then(response => {
          this.priceLevels = response.data;
        });
      },
    },
    watch: {
      'cart': {
        handler: function (newVal) {
          if (!this.itemsInSpec)
            localStorage.setItem('manager_cart', JSON.stringify(newVal));
        },
        deep: true
      }
    }
  }
</script>
