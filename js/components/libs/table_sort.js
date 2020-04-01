export function sortTableBy(items, {propName, sortType, type}) {
  if (propName === undefined || sortType === undefined) {
    return items;
  }

  function compare(a, b) {
    if ((a === undefined || a === null) && (b !== null || b !== undefined))
      return -1;
    if ((b === undefined || b === null) && (a !== null || a !== undefined))
      return 1;
    if ((a === undefined || a === null) && (b === null || b === undefined))
      return 0;


    if (a < b)
      return -1;
    if (a > b)
      return 1;
    return 0;
  }

  let getValue = (item) => {
    let _v = propName.split('.').reduce((a, b) => a[b], item);
    return (type) ? type(_v) : _v;
  };
  let sortedAsc = items.sort((a, b) => compare(getValue(a), getValue(b)));

  if (sortType)
    return sortedAsc.reverse();
  else
    return sortedAsc;
}

export function changeTableSort(propName, type) {
  if (_.isEmpty(this.colSort)) {
    Vue.set(this.colSort, 'propName', propName);
    Vue.set(this.colSort, 'sortType', false);
  }
  else {
    if (this.colSort.propName === propName)
      Vue.set(this.colSort, 'sortType', !this.colSort.sortType);
    else {
      Vue.set(this.colSort, 'propName', propName);
      Vue.set(this.colSort, 'sortType', false);
    }
  }
  Vue.set(this.colSort, 'type', type);
}

