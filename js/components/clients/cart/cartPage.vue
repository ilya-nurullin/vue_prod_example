<template lang="pug">
  .d-flex.flex-column
    div

      h1.ml-1.mt-1
        template(v-if="!isSpec") Корзина
        template(v-if="isSpec")
          template(v-if="!isEditSpecTitle")
            | Спецификация: {{ specTitleData }}
            button.ui.icon.button.ml-1(@click="startEditSpecTitle")
              i.ui.edit.icon
          template(v-if="isEditSpecTitle")
            | Спецификация:
            input(:value="specTitleData", ref="specTitleInput")
            button.ui.icon.button.ml-1(@click="updateSpecData('title')")
              i.ui.save.icon
            button.ui.icon.button(@click="cancelEditSpecTitle")
              i.ui.undo.icon

      p.ml-1(v-if="isSpec")
        template(v-if="!isEditSpecDescription")
          | {{ specDescriptionData }}
          br
          span.js-link(@click="startEditSpecDescription") Редактировать описание
        template(v-if="isEditSpecDescription",)
          textarea(rows="7", cols=50, ref="specDescriptionTextArea") {{ specDescriptionData }}
          button.ui.icon.button.ml-1(@click="updateSpecData('description')")
            i.ui.save.icon
          button.ui.icon.button(@click="cancelEditSpecDescription")
            i.ui.undo.icon

      div.ml-1
        template(v-if="totalPriceInt > 0")
          button.ui.primary.labeled.icon.button(type="button", @click="checkAndSubmitCart")
            i.cart.icon
            | Оформить заказ
          a.ui.labeled.icon.button#addToSpec(href="#spec-form", v-show="!isSpec", v-if="!isAnonClient")
            i.plus.icon
            | Добавить товары в спецификацию
          button.ui.labeled.icon.button(type="button", @click="truncateCart")
            i.close.icon
            span(v-if="!isSpec") Очистить корзину
            span(v-if="isSpec") Очистить спецификацию
        a.ui.labeled.icon.button(:href="priceDownloadHref", v-if="!isAnonClient", target="_blank")
          i.download.icon
          | Скачать прайс
        button.ui.labeled.icon.button(@click="uploadCart", v-if="!isAnonClient")
          i.upload.icon
          | Загрузить заказ из скачанного прайса

      cart-table(:items="items", :briefCart="briefCart", :isLoading="isLoading", :showStartText="showStartText",
        :showEmptyCartText="showEmptyCartText", :errorRows="errorRows", ref="cartTable", :cartId="cartId", :is-spec="isSpec"
        , :is-anon-client="isAnonClient")

      h1.mr-1(v-if="items.length > 0", style='text-align: right') Итого: {{ totalPrice }} руб.

      div.text-align-right(v-show="totalPriceInt > 0")
        span.mr-1(v-if="isForManager")
          b.mr-1 Отправить сообщение клиенту
          .ui.checkbox.mr-1
            input(type='checkbox' name='example', v-model="sendToClientPM")
            label В лк
          .ui.checkbox
            input(type='checkbox' name='example', v-model="sendToClientEmail")
            label На email
        button.ui.primary.labeled.icon.button.mr-1(@click="checkAndSubmitCart")
          i.cart.icon
          | Оформить заказ
    h1.ml-1(v-if="!isSpec", style="margin-top: 0") Добавить товары в корзину
    h1.ml-1(v-if="isSpec", style="margin-top: 0") Добавить товары в спецификацию
    create-spec-form

    a#showAnonClientForm(href="#anon-client-form", style="display: none")
    anon-client-form

    div
      smart-search
      item-table(:cartId="cartId", :is-spec="isSpec", :is-anon-client="isAnonClient")

    form.ui.modal(v-show="false", :action="uploadCartAction", method="post", enctype="multipart/form-data", ref="cartUploadForm")
      input(type="hidden", :value="csrfToken", name="_token")
      i.close.icon
      .header
        | Загрузка Excel файла
      .image.content
          input(type="file", ref="cartUploadInput", name="file", required, accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .actions
        .ui.black.deny.button
          | Отмена
        button.ui.green.right.labeled.icon.button(type="submit")
          | Загрузить
          i.checkmark.icon
  //
</template>

<style lang="scss" scoped>
  @import "!/sass/_adaptivity.scss";

  button.ui.icon, a.ui.labeled.icon.button {
      margin-bottom: 1rem;
      display: inline-block;
  }
</style>

<script src="./cartPage.js"></script>
