<template lang="pug">
  form#anon-client-form.white-popup-block.mfp-hide.ui.form(ref="form")
    h3 Контактная информация
    .field
      label Ваше имя *
      input.input(name="anon-name", ref="anonNameInput", v-model="$parent.anonClientName", placeholder="Ваше имя (обязательно)", required)
    .field
      label Ваш телефон *
      input.input(name="anon-tel", ref="anonTelInput", v-model="$parent.anonClientTel", placeholder="Ваш телефон (обязательно)", required)
    .field
      button.ui.primary.fluid.button(type="button", @click="makeOrder") Отправить заказ
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
    mounted() {
      $('#showAnonClientForm').magnificPopup({
        type: 'inline',
        preloader: false,
      });
      let t = this;
      $('[name=anon-tel]').inputmask('+7 (999) 999-99-99', {
        oncomplete: function () {
          t.$parent.anonClientTel = $(this).val();
        },
        onincomplete: function () {
          t.$parent.anonClientTel = $(this).val();
        }
      });
    },
    methods: {
      makeOrder() {
        if (this.$refs.form.checkValidity() && this.checkFields()) {
          this.$parent.$refs.cartTable.$refs.cartForm.submit();
        }
        else {
          if (! this.checkFields()) {
            alert("Поля заполнены некорректно");
          }
          this.$refs.form.reportValidity();
        }
      },
      checkFields() {
        return this.$refs.anonTelInput.value.replace(/[\(\)\_ \+\-]/g, "").length === 11 &&
          this.$refs.anonNameInput.value.trim().length > 0;
      }
    },
  }
</script>
