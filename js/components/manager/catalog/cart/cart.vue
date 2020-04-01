<template lang="pug">
  .d-flex.flex-column
    form.ui.form(:action="action", method="post", ref="form")
      input(type="hidden", name="_token", :value="csrf")
      input(type="hidden", name="spec_title", :value="specTitle")
      input(type="hidden", name="spec_description", :value="specDescription")
      .filed.mb-1
        label Имя клиента
        input.input(name="client_name")
      div(v-show="cart.length > 0")
        button.ui.primary.labeled.icon.button(type="button", @click="submitCart")
          i.cart.icon
          | Оформить заказ
        a.ui.labeled.icon.button#addToSpec(href="#spec-form", v-if="!isSpec")
          i.plus.icon
          | Добавить товары в спецификацию
        button.ui.labeled.icon.button(v-if="isSpec", @click="saveChanges")
          i.plus.icon
          | Сохранить изменения
        button.ui.labeled.icon.button(type="button", @click="truncateCart")
          i.close.icon
          | Очистить корзину

      cart-table(:items="cart", :showStartText="showStartText", :is-spec="isSpec"
        :showEmptyCartText="showEmptyCartText", :errorRows="errorRows", ref="cartTable")

      h1(v-if="cart.length > 0", style='text-align: right') Итого: {{ totalPrice }} руб.

      div.text-align-right(v-show="cart.length > 0")
        button.ui.primary.labeled.icon.button(type="button", @click="submitCart")
          i.cart.icon
          | Оформить заказ
      create-spec-form
  //
</template>

<style lang="scss" scoped></style>

<script>
  export default {
    props: [
      'cart',
      'isSpec',
      'specId'
    ],
    components: {
      'cart-table': require('./cartTable'),
      'create-spec-form': require('./createSpecForn')
    },
    data() {
      return {
        'action': route('manager.cart.commit', null, ''),
        'showStartText': false,
        'showEmptyCartText': false,
        'errorRows': [],
        'csrf': window.csrfToken,
        'specTitle': '',
        'specDescription': '',
      }
    },
    created() {
      this.$bus.$on('cart.updated.specForm.title', newVal => this.specTitle = newVal);
      this.$bus.$on('cart.updated.specForm.description', newVal => this.specDescription = newVal);
    },
    computed: {
      totalPrice: function () {
        return moneyFormat(this.cart.reduce(
          (sum, item) => {
            return sum + parseFloat(
              item.fullItem.user_price *
              (1.0 + parseFloat(item.priceLevels.filter(l => l.id === item.priceLevel).pop().value))).toFixed(2) * item.count
          }, 0)
        );
      },
    },
    methods: {
      addToCart(fullItemWithCount) {
        this.items.push(fullItemWithCount);
      },
      truncateCart() {
        this.$bus.$emit('cart.truncate');
      },
      saveChanges() {
        this.action = route({name: 'manager.specs.update', specId: this.specId }, null, '');
        setTimeout(() => this.$refs.form.submit(), 0);
      },
      submitCart() {
        if (this.$refs.form.client_name.value === ""){
          swal('Укажите имя клиента');
          return;
        }
        else {
          if (! this.$refs.form.checkValidity()) {
            this.$refs.form.reportValidity();
            return;
          }
          if (this.cart.some(i => i.count > i.fullItem.count))
          {
            swal({
              type: 'warning',
              title: 'Внимание',
              text: 'Заказанное количество превышает остаток на складе. Заказ можно оформить. О сроке поставки недостающего количества товара необходимо известить клиента.',
              showCancelButton: true,
              confirmButtonText: 'Сделать заказ',
              cancelButtonText: 'Вернуться к корзине'
            }).then(result => {
              if (result.value) {
                this.$refs.form.submit();
              }
            });
          }
          else {
            this.$refs.form.submit();
          }
        }
      }
    },
  }
</script>
