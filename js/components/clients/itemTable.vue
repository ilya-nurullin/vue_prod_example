<template lang="pug">
  .sixteen.wide.column
    table.ui.single.line.selectable.stackable.table(ref="table")
      thead
        tr
          th.hide-on-mobile
            span.js-link(@click="changeTableSort('article_code')") Артикул
          th(v-if="hasProviderTitle") Поставщик
          th(v-if="hasVendorCode").hide-on-mobile Код производителя
          th(v-if="hasImage") Иллюстрация
          th(v-if="hasBrand").hide-on-mobile
            span.js-link(@click="changeTableSort('params_values.brand')") Бренд
          th.w100p
            span.js-link(@click="changeTableSort('text')") Наименование
          th(v-if="hasInPackage").hide-on-mobile В рул/упак
          th Ед. изм.
          th.hide-on-mobile(v-if="!isAnonClient") Наличие
          th.hide-on-mobile(v-if="hasDeliveryTime")
            | Срок
            br
            | поставки
          th
            span.js-link(@click="changeTableSort('user_price', Number)") Цена
          th
            | Отгрузка
            br
            | кратно
          th
            div.fg-1 В корзину
      tbody
        item-table-row(v-for="item in itemsToShow", :key="item.id", v-if="!isLoading", :item="item", :hasInPackage="hasInPackage",
          :hasImage="hasImage", :hasBrand="hasBrand", :hasVendorCode="hasVendorCode", :cartId="cartId", :is-spec="isSpec",
          :is-anon-client="isAnonClient", :hasProviderTitle="hasProviderTitle", :hasDeliveryTime="hasDeliveryTime")
        tr(v-if="isLoading")
          td(colspan=100, class="loading") Загрузка ...
        tr(v-if="items.length === 0 && ! isLoading")
          td(colspan=100, class="loading") Ничего не найдено
  //
</template>

<style lang="scss" scoped>
  @import "!/sass/_adaptivity.scss";

  /deep/ {
    img {
      max-width: 100%;
      max-height: 4rem;
    }
    .image-wrapper {
      text-align: center !important;
    }
  }

  td.loading {
    text-align: center;
    font-size: 2rem;
  }

  table thead th {
    position: sticky;
    top: 0;
    z-index: 3;

    @include mobile {
      position: relative;
    }
  }
</style>

<script>
  import {changeTableSort, sortTableBy} from "../libs/table_sort";
  import {hasBrand, hasDeliveryTime, hasImage, hasInPackage, hasProviderTitle, hasVendorCode} from "../libs/table_functions";

  export default {
    props: {
      cartId: Number,
      isSpec: Boolean,
      isAnonClient: Boolean,
    },
    data() {
      return {
        'colSort': {
          propName: '',
          sortType: false
        },
      }
    },
    components: {
      'item-table-row': require('./itemTableRow')
    },
    created() {
      let url = new URL(location.href);
      let categoryId = localStorage.getItem('filteredCategoryId') || url.searchParams.get("category_id");

      this.$store.commit('catalogItems/setCategoryId', categoryId);

      if (categoryId == null || isNaN(categoryId))
        this.showStartText = true;
      else
        this.$store.dispatch('catalogItems/loadFilteredItems');

      this.$store.dispatch('cart/updateCartFromServer', {cartId: this.cartId});
    },
    mounted() {
      $(this.$refs.table).magnificPopup({
        delegate: 'a.item-image-popup',
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
        image: {
          verticalFit: true
        },
        zoom: {
          enabled: true,
          duration: 300 // don't foget to change the duration also in CSS
        }
      });
    },
    computed: {
      hasInPackage,
      hasImage,
      hasBrand,
      hasVendorCode,
      hasProviderTitle,
      hasDeliveryTime,
      itemsToShow: function () {
        if (this.colSort.propName === '')
          return this.items;
        return sortTableBy(this.items, this.colSort);
      },
      items: function () {
        return this.$store.state.catalogItems.items;
      },
      isLoading: function () {
        return this.$store.state.catalogItems.isLoading;
      }
    },
    methods: {
      changeTableSort
    }
  }
</script>
