<template lang="pug">
  .field
    label Уровень цен для каждой категории
    .ui.left.icon.input
      input(ref="searchBox" v-model="search" placeholder="Поиск по категориям")
      i.search.icon
    div(@click="toggleCategoriesVisibility")
      span(v-if="!hideCategories" class="js-link") Свернуть все
      span(v-if="hideCategories" class="js-link") Развернуть все
    ul.categories(v-show="!hideCategories")
      li(is="category-tree", v-for="(category, index) in categories", :key="index", :model="category")

  //
</template>

<style lang="scss" scoped>
  .categories {
    cursor: pointer;
    display: inline-block;
  }
</style>

<script>
  import Categories from "../../api/categories";

  export default {
    data() {
      return {
        'categories': [],
        'hideCategories': true,
        'search': ''
      }
    },
    created() {
      Categories.getAll().then(response => {
        this.categories = response.data;
        this.$children.forEach(c => c.cascadeOpen());
      });
    },
    watch: {
      search: function (newVal) {
        this.$bus.$emit('new-category-search', newVal);
        if (newVal === '')
          setTimeout(() => this.$children.forEach(c => c.cascadeClose()), 0);
        else {
          this.hideCategories = false;
          setTimeout(() => this.$children.forEach(c => c.cascadeOpen()), 0);
        }
      }
    },
    methods: {
      toggleCategoriesVisibility() {
        this.hideCategories = !this.hideCategories;

      }
    }
  }
</script>
