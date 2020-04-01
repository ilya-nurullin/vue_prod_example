<template lang="pug">
  div
    .search-box.d-flex.flex-column
      .d-flex.mb-1
        categories-button(ref="categories-button", :categories="categories")
        //filters-button(ref="filters-button")
        span.ui.search.fg-1.mr-1
          .ui.icon.input.w100p.ml-1
            input#smartSearchInput.prompt(type='text', placeholder='Интеллектуальный поиск', v-model="searchText",
              @input="debouncedLoadItemsFromSearch")
            i.search.link.icon(v-if="searchText.length === 0")
            i.times.link.icon(v-if="searchText.length !== 0", @click="clearSearchText")
          .results
      .d-flex.flex-column
        .fg-1.mb-1(v-if="filteredCategory != ''") Категория:
          span.category  {{ filteredCategory }}&nbsp;
          i.icon.close.pointer(@click="clearCategory")
        .d-flex.flex-wrap(v-if="needToShowFilters")
          span.mr-1.mb-1(v-for="(filter, title) in availableFilters")
            dropdown(:data="filter", :title="title", :key="title", ref="dropdown")

      div(v-if="filteredCategory != '' || needToShowFilters")
        button.text(@click="resetFilters")
          i.icon.close
          |  очистить фильтры
</template>

<style lang="scss" scoped>
  @import "!/sass/_adaptivity.scss";

  /deep/ div.btnWrapper {
    position: relative;

    .window {
      position: absolute;
      top: 110%;
      left: 0;
      height: 70vh;
      width: 30vw;
      overflow-y: auto;
      min-width: 500px;

      @include mobile {
        width: 93vw;
        height: 85vh;
        min-width: unset !important;
      }
    }
  }

  .category {
    color: #00B0F0;
  }

  .filters {
    color: #92D050;
  }
</style>

<script>
  import Categories from "../../../api/categories";

  export default {
    components: {
      'categories-button': require('./categoriesButton'),
      'filters-button': require('./filtersButton'),
      'tree': require('./tree'),
      'dropdown': require('./dropdown'),
    },
    data() {
      return {
        'categories': [],
        'searchText': ''
      };
    },
    created() {
      Categories.getAllButEmpty().then(response => {
        this.categories = response.data;
        this.readCategoryId();
      });


      if (this.needToShowFilters)
        this.$store.dispatch('catalogItems/loadAvailableFilters');

      this.debouncedLoadItemsFromSearch = _.debounce(this.searchTextChanged, 300);
    },
    mounted() {
      $('select.ui.dropdown').dropdown();
    },
    computed: {
      filteredCategory: function () {
        if (this.categories.length === 0)
          return "";

        let categoryId = this.categoryId;
        if (categoryId == null || isNaN(categoryId))
          return "";

        function inOrder(nodes) {
          let results = [];
          for (let i = 0; i < nodes.length; ++i) {
            let node = nodes[i];
            if (node.id === categoryId) return [node.title];

            if (node.children.length > 0) {
              results.push(inOrder(node.children));
            }
          }
          return results.filter(s => s !== undefined)[0];
        }

        return inOrder(this.categories)[0];
      },
      categoryId: function () {
        return this.$store.state.catalogItems.categoryId;
      },
      availableFilters: function () {
        return this.$store.state.catalogItems.availableFilters;
      },
      needToShowFilters: function () {
        return !!this.$store.state.catalogItems.categoryId || !!this.$store.state.catalogItems.searchText;
      },
    },
    methods: {
      readCategoryId() {
        let url = new URL(location.href);
        let catId = url.searchParams.get("category_id") || localStorage.getItem('filteredCategoryId');
        this.$store.dispatch('catalogItems/setCategoryIdAndLoadItems', parseInt(catId));
        if (!!catId)
          localStorage.setItem('filteredCategoryId', catId);
      },
      resetFilters() {
        this.$store.dispatch('catalogItems/resetAllAndLoadItems');
        this.searchText = '';

        if (!!this.$refs.dropdown)
          this.$refs.dropdown.forEach(d => d.value = []);

        this.forgetCategoryId();
      },
      searchTextChanged() {
        this.$store.dispatch('catalogItems/setSearchTextAndLoadItems', this.searchText);
        this.resetFiltersIfNeeded();
      },
      clearCategory() {
        this.forgetCategoryId();
        this.$store.dispatch('catalogItems/resetCategoryIdAndLoadItems');
      },
      forgetCategoryId() {
        history.pushState({}, '', window.removeUrlParameter(location.href, 'category_id'));
        localStorage.removeItem('filteredCategoryId');
      },
      clearSearchText() {
        this.searchText = "";
        this.searchTextChanged();
      },
      resetFiltersIfNeeded() {
        if (!this.needToShowFilters)
          this.resetFilters();
      }
    },
    watch: {
      categoryId: function () {
        this.resetFiltersIfNeeded();
      }
    }
  }
</script>
