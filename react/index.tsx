import { canUseDOM } from 'vtex.render-runtime'
import { PixelMessage } from './typings/events'

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

function handleMessages(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:orderPlaced': {
      const order = e.data as Order
      addPixelImage(order)
      break
    }
    case "vtex:addToCart": {
      const { items } = e.data

      items.forEach(item => {
        try {
          window.triggermail.Partner.dataReady({
            event_type: "add_to_cart",
            id: item.productRefId
          })
        } catch (e) {
          console.error(e)
        }
      })
      return
    }
    case "vtex:removeFromCart": {
      const { items } = e.data

      items.forEach(item => {
        try {
          window.triggermail.Partner.dataReady({
            event_type: "remove_from_cart",
            id: item.productRefId
          });
        } catch (e) {
          console.error(e)
        }
      })
      break
    }
    default:
      break
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}
