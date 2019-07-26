interface Window extends Window {
  __bluecore_site_id: string;
  triggermail: Bluecore;
}

interface Bluecore {
  Partner: {
    dataReady(params: AddToCart | RemoveFromCart): void;
  };
}

type AddToCart = { event_type: "add_to_cart"; id: string };
type RemoveFromCart = { event_type: "remove_from_cart"; id: string };
