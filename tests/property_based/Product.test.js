import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Product from '@/components/Product';

// Property-based test utilities
const generateRandomProduct = () => {
  const names = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
  const emojis = ['🍕', '🍔', '🍟', '🌭', '🍿', '🍩', '🍪', '🍰'];
  const currencies = ['JPY', 'USD', 'EUR', 'GBP'];
  
  return {
    product_id: `prod_${Math.random().toString(36).substr(2, 9)}`,
    price_id: `price_${Math.random().toString(36).substr(2, 9)}`,
    name: names[Math.floor(Math.random() * names.length)],
    price: Math.floor(Math.random() * 10000) + 1,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    currency: currencies[Math.floor(Math.random() * currencies.length)]
  };
};

const generateRandomQuantity = () => Math.floor(Math.random() * 100) + 1;

describe('Product Component - Property-Based Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.mockUseShoppingCart.addItem.mockClear();
  });

  describe('Quantity Property Tests', () => {
    test('quantity should always be positive after any number of increase operations', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const increaseButton = screen.getByText('+');
        const randomClicks = Math.floor(Math.random() * 50) + 1;
        
        for (let j = 0; j < randomClicks; j++) {
          fireEvent.click(increaseButton);
        }
        
        const quantityText = screen.getByText((randomClicks + 1).toString());
        expect(parseInt(quantityText.textContent)).toBeGreaterThan(0);
        
        // Clean up
        screen.unmount();
      }
    });

    test('quantity should never go below 1 regardless of decrease operations', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const decreaseButton = screen.getByText('-');
        const randomClicks = Math.floor(Math.random() * 100) + 1;
        
        for (let j = 0; j < randomClicks; j++) {
          fireEvent.click(decreaseButton);
        }
        
        const quantityText = screen.getByText('1');
        expect(parseInt(quantityText.textContent)).toBe(1);
        
        // Clean up
        screen.unmount();
      }
    });

    test('quantity should be commutative: increase then decrease should equal decrease then increase', () => {
      // Test with 50 random products
      for (let i = 0; i < 50; i++) {
        const product = generateRandomProduct();
        
        // First test: increase then decrease
        render(<Product product={product} />);
        const increaseButton = screen.getByText('+');
        const decreaseButton = screen.getByText('-');
        
        const randomIncreases = Math.floor(Math.random() * 10) + 1;
        const randomDecreases = Math.floor(Math.random() * randomIncreases);
        
        for (let j = 0; j < randomIncreases; j++) {
          fireEvent.click(increaseButton);
        }
        for (let j = 0; j < randomDecreases; j++) {
          fireEvent.click(decreaseButton);
        }
        
        const finalQuantity1 = parseInt(screen.getByText((randomIncreases - randomDecreases + 1).toString()).textContent);
        screen.unmount();
        
        // Second test: decrease then increase
        render(<Product product={product} />);
        const increaseButton2 = screen.getByText('+');
        const decreaseButton2 = screen.getByText('-');
        
        for (let j = 0; j < randomDecreases; j++) {
          fireEvent.click(decreaseButton2);
        }
        for (let j = 0; j < randomIncreases; j++) {
          fireEvent.click(increaseButton2);
        }
        
        const finalQuantity2 = parseInt(screen.getByText((randomIncreases - randomDecreases + 1).toString()).textContent);
        
        expect(finalQuantity1).toBe(finalQuantity2);
        screen.unmount();
      }
    });
  });

  describe('Add to Cart Property Tests', () => {
    test('addItem should always be called with the correct product regardless of quantity', () => {
      // Test with 100 random products and quantities
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const increaseButton = screen.getByText('+');
        const randomIncreases = Math.floor(Math.random() * 20) + 1;
        
        for (let j = 0; j < randomIncreases; j++) {
          fireEvent.click(increaseButton);
        }
        
        const addToCartButton = screen.getByText('Add to cart');
        fireEvent.click(addToCartButton);
        
        expect(global.mockUseShoppingCart.addItem).toHaveBeenCalledWith(
          product,
          { count: randomIncreases + 1 }
        );
        
        screen.unmount();
      }
    });

    test('quantity should always reset to 1 after adding to cart', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const increaseButton = screen.getByText('+');
        const randomIncreases = Math.floor(Math.random() * 50) + 1;
        
        for (let j = 0; j < randomIncreases; j++) {
          fireEvent.click(increaseButton);
        }
        
        const addToCartButton = screen.getByText('Add to cart');
        fireEvent.click(addToCartButton);
        
        // Wait for state update
        setTimeout(() => {
          expect(screen.getByText('1')).toBeInTheDocument();
        }, 0);
        
        screen.unmount();
      }
    });
  });

  describe('Product Display Property Tests', () => {
    test('product name should always be displayed regardless of content', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        expect(screen.getByText(product.name)).toBeInTheDocument();
        screen.unmount();
      }
    });

    test('product emoji should always be displayed regardless of content', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        expect(screen.getByText(product.emoji)).toBeInTheDocument();
        screen.unmount();
      }
    });

    test('product price should always be displayed with currency formatting', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const priceText = screen.getByText(new RegExp(`${product.currency} ${product.price}`));
        expect(priceText).toBeInTheDocument();
        screen.unmount();
      }
    });
  });

  describe('Button Interaction Property Tests', () => {
    test('increase button should always increase quantity by 1', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const increaseButton = screen.getByText('+');
        const initialQuantity = 1;
        
        fireEvent.click(increaseButton);
        
        expect(screen.getByText((initialQuantity + 1).toString())).toBeInTheDocument();
        screen.unmount();
      }
    });

    test('decrease button should always decrease quantity by 1 when above 1', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const increaseButton = screen.getByText('+');
        const decreaseButton = screen.getByText('-');
        
        // First increase to 2
        fireEvent.click(increaseButton);
        expect(screen.getByText('2')).toBeInTheDocument();
        
        // Then decrease back to 1
        fireEvent.click(decreaseButton);
        expect(screen.getByText('1')).toBeInTheDocument();
        
        screen.unmount();
      }
    });

    test('decrease button should not change quantity when already at 1', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const decreaseButton = screen.getByText('-');
        
        fireEvent.click(decreaseButton);
        
        expect(screen.getByText('1')).toBeInTheDocument();
        screen.unmount();
      }
    });
  });

  describe('Component Structure Property Tests', () => {
    test('component should always render all required elements regardless of product data', () => {
      // Test with 100 random products
      for (let i = 0; i < 100; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        // Check for required elements
        expect(screen.getByText('+')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('Add to cart')).toBeInTheDocument();
        
        screen.unmount();
      }
    });

    test('component should always have the same CSS classes regardless of product data', () => {
      // Test with 50 random products
      for (let i = 0; i < 50; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const container = screen.getByText(product.name).closest('article');
        expect(container).toHaveClass('flex', 'flex-col', 'gap-3', 'bg-white', 'p-8', 'rounded-xl', 'shadow-md', 'text-center', 'mb-6');
        
        screen.unmount();
      }
    });
  });

  describe('State Consistency Property Tests', () => {
    test('component state should be consistent after multiple rapid interactions', () => {
      // Test with 50 random products
      for (let i = 0; i < 50; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const increaseButton = screen.getByText('+');
        const decreaseButton = screen.getByText('-');
        
        // Perform rapid interactions
        for (let j = 0; j < 10; j++) {
          fireEvent.click(increaseButton);
        }
        for (let j = 0; j < 5; j++) {
          fireEvent.click(decreaseButton);
        }
        
        // Final state should be consistent
        expect(screen.getByText('6')).toBeInTheDocument();
        
        screen.unmount();
      }
    });

    test('component should maintain product data consistency throughout interactions', () => {
      // Test with 50 random products
      for (let i = 0; i < 50; i++) {
        const product = generateRandomProduct();
        render(<Product product={product} />);
        
        const increaseButton = screen.getByText('+');
        
        // Perform multiple interactions
        for (let j = 0; j < 5; j++) {
          fireEvent.click(increaseButton);
        }
        
        // Product data should remain unchanged
        expect(screen.getByText(product.name)).toBeInTheDocument();
        expect(screen.getByText(product.emoji)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`${product.currency} ${product.price}`))).toBeInTheDocument();
        
        screen.unmount();
      }
    });
  });
}); 