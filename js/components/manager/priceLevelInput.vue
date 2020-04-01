<template lang="pug">
  div(v-show="markupGroup.title.toLowerCase().indexOf(search) >= 0")
    | {{ markupGroup.title }}  —
    .ui.mini.input
      select(:name="'price_levels[' + markupGroup.id + '][price_level_id]'" v-model="priceLevelId")
        option(v-for="(level, index) in priceLevels" :key="index" :value="level.id") {{ level.title }}
    .ui.mini.input
      input(:name="'price_levels[' + markupGroup.id + '][value]'" v-model.number="value" ref="valueInput"
        :readonly="priceLevelId !== null" required @blur="checkThisField" :class="{'error': hasError}")
</template>

<style lang="scss" scoped>
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
    props: ['markupGroup', 'priceLevels', 'search'],
    data() {
      return {
        "priceTypeName": null,
        "priceLevelId":
          (window.usersPriceLevels)
          ? ((window.usersPriceLevels[this.markupGroup.id])
              ? window.usersPriceLevels[this.markupGroup.id].price_level_id
              : '__disabled__')
          : null,
        "isShown": true,
        "value": (window.usersPriceLevels)
          ? ((window.usersPriceLevels[this.markupGroup.id])
              ? window.usersPriceLevels[this.markupGroup.id].value
              : this.priceLevels[this.priceLevels.length - 1].value
          )
          : '',
        'hasError': false
      }
    },
    created(){
      this.$bus.$on('new-general-price-level',
        (newVal) => {
          if (this.priceLevels.find(p => p.title === newVal) !== undefined)
            this.priceLevelId = this.priceLevels.find(p => p.title === newVal).id;
          else {
            this.priceLevelId = null;
            this.$nextTick(_ => this.value = "");
            this.$emit('showAll');
          }
        });
    },
    watch: {
      priceLevelId: function (newVal) {
        this.value = parseFloat(this.value = this.priceLevels.find(l => l.id === newVal).value).toFixed(4);
      }
    },
    methods: {
      checkThisField() {
        if (this.priceLevelId !== 0)
          return;
        if (this.value >= 1 || this.value <= 0) {
          this.hasError = true;
          setTimeout(() => this.$refs.valueInput.focus(), 0);
        }
        else {
          this.hasError = false;
        }
      }
    },
  }
</script>
