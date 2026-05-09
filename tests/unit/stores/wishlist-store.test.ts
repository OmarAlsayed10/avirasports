import { describe, it, expect, beforeEach } from 'vitest';
import { useWishlistStore } from '@/lib/stores/wishlist-store';

const mockItem = {
  productId: 'p1',
  name: 'Philips Air Fryer',
  brand: 'Philips',
  imageUrl: '/img.jpg',
  priceEgp: 3500,
  slug: 'philips-air-fryer',
};

describe('wishlist store', () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
  });

  it('adds an item to the wishlist', () => {
    useWishlistStore.getState().toggleItem(mockItem);
    expect(useWishlistStore.getState().items).toHaveLength(1);
    expect(useWishlistStore.getState().items[0].productId).toBe('p1');
  });

  it('removes an item when toggled again', () => {
    useWishlistStore.getState().toggleItem(mockItem);
    useWishlistStore.getState().toggleItem(mockItem);
    expect(useWishlistStore.getState().items).toHaveLength(0);
  });

  it('isWishlisted returns true for added items', () => {
    useWishlistStore.getState().toggleItem(mockItem);
    expect(useWishlistStore.getState().isWishlisted('p1')).toBe(true);
    expect(useWishlistStore.getState().isWishlisted('p999')).toBe(false);
  });

  it('removeItem removes a specific item', () => {
    const item2 = { ...mockItem, productId: 'p2', name: 'Bosch Kettle' };
    useWishlistStore.getState().toggleItem(mockItem);
    useWishlistStore.getState().toggleItem(item2);
    useWishlistStore.getState().removeItem('p1');
    const items = useWishlistStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe('p2');
  });

  it('stores multiple distinct items', () => {
    const item2 = { ...mockItem, productId: 'p2', name: 'Bosch Kettle' };
    useWishlistStore.getState().toggleItem(mockItem);
    useWishlistStore.getState().toggleItem(item2);
    expect(useWishlistStore.getState().items).toHaveLength(2);
  });
});
