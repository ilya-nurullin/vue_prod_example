export default class Cart {
  static addToCart(cartId, {itemId, count}) {
    let appendix = '?cart_id=' + cartId;
    if (window.paramProviderId !== undefined)
      appendix += "&provider_id=" + window.paramProviderId;

    return axios
      .post(route('cart.add', appendix), {
        'itemId': itemId,
        'count': count
      })
      .catch((error) => {
        console.error("API error: ", error);
      });
  }

  static getBriefCart(cartId) {
    let appendix = '?cart_id=' + cartId;
    if (window.paramProviderId !== undefined)
      appendix += "&provider_id=" + window.paramProviderId;
    return axios.get(route('cart', appendix));
  }

  static getFullCart(cartId) {
    let appendix = '?cart_id=' + cartId;
    if (window.paramProviderId !== undefined)
      appendix += "&provider_id=" + window.paramProviderId;
    return axios.get(route('cart.full', appendix));
  }

  static updateCount(cartId, {itemId, count}) {
    let appendix = '?cart_id=' + cartId;
    if (window.paramProviderId !== undefined)
      appendix += "&provider_id=" + window.paramProviderId;
    return axios.post(route('cart.update', appendix), {'itemId': itemId, 'count': count});
  }

  static checkCart(cartId, cart) {
    let appendix = '?cart_id=' + cartId;
    if (window.paramProviderId !== undefined)
      appendix += "&provider_id=" + window.paramProviderId;
    return axios.post(route('cart.checkCount', appendix), {'cart': cart});
  }

  static truncateCart(cartId) {
    let appendix = '?cart_id=' + cartId;
    if (window.paramProviderId !== undefined)
      appendix += "&provider_id=" + window.paramProviderId;
    return axios.post(route('cart.truncate', appendix));
  }

  static updateTextData(cartId, attrName, newValue) {
    return axios.post(route('cart.updateData', cartId), { attrName: attrName, newValue: newValue })
  }
}
