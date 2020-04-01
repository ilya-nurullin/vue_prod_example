require('./polyfills');

window.updateQueryStringParameter = function (uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
};

window.updateQueryStringParameterAndGo = function (key, value) {
  let newUri = updateQueryStringParameter(location.href, key, value);

  if ("history" in window)
    history.pushState(null, '', newUri);
  else
    location.href = newUri;
};

window.removeUrlParameter = function (url, parameter) {
  var urlParts = url.split('?');

  if (urlParts.length >= 2) {
    // Get first part, and remove from array
    var urlBase = urlParts.shift();

    // Join it back up
    var queryString = urlParts.join('?');

    var prefix = encodeURIComponent(parameter) + '=';
    var parts = queryString.split(/[&;]/g);

    // Reverse iteration as may be destructive
    for (var i = parts.length; i-- > 0;) {
      // Idiom for string.startsWith
      if (parts[i].lastIndexOf(prefix, 0) !== -1) {
        parts.splice(i, 1);
      }
    }

    url = urlBase + '?' + parts.join('&');
  }

  return url;
};

window.moneyFormat = function (str) {
  return parseFloat(str).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

window.itemImageSrc = function (str) {
  return "/storage/items/images/" + str;
};

window.getNumEnding = function (iNumber, aEndings)
{
  let sEnding, i;
  iNumber = iNumber % 100;
  if (iNumber >= 11 && iNumber <= 19) {
    sEnding = aEndings[2];
  }
  else {
    i = iNumber % 10;
    switch (i) {
      case (1):
        sEnding = aEndings[0];
        break;
      case (2):
      case (3):
      case (4):
        sEnding = aEndings[1];
        break;
      default:
        sEnding = aEndings[2];
    }
  }
  return sEnding;
};

window.route = require('./reverseRouting').default;
