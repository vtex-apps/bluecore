import { canUseDOM } from 'vtex.render-runtime'

export interface Order {
  visitorContactInfo: string[]
  transactionId: string
  transactionTotal: number,
  transactionProducts: ProductOrder[]
}

interface ProductOrder {
  productRefId: string,
}

function addPixelImage(order: Order) {
  const token = window.__bluecore_site_id

  const email = order.visitorContactInfo[0]
  const total = order.transactionTotal
  const orderId = order.transactionId
  const productsIds = order.transactionProducts.map(({ productRefId }) => productRefId).join(',')

  const img = document.createElement('img')
  const url = `https://www.bluecore.com/api/track/purchase_pixel?token=${token}&email=${email}&total=${total}&order_id=${orderId}&product_ids=${productsIds}`

  img.setAttribute('id', 'bluecore_purchase_pixel')
  img.setAttribute('src', url)

  document.body.appendChild(img)
}

function handleMessages(e: any) {
  switch (e.data.eventName) {
    case 'vtex:orderPlaced': {
      const order = e.data as Order
      addPixelImage(order)
      break
    }
    default:
      break
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}
