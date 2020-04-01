<template lang="pug">
  form#spec-form.white-popup-block.mfp-hide.ui.form(ref="form", :action="action", method="post")
    h3 Создание спецификации из корзины
    input(type="hidden", name="_token", :value="csrf")
    .field
      label Название *
      input.input(name="title", v-model="title", placeholder="Название спецификации (обязательно)", required)
    .field
      label Описание
      textarea(name="description", placeholder="Описание спецификации (необязательно)")
    .field
      button.ui.primary.fluid.button(type="button", @click="createSpec") Создать спецификацию
  //
</template>

<style lang="scss" scoped>
  .white-popup-block {
    background: #FFF;
    padding: 20px 30px;
    text-align: left;
    max-width: 700px;
    margin: 40px auto;
    position: relative;
  }
</style>

<script>
  export default {
    data() {
      return {
        'action': '/specs/create',
        'title': null,
        'csrf': window.csrfToken
      }
    },
    methods: {
      createSpec() {
        if (this.$refs.form.checkValidity() && this.checkTitle()) {
          this.$refs.form.submit();
        }
        else {
          this.$refs.form.reportValidity();
          if (!this.checkTitle()) {
            alert('Ваша спецификация не может называться корзина');
          }
        }
      },
      checkTitle() {
        return this.title !== 'корзина';
      }
    },
  }
</script>
