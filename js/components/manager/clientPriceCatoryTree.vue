<template lang="pug">
  li(v-show="isShown")
    div.bold(:class="{bold: isFolder}", @click="toggle")
      | {{ model.title }}
      span(v-if="!isFolder") —
      .ui.mini.input(v-if="!isFolder")
        select(:name="'categories[' + model.id + '][type]'" v-model="priceLevelId")
          option(v-for="(level, index) in priceLevels" :key="index" :value="level.id") {{ level.title }}
      .ui.mini.input(v-if="!isFolder")
        input(:name="'categories[' + model.id + '][value]'" v-model.number="value" ref="valueInput"
          :readonly="priceLevelId > 0" required @blur="checkThisField" :class="{'error': hasError}")
    ul(v-show="isOpen", v-if="isFolder")
      category-tree(v-for="(model, index) in model.children", :key="index", :model="model")
</template>

<style lang="scss" scoped>
  .bold {
    font-weight: bold;
  }

  .ui.mini.input {
    width: auto !important;
  }

  input.error {
    $color: red;
    border: 1px solid $color !important;
    background: lighten($color, 20%) !important;
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
        "priceLevels": window.priceLevels.filter(c => c.category_id === this.model.id || c.id === 0),
        "priceTypeName": null,
        "priceLevelId": (window.usersPriceLevels && window.usersPriceLevels[this.model.id]) ?
          (
            (window.usersPriceLevels[this.model.id].price_level_id == null)
              ? 0
              : window.usersPriceLevels[this.model.id].price_level_id
          )
          : 0,
        "isShown": true,
        "value": '',
        'hasError': false
      }
    },
    methods: {
      toggle() {
        if (this.isFolder && !this.$children.some(c => c.hasError)) {
          this.isOpen = !this.isOpen
        }
        else {
          this.$bus.$emit('category-selected', {'id': this.model.id});
        }
      },
      cascadeOpen() {
        this.isOpen = true;
        this.$children.forEach(c => c.cascadeOpen());
      },
      cascadeClose() {
        this.isOpen = false;
        this.$children.forEach(c => c.cascadeClose());
      },
      selfFilter(str) {
        if (!this.isFolder)
          this.isShown = this.model.title.toLowerCase().indexOf(str) >= 0;
        else
          this.isShown = this.$children.filter(c => c.isShown).length > 0;
      },
      checkThisField() {
        if (this.value >= 1 || this.value <= 0) {
          this.hasError = true;
          setTimeout(() => this.$refs.valueInput.focus(), 0);
        }
        else {
          this.hasError = false;
        }
      }
    },
    watch: {
      priceLevelId: function (newVal) {
        this.value = parseFloat(this.value = this.priceLevels.filter(l => l.id === newVal)[0].value).toFixed(4);
      }
    },
    computed: {
      isFolder: function () {
        return this.model.children &&
          this.model.children.length
      }
    },
    created() {
      if (!this.isFolder)
        this.value = (window.usersPriceLevels && window.usersPriceLevels[this.model.id])
          ? parseFloat(window.usersPriceLevels[this.model.id].value)
          : parseFloat(this.value = this.priceLevels.filter(l => l.id === this.priceLevelId)[0].value).toFixed(4);


      if (!this.isFolder) {
        this.$bus.$on('new-general-price-level', (data) => {
          let filter = this.priceLevels.filter(c => c.title.toLowerCase() === data.toLowerCase());
          this.priceLevelId = filter[0].id
        });
      }
    },
    mounted() {
      this.$bus.$on('new-category-search', (data) => this.selfFilter(data));
    }
  }
</script>
