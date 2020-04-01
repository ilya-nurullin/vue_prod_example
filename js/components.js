window.Vue.component('cart-menu-item', () => System.import('./components/clients/cartMenuItem.vue'));
window.Vue.component('item-table', () => System.import('./components/clients/itemTable.vue'));
window.Vue.component('cart-page', () => System.import('./components/clients/cart/cartPage.vue'));
window.Vue.component('smart-search', () => System.import('./components/clients/smartSearch/smartSearch.vue'));
window.Vue.component('tree', () => System.import('./components/clients/smartSearch/tree.vue'));


window.Vue.component('manager-catalog-page', () => System.import('./components/manager/catalog/catalogPage.vue'));

// manager
window.Vue.component('client-price-levels', () => System.import('./components/manager/clientPriceLevels.vue'));

if (window.VueComponents) {
  window.VueComponents.forEach((c) => window.Vue.component(c.name, c.component));
}
