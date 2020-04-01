<template lang="pug">
  div.btnWrapper
    button.ui.icon.green.button(@click="toggleWindow")
      i.filter.icon
    .window(v-if="windowVisible")
      | Фильтр по параметрам начнет работу позже

</template>

<style lang="scss" scoped>
  .window {
    background: #21ba45;
  }
</style>

<script>
  export default {
    data() {
      return {
        'windowVisible': false,
      }
    },
    methods: {
      toggleWindow() {
        if (!window.windowVisible) {
          window.addEventListener('click', this.closeCategoriesFromOutside);
        }

        this.windowVisible = !this.windowVisible;

        this.$parent.$refs['categories-button'].windowVisible = false;
      },
      closeCategoriesFromOutside(e) {
        if (!this.$parent.$refs['filters-button'].$el.contains(e.target)) {
          this.windowVisible = false;
          window.removeEventListener('click', this.closeCategoriesFromOutside);
        }
      }
    }
  }
</script>
