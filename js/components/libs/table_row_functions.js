export function additionalPrintablePrices() {
  let params = this.item.params_values;
  let res = "";
  let price = this.item.user_price;

  if (params["Пересчет цен за упаковку"] && params["Пересчет цен за кв м"]) {
    let length = params["Длина (м)"];
    let width = params["Ширина (м)"];
    res += "<br>" + moneyFormat(price * this.item.multiplicity) + ' (за рул/упак)';
    res += '<br>' + moneyFormat(price * this.item.multiplicity / length / width) + " (за кв м)";
    return res;
  }

  if (params["Пересчет цен за упаковку"] === undefined && params["Пересчет цен за кв м"]) {
    let length = params["Длина (м)"];
    let width = params["Ширина (м)"];
    res += '<br>' + moneyFormat(price * this.item.multiplicity / length / width) + " (за кв м)";
    return res;
  }

  if (params["Пересчет цен за упаковку"] && params["Пересчет цен за кв м"] === undefined) {
    res += "<br>" + moneyFormat(price * this.item.multiplicity) + ' (за рул/упак)';
    return res;
  }

  if (params["Пересчет цен из куба в квадрат"]) {
    res += "<br>" + moneyFormat(price / 1000 * params["Толщина (мм)"]) + ' (за кв.м)';
    return res;
  }

  if (params["Пересчет цен из куба в шт"]) {
    res += "<br>" + moneyFormat(price * 3.14 * params["Диаметр (мм)"] * params["Диаметр (мм)"] / 4 / 1000000 * params["Длина (м)"]) + ' (за шт)';
    return res;
  }

  if (params["Пересчет цен фасовки в килограмм"] && params["Вес (кг)"] !== undefined) {
    res += "<br>" + moneyFormat(price /params["Вес (кг)"]) + ' (за кг)';
    return res;
  }

  return res;
}

export function deliveryTime() {
  let days = this.item.days;
  if (days)
    return days + " " + window.getNumEnding(days, [
      'день',
      'дня',
      'дней'
    ]);
  else
    return "";
}
