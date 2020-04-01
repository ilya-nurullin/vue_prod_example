<template lang="pug">
  .field
    label Уровень цен для каждой категории
    .ui.left.icon.input
      input(ref="searchBox" v-model="search" placeholder="Поиск по категориям")
      i.search.icon
    span(@click="togglePriceLevelsVisibility")
      span(v-if="!hidePriceLevels" class="js-link") Свернуть все
      span(v-if="hidePriceLevels" class="js-link") Развернуть все
    ul.categories(v-show="!hidePriceLevels")
      price-level-input(v-for="(markupGroup, index) in markupGroups", :markupGroup="markupGroup", :key="markupGroup.id",
        :priceLevels="[anyValPriceLevel, ... priceLevels[markupGroup.id], disabledValPriceLevel]", :search="search", @showAll="showAll")
</template>

<style lang="scss" scoped></style>

<script>
  import Categories from "../../api/categories";

  export default {
    data() {
      return {
        'hidePriceLevels': true,
        'markupGroups': [],
        'search': '',
        'priceLevels': [],
        'priceLevelId': null,
        'hasError': false,
        'anyValPriceLevel': {
          'id': null,
          title: 'Своя наценка',
          value: 0.99
        },
        'disabledValPriceLevel': {
          'id': '__disabled__',
          title: 'Нет',
          value: 0.00
        }
      }
    },
    components: {
      'price-level-input': require('./priceLevelInput')
    },
    created() {
      Categories.getMarkupGroups().then(response => {
        this.markupGroups = response.data;
      });

      this.priceLevels = window._.groupBy(window.priceLevels, 'markup_group_id');
    },
    methods: {
      togglePriceLevelsVisibility: function () {
        this.hidePriceLevels = !this.hidePriceLevels;
      },
      showAll() {
        this.hidePriceLevels = false;
      }
    },
    watch: {
      'search': function (newVal) {
        if (newVal !== "")
          this.hidePriceLevels = false;
      }
    }
  }
</script>
