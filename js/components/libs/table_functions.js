export function hasInPackage() {
  return this.items.some(i => i.params_values.in_package != null);
}

export function hasImage() {
  return this.items.some(i => i.image != null);
}

export function hasBrand() {
  return this.items.some(i => i.params_values.brand != null);
}

export function hasVendorCode() {
  return this.items.some(i => i.params_values.vendor_code != null);
}

export function hasProviderTitle() {
  return this.items.some(i => i.provider_id !== window.providerId);
}

export function hasDeliveryTime() {
  return this.items.some(i => i.days != null);
}
