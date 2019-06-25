interface Window extends Window {
  __bluecore_site_id: string
  bluecore: Bluecore
}

interface Bluecore {
  track<K extends keyof EventMap>(type: K, params: EventMap[K]): void;
}

interface EventMap {
  'add_to_cart': BluecoreItem,
  'remove_from_cart': BluecoreItem,
  'purchase': PurchaseParams,
  'view_category': ViewCategoryParams,
}

interface BluecoreItem {
  id: string
}

interface PurchaseParams {
  email: string
  total: number,
  products: BluecoreItem[]
}

interface ViewCategoryParams {
  category: string
}
