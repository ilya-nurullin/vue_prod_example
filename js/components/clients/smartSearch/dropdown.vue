<template lang="pug">
  span
    label.typo__label {{ localizedTitle }}
    multiselect(v-model="value", :options="Object.values(data)", :multiple="true", :hideSelected="true", :closeOnSelect="false",
      :showLabels="false", :placeholder="localizedTitle", @close="startSearch", @remove="startSearch", :loading="isLoadingItems")
      template(slot="noResult") Значение не найдено
</template>

<style lang="scss" scoped>
  label {
    color: #ddd !important;
  }
  .multiselect {
    z-index: 10;
  }
</style>

<script>
  import Multiselect from 'vue-multiselect'

  export default {
    props: ['data', 'title'],
    components: {
      'multiselect': Multiselect,
    },
    computed: {
      value: {
        get() {
          return this.$store.state.catalogItems.selectedFilters[this.title];
        },
        set(value) {
          this.$store.commit('catalogItems/setSelectedOneFilter', {filterName: this.title, filterValue: value})
        }
      },
      localizedTitle: function () {
        return this.localize(this.title);
      },
      isLoadingItems: function () {
        return this.$store.state.catalogItems.isLoading;
      }
    },
    methods: {
      startSearch(selectedOption, id) {
        if (selectedOption.length === 0)
          return;
        this.$nextTick(() => {
          this.$store.dispatch('catalogItems/loadItemsWithFilters');
        });
      },
      localize(title) {
        switch (title) {
          case 'brand': return 'Бренд';
          case 'units': return 'Ед. измерения';
          case 'in_package': return 'В упаковке';
          default: return title;
        }
      }
    }
  }
</script>
