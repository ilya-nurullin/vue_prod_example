export default class Catalog {
  static getItemsInCategory(categoryId) {
    return axios.get(route('items.getAll') + '?category_id=' + categoryId);
  }

  static getPriceLevels(categoryId) {
    return axios.get(route({
      name: 'categories.priceLevels',
      categoryId: categoryId
    }));
  }

  static getItemsById(itemsId) {
    return axios.get(route('items.byId', '?items=' + JSON.stringify(itemsId)));
  }

  static getFilteredItems(categoryId, searchText, selectedFilters) {
    let categoryIdQueryParameter = (categoryId) ? 'category_id='+categoryId : '';
    let searchTextQueryParameter = (searchText) ? 'search_text='+searchText : '';
    let filters = (selectedFilters) ? 'selected_filters='+JSON.stringify(selectedFilters) : '';
    let providerId = (window.paramProviderId !== undefined) ? "provider_id=" + window.paramProviderId : '';

    return axios.get(route('items.filtered', '?'+[categoryIdQueryParameter, searchTextQueryParameter, filters, providerId].join('&')));
  }

  static getAvailableFilters(categoryId, searchText, selectedFilters) {
    let categoryIdQueryParameter = (categoryId) ? 'category_id=' + categoryId : '';
    let searchTextQueryParameter = (searchText) ? 'search_text=' + searchText : '';
    let filters = (selectedFilters) ? 'selected_filters=' + JSON.stringify(selectedFilters) : '';
    let providerId = (window.paramProviderId !== undefined) ? "provider_id=" + window.paramProviderId : '';

    return axios.get(route('items.availableFilters', '?' + [
      categoryIdQueryParameter,
      searchTextQueryParameter,
      filters,
      providerId
    ].filter(x => x !== '').join('&')));
  }
}
