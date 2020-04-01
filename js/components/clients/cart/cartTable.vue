<template lang="pug">
  .sixteen.wide.column
    form(method="post", :action="formAction", ref="cartForm")
      input(type='hidden', name='_token', :value="csrf")
      input(type='hidden', name='sendToClientPM', :value="sendToClientPM")
      input(type='hidden', name='sendToClientEmail', :value="sendToClientEmail")
      input(type='hidden', name='anonClientTel', :value="$parent.anonClientTel")
      input(type='hidden', name='anonClientName', :value="$parent.anonClientName")
      input(type='hidden', name='providerId', :value="providerId")
      table.ui.single.line.selectable.stackable.table(ref="table")
        thead
          tr
            th.hide-on-mobile
              span.js-link(@click="changeTableSort('article_code')") Артикул
            th(v-if="hasProviderTitle") Поставщик
            th(v-if="hasVendorCode").hide-on-mobile Код производителя
            th(v-if="hasImage") Иллюстрация
            th(v-if="hasBrand",)
              span.js-link(@click="changeTableSort('params_values.brand')").hide-on-mobile Бренд
            th.w100p
              span.js-link(@click="changeTableSort('text')") Наименование
            th(v-if="hasInPackage").hide-on-mobile В рул/упак
            th Ед. изм.
            th.hide-on-mobile(v-if="! isAnonClient") Наличие
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
            th Количество
            th
        tbody
          cart-table-row(v-for="item in itemsToShow", :key="item.id", v-if="!isLoading", :item="item",
          :briefCart="briefCart", :errorRows="errorRows", :hasInPackage="hasInPackage", :hasImage="hasImage", :hasVendorCode="hasVendorCode",
          :hasBrand="hasBrand", :cartId="cartId", :is-anon-client="isAnonClient", :hasProviderTitle="hasProviderTitle", :hasDeliveryTime="hasDeliveryTime")
          tr(v-if="isLoading")
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
  import {changeTableSort, sortTableBy} from "../../libs/table_sort";
  import {hasBrand, hasDeliveryTime, hasImage, hasInPackage, hasProviderTitle, hasVendorCode} from "../../libs/table_functions";

  export default {
    props: [
      'items',
      'briefCart',
      'isLoading',
      'showStartText',
      'showEmptyCartText',
      'errorRows',
      'cartId',
      'isSpec',
      "isAnonClient"
    ],
    data() {
      return {
        'formAction': '/cart/commit',
        'csrf': window.csrfToken,
        'colSort': {
          propName: 'article_code',
          sortType: false
        },
        'sendToClientPM': true,
        'sendToClientEmail': false,

        'providerId' : window.paramProviderId || 0,
      }
    },
    created() {
      this.$bus.$on('cartPage.changed.sendToClientPM', newVal => this.sendToClientPM = newVal);
      this.$bus.$on('cartPage.changed.sendToClientEmail', newVal => this.sendToClientEmail = newVal);
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
      hasBrand,
      hasDeliveryTime,
      hasImage,
      hasInPackage,
      hasProviderTitle,
      hasVendorCode,
      itemsToShow: function () {
        return sortTableBy(this.items, this.colSort);
      }
    },
    components: {
      'cart-table-row': require('./cartTableRow')
    },
  }
</script>
