<template lang="pug">
  div.btnWrapper
    button.ui.labeled.icon.blue.button(@click="toggleWindow")
      i.folder.open.icon
      | Каталог
    .window(v-if="windowVisible")
      ul.categories
        li(is="tree", v-for="(category, index) in myCartegories", :key="index", :model="category")
      div.others(v-if="othersCartegories.length > 0")
        hr
        p Товары наших партнеров
        ul.categories
          li(is="tree", v-for="(category, index) in othersCartegories", :key="index", :model="category")
</template>

<style lang="scss" scoped>
  .window {
    background: #2185d0;
    z-index: 100;
  }

  .categories /deep/ {
    li {
      cursor: pointer;
    }
  }
  .others {
    ul, p {
      margin: 0;
    }
    p {
      margin-left: 1rem;
    }

    hr {
      border-color: #ccc;
    }
  }
</style>

<script>
  export default {
    props: ['categories'],
    data() {
      return {
        'windowVisible': false
      }
    },
    methods: {
      toggleWindow() {
        if (! window.windowVisible) {
          window.addEventListener('click', this.closeCategoriesFromOutside);
        }
        this.windowVisible = !this.windowVisible;
      },
      changeCategory(data) {
        this.windowVisible = false;
        updateQueryStringParameterAndGo('category_id', data.id);
        localStorage.setItem('filteredCategoryId', data.id);
      },
      closeCategoriesFromOutside(e) {
        if (!this.$parent.$refs['categories-button'].$el.contains(e.target)) {
          this.windowVisible = false;
          window.removeEventListener('click', this.closeCategoriesFromOutside);
        }
      }
    },
    computed: {
      myCartegories() {
        return _.filter(this.categories, c => c.isMyCategory);
      },
      othersCartegories() {
        return _.filter(this.categories, c => !c.isMyCategory);
      }
    },
    created() {
      this.$bus.$on('category-selected', this.changeCategory);
    }
  }
</script>
