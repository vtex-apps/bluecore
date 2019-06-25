import { canUseDOM } from 'vtex.render-runtime'
import { PixelMessage, AddToCartData, RemoveFromCartData } from './typings/events'

export interface Order {
  visitorContactInfo: string[]
  transactionId: string
  transactionTotal: number,
  transactionProducts: ProductOrder[]
}

interface ProductOrder {
  sku: string,
}

function addPixelImage(order: Order) {
  const token = window.__bluecore_site_id

  const email = order.visitorContactInfo[0]
  const total = order.transactionTotal
  const orderId = order.transactionId
  const productsIds = order.transactionProducts.map((p: { sku: string }) => p.sku).join(',')

  const img = document.createElement('img')
  const url = `https://www.bluecore.com/api/track/purchase_pixel?token=${token}&email=${email}&total=${total}&order_id=${orderId}&product_ids=${productsIds}`

  img.setAttribute('id', 'bluecore_purchase_pixel')
  img.setAttribute('src', url)

  document.body.appendChild(img)
}

function handleMessages(e: PixelMessage) {
  console.log('pixel', e.data);

  switch (e.data.event) {
    case 'vtex:orderPlaced': {
      const order = e.data as Order
      addPixelImage(order)
      return
    }
    case 'vtex:addToCart': {
      const data = e.data as AddToCartData
      const id = data.items[0].sku.skuId
      if (!id) {
        return
      }

      window.bluecore.track('add_to_cart', { id })
      return
    }
    case 'vtex:removeFromCart': {
      const data = e.data as RemoveFromCartData
      const id = data.items[0].sku.skuId
      if (!id) {
        return
      }

      window.bluecore.track('remove_from_cart', { id })
      return
    }
    default:
      break
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}
