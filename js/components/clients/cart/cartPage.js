import Cart from '../../../api/cart';

export default {
  props: {
    isSpec: Boolean,
    isForManager: Boolean,
    isAnonClient: Boolean,
    cartId: Number,
    specTitle: String,
    specDescription: String
  },
  components: {
    'cart-table': require('./cartTable'),
    'create-spec-form': require('./createSpecForm'),
    'anon-client-form': require('./anonClientForm')
  },
  data() {
    return {
      'items': [],
      'briefCart': [],
      'isLoading': false,
      'showStartText': false,
      'showEmptyCartText': false,
      'errorRows': [],
      'specTitleData': this.specTitle,
      'specDescriptionData': this.specDescription,

      'isEditSpecTitle': false,
      'isEditSpecDescription': false,

      'sendToClientPM': true,
      'sendToClientEmail': false,

      'anonClientTel': '',
      'anonClientName': '',

      'priceDownloadHref': route('cart.downloadPrice', '', ''),
      'uploadCartAction': route('cart.uploadCart', '', ''),
      'csrfToken': window.csrfToken,
    }
  },
  created() {
    this.$bus.$on('cart-item-count-updated', this.silentlyLoadCart);
  },
  mounted() {
    this.loadCart();
    $('.ui.checkbox').checkbox();
  },
  computed: {
    totalPrice: function () {
      return moneyFormat(this.items.reduce((sum, item) => sum + parseFloat(item.user_price)
        .toFixed(2) * this.briefCart[item.id], 0));
    },
    totalPriceInt: function () {
      return parseInt(this.items.reduce((sum, item) => sum + parseFloat(item.user_price)
        .toFixed(2) * this.briefCart[item.id], 0));
    },
  },
  methods: {
    loadCart() {
      this.showStartText = false;
      this.isLoading = true;
      Cart.getFullCart(this.cartId).then(response => {
        this.items = response.data.cart;
        this.briefCart = response.data.briefCart;
        this.isLoading = false;
        this.showEmptyCartText = response.data.cart.length === 0;
      });
    },
    checkAndSubmitCart: function () {
      if (this.isAnonClient) {
        $('#showAnonClientForm').magnificPopup('open');
      }
      else {
        Cart.checkCart(this.cartId, this.briefCart).then(response => {
          if (response.data.length === 0) {
            this.$refs.cartTable.$refs.cartForm.submit();
          }
          else {
            this.silentlyLoadCart().then(() => this.errorRows = Object.keys(response.data));
            swal({
              type: 'warning',
              title: 'Внимание',
              text: 'Заказанное количество превышает остаток на складе. Заказ можно оформить. О сроке поставки недостающего количества товара вас известит менеджер.',
              showCancelButton: true,
              confirmButtonText: 'Сделать заказ',
              cancelButtonText: 'Вернуться к корзине',
              heightAuto: false
            }).then(result => {
              if (result.value) {
                this.$refs.cartTable.$refs.cartForm.submit();
              }
            });
          }
        });
      }
    },
    silentlyLoadCart() {
      return Cart.getFullCart(this.cartId).then(response => {
        this.items = response.data.cart;
        this.briefCart = response.data.briefCart;
        this.showEmptyCartText = response.data.cart.length === 0;
        this.$bus.$emit('full-cart-updated');
      });
    },
    truncateCart() {
      return Cart.truncateCart(this.cartId).then(() => {
        this.silentlyLoadCart();
        this.$store.commit('cart/truncateCart', this.cartId);
      });
    },
    startEditSpecTitle() {
      this.isEditSpecTitle = true;
    },
    cancelEditSpecTitle() {
      this.isEditSpecTitle = false;
    },
    startEditSpecDescription() {
      this.isEditSpecDescription = true;
    },
    cancelEditSpecDescription() {
      this.isEditSpecDescription = false;
    },
    updateSpecData(attrName) {
      let newValue;
      if (attrName === 'title') {
        newValue = this.$refs.specTitleInput.value;
      }
      else if (attrName === 'description') {
        newValue = this.$refs.specDescriptionTextArea.value;
      }

      Cart.updateTextData(this.cartId, attrName, newValue).then(() => {
        if (attrName === 'title') {
          this.specTitleData = newValue;
          this.isEditSpecTitle = false;
        }
        else if (attrName === 'description') {
          this.specDescriptionData = newValue;
          this.isEditSpecDescription = false;
        }
      });
    },
    uploadCart() {
      let t = this;
      if (this.items.length > 0) {
        swal({
          type: 'warning',
          title: 'Внимание',
          text: 'В корзине есть товары. Очистить корзину перед загрузкой?',
          showCancelButton: true,
          confirmButtonText: 'Очистить корзину',
          cancelButtonText: 'Вернуться к корзине',
          heightAuto: false
        }).then(result => {
          if (result.value) {
            this.truncateCart();
            $(t.$refs.cartUploadForm).modal('show');
          }
        });
      }
      else
        $(t.$refs.cartUploadForm).modal('show');
    }
  },
  watch: {
    'sendToClientPM': function (newVal) {
      this.$bus.$emit('cartPage.changed.sendToClientPM', newVal);
    },
    'sendToClientEmail': function (newVal) {
      this.$bus.$emit('cartPage.changed.sendToClientEmail', newVal);
    },
    'totalPriceInt': function (newVal, oldVal) {
      this.$nextTick(function () {
        if (oldVal === 0 && newVal > 0) {
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
        }
      });

    }
  }
}
