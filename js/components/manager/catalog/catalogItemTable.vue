<template lang="pug">
  .sixteen.wide.column
    table.ui.single.line.selectable.stackable.table(ref="table")
      thead
        tr
          th
            span.js-link(@click="changeTableSort('article_code')") Артикул
          th(v-if="hasImage") Иллюстрация
          th(v-if="hasBrand")
            span.js-link(@click="changeTableSort('params_values.brand')") Бренд
          th.w100p
            span.js-link(@click="changeTableSort('text')") Наименование
          th(v-if="hasInPackage") В рул/упак
          th Ед. изм.
          th Наличие
          th Уровень цен
          th
            span.js-link(@click="changeTableSort('user_price', Number)") Цена
          th.d-flex
            div.fg-1 В корзину
            i.icon.cog
      tbody
        item-table-row(v-for="(item, index) in itemsToShow", :key="item.id", v-if="!isLoading", :item="item", :hasInPackage="hasInPackage",
          :hasImage="hasImage", :hasBrand="hasBrand", :priceLevels="priceLevels", :cart="cart")
        tr(v-if="isLoading")
          td(colspan=100, class="loading") Загрузка ...
        tr(v-if="showStartText")
          td(colspan=100, class="loading") Для начала выберите категорию
        tr(v-if="showEmptyCategoryText && ! isLoading")
          td(colspan=100, class="loading") Ничего не найдено
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

  td.loading {
    text-align: center;
    font-size: 2rem;
  }
</style>

<script>
  import Catalog from '../../../api/catalog';
  import {changeTableSort, sortTableBy} from "../../libs/table_sort";

  export default {
    props: ['cart', 'priceLevels', 'categoryId'],
    data() {
      return {
        'items': [],
        'colSort': {
          propName: 'article_code',
          sortType: false
        },
        'isLoading': false,
        'showStartText': false,
        'showEmptyCategoryText': false,
      }
    },
    components: {
      'item-table-row': require('./catalogItemTableRow.vue')
    },
    created() {
      let categoryId = this.categoryId;
      if (categoryId == null || isNaN(categoryId))
        this.showStartText = true;
      else {
        this.loadItemsByCategoryId(categoryId);
      }

      this.$bus.$on('category-selected', (data) => this.loadItemsByCategoryId(data.id));
      this.$bus.$on('reset-filters', this.clearItems);
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
      hasInPackage: function () {
        return this.items.some(i => i.params_values.in_package != null);
      },
      hasImage: function () {
        return this.items.some(i => i.image != null);
      },
      hasBrand: function () {
        return this.items.some(i => i.params_values.brand != null);
      },
      itemsToShow: function () {
        return sortTableBy(this.items, this.colSort);
      }
    },
    methods: {
      loadItemsByCategoryId(categoryId) {
        this.showStartText = false;
        this.isLoading = true;
        Catalog.getItemsInCategory(categoryId).then(response => {
          this.items = response.data;
          this.isLoading = false;
          this.showEmptyCategoryText = response.data.length === 0;
        });
      },
      clearItems() {
        this.items = [];
        this.showStartText = true;
      },
      changeTableSort
    }
  }
</script>
