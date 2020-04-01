<template lang="pug">
  #spec-form.white-popup-block.mfp-hide.ui.form
    h3 Создание спецификации из корзины
    .field
      label Название *
      input.input(name="spec_title", v-model="title", placeholder="Название спецификации (обязательно)")
    .field
      label Описание
      textarea(name="spec_description", v-model="description", placeholder="Описание спецификации (необязательно)")
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
        'action': route('manager.specs.create', null, ''),
        'title': "",
        'description': "",
      }
    },
    methods: {
      createSpec() {
        if (this.title === "") {
          swal('Укажите название спецификации');
          return;
        }
        if (this.$parent.$refs.form.checkValidity()) {
          this.$parent.action = this.action;
          setTimeout(() => this.$parent.$refs.form.submit(), 0);
        }
        else {
          $.magnificPopup.close();
          this.$parent.$refs.form.reportValidity();
        }
      },
    },
    mounted() {
      $('#addToSpec').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#name',

        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
          beforeOpen: function () {
            if ($(window).width() < 700) {
              this.st.focus = false;
            }
            else {
              this.st.focus = '#name';
            }
          }
        }
      });
    },
    watch: {
      title: function (newVal) {
        this.$bus.$emit('cart.updated.specForm.title', newVal);
      },
      description: function (newVal) {
        this.$bus.$emit('cart.updated.specForm.description', newVal);
      },
    }
  }
</script>
