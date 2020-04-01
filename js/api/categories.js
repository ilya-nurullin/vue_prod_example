export default class Categories {
  static getAllButEmpty() {
    let appendix = '';
    if (window.paramProviderId !== undefined)
      appendix += "?provider_id=" + window.paramProviderId;
    return axios.get(route('categories.getAllButEmpty', appendix));
  }

  static getAll() {
    return axios.get(route('categories.getAll'));
  }

  static getMarkupGroups() {
    return axios.get(route('categories.markupGroups'));
  }
}
