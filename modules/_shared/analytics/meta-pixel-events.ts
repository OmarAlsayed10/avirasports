'use client';

export type PixelItem = {
  content_id: string;
  content_name: string;
  content_category?: string;
  price: number;
  quantity?: number;
};

export const trackPixelEvent = {
  viewContent: (item: PixelItem) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [item.content_id],
        content_name: item.content_name,
        content_category: item.content_category,
        value: item.price,
        currency: 'EGP',
        content_type: 'product',
      });
    }
  },
  addToCart: (item: PixelItem) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [item.content_id],
        content_name: item.content_name,
        content_type: 'product',
        value: item.price * (item.quantity ?? 1),
        currency: 'EGP',
      });
    }
  },
  initiateCheckout: (items: PixelItem[], totalValue: number) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map((i) => i.content_id),
        contents: items.map((i) => ({ id: i.content_id, quantity: i.quantity ?? 1 })),
        num_items: items.reduce((acc, i) => acc + (i.quantity ?? 1), 0),
        value: totalValue,
        currency: 'EGP',
        content_type: 'product',
      });
    }
  },
  purchase: (orderId: string, totalValue: number, items: PixelItem[]) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        content_ids: items.map((i) => i.content_id),
        value: totalValue,
        currency: 'EGP',
        content_type: 'product',
        order_id: orderId,
      });
    }
  },
};
