<template lang="pug">
  li(v-if="model.items_count > 0")
    div(:class="{bold: isFolder}", @click="toggle")
      | {{ model.title }}
      span  ({{ model.items_count }})
    ul(v-show="isOpen", v-if="isFolder", ref="childrenTree")
      tree(v-for="(model, index) in model.children", :key="index", :model="model")
</template>

<style lang="scss" scoped>
  .bold {
    font-weight: bold;
  }
</style>

<script>
  export default {
    props: {
      model: Object
    },
    data() {
      return {
        "isOpen": false,
      }
    },
    create() {
      this.$on('category-selected', (payload) => { debugger; this.$emit('category-selected', payload)});
    },
    methods: {
      toggle() {
        if (this.isFolder) {
          this.isOpen = !this.isOpen;
          setTimeout(() =>this.$refs.childrenTree.scrollIntoViewIfNeeded(), 0);
        }
        else {
          let categoryId = this.model.id;
          this.$store.commit('catalogItems/resetAll');
          this.$store.dispatch('catalogItems/setCategoryIdAndLoadItems', categoryId);
          this.$bus.$emit('category-selected', {'id': categoryId});
        }
      }
    },
    computed: {
      isFolder: function () {
        return this.model.children &&
          this.model.children.length > 0
      }
    }
  }
</script>
