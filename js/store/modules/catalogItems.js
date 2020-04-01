import Catalog from "../../api/catalog";

const state = {
  items: [],
  categoryId: null,
  searchText: '',
  availableFilters: [],
  selectedFilters: {},
  isLoading: false,
};

const getters = {
  totalPrice(state) {
    return cartId => state.carts[cartId].reduce((a, b) => a + b.price * b.count, 0).toFixed(2);
  },
  formatTotalPrice(state, getters) {
    return cartId => getters.totalPrice(cartId).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
};

const actions = {
  loadFilteredItems(context) {
    let t = state;
    state.isLoading = true;
    return Catalog.getFilteredItems(state.categoryId, state.searchText, state.selectedFilters).then((response) => {
      context.commit('setItems', response.data);
      t.isLoading = false;
    });
  },
  loadAvailableFilters(context) {
    let t = state;
    return Catalog.getAvailableFilters(t.categoryId, t.searchText, t.selectedFilters).then((response) => {
      if (response.data.length !== 0)
        context.commit('setAvailableFilters', response.data);
    })
  },
  loadItemsWithFilters(context) {
    context.dispatch('loadFilteredItems');
    context.dispatch('loadAvailableFilters');
  },
  setCategoryIdAndLoadItems(context, newCategoryId) {
    context.commit('setCategoryId', newCategoryId);
    context.dispatch('loadFilteredItems');
    context.dispatch('loadAvailableFilters');
  },
  setSearchTextAndLoadItems(context, newSearchText) {
    context.commit('setSearchText', newSearchText);
    context.dispatch('loadFilteredItems');
    context.dispatch('loadAvailableFilters');
  },
  resetCategoryIdAndLoadItems(context) {
    context.commit('setCategoryId', null);
    context.dispatch('loadFilteredItems');
    context.dispatch('loadAvailableFilters');
  },
  // setSelectedFiltersAndLoadItems(context, newFilters) {
  //   context.commit('setSelectedFilters', newFilters);
  //   context.dispatch('loadFilteredItems');
  //   context.dispatch('loadAvailableFilters');
  // },
  resetAllAndLoadItems(context) {
    context.commit('resetAll');
    context.dispatch('loadFilteredItems');
    context.dispatch('loadAvailableFilters');
  }
};

const mutations = {
  setItems(state, items) {
    state.items = items;
  },
  setCategoryId(state, newCategoryId) {
    state.categoryId = newCategoryId;
  },
  setSearchText(state, newSearchText) {
    state.searchText = newSearchText;
  },
  setAvailableFilters(state, newFilters) {
    state.availableFilters = newFilters;
  },
  setSelectedFilters(state, newFilters) {
    state.selectedFilters = newFilters;
  },
  setSelectedOneFilter(state, {filterName, filterValue}) {
    if (filterValue === null || filterValue.length === 0)
      Vue.delete(state.selectedFilters, filterName);
    else
      Vue.set(state.selectedFilters, filterName, filterValue);
  },
  resetAll(state) {
    state.items = [];
    state.categoryId = null;
    state.searchText = '';
    state.selectedFilters = {};
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
