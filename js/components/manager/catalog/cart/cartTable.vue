<template lang="pug">
  .sixteen.wide.column
    table.ui.single.line.selectable.stackable.table(ref="table")
      thead
        tr
          th
            span.js-link(@click="changeTableSort('fullItem.article_code')") Артикул
          th(v-if="hasImage") Иллюстрация
          th(v-if="hasBrand",)
            span.js-link(@click="changeTableSort('fullItem.params_values.brand')") Бренд
          th.w100p
            span.js-link(@click="changeTableSort('fullItem.text')") Наименование
          th(v-if="hasInPackage") В рул/упак
          th Ед. изм.
          th Наличие
          th Уровень цен
          th
            span.js-link(@click="changeTableSort('fullItem.user_price', Number)") Цена
          th Количество
      tbody
        cart-table-row(v-for="(item, index) in itemsToShow", :key="item.fullItem.id", v-if="!isLoading", :item="item",
          :errorRows="errorRows", :hasInPackage="hasInPackage", :hasImage="hasImage",
          :hasBrand="hasBrand")
        tr(v-if="isLoading || isLoadingSpec")
          td(colspan=100, class="loading") Загрузка ...
        tr(v-if="showEmptyCartText")
          td(v-if="!isSpec", colspan=100, class="loading") Корзина пуста
          td(v-if="isSpec", colspan=100, class="loading") Пустая спецификация
  //
</template>

<style lang="scss" scoped>
  /deep/ {
    img {
      max-width: 100%;
      max-height: 4rem;
    }
    .image-wrapper {
      text-align: center !important;
    }
  }

  table {
    margin: 1rem 0 !important;
  }

  td.loading {
    text-align: center;
    font-size: 2rem;
  }
</style>

<script>
  import {changeTableSort, sortTableBy} from "../../../libs/table_sort";

  export default {
    props: [
      'items',
      'isLoading',
      'showStartText',
      'showEmptyCartText',
      'errorRows',
      'isSpec'
    ],
    data() {
      return {
        'colSort': {
          propName: 'article_code',
          sortType: false
        }
      }
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
    methods: {
      changeTableSort
    },
    computed: {
      hasInPackage: function () {
        return this.items.some(i => i.fullItem.params_values.in_package != null);
      },
      hasImage: function () {
        return this.items.some(i => i.fullItem.image != null);
      },
      hasBrand: function () {
        return this.items.some(i => i.fullItem.params_values.brand != null);
      },
      itemsToShow: function () {
        return sortTableBy(this.items, this.colSort);
      },
      isLoadingSpec: function () {
        return this.isSpec && this.items.length === 0;
      }
    },
    components: {
      'cart-table-row': require('./cartTableRow')
    },
  }
</script>
