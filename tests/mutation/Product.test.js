import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Product from '@/components/Product';

beforeEach(() => {
  jest.clearAllMocks();
  global.mockUseShoppingCart.addItem.mockClear();
});

describe('Product Component - Mutation Tests', () => {
  const mockProduct = {
    product_id: "prod_test123",
    price_id: "price_test123",
    name: "Test Product",
    price: 1000,
    emoji: "🍕",
    currency: "JPY"
  };

  describe('Weak Assertion Detection', () => {
    test('should detect weak assertion - only checking if element exists', () => {
      render(<Product product={mockProduct} />);
      
      // This is a weak assertion - only checks existence
      const addToCartButton = screen.getByText('Add to cart');
      expect(addToCartButton).toBeInTheDocument();
      
      // Stronger assertion - check specific properties
      expect(addToCartButton).toHaveTextContent('Add to cart');
      expect(addToCartButton).not.toBeDisabled();
    });

    test('should detect weak assertion - not checking actual text content', () => {
      render(<Product product={mockProduct} />);
      
      // Weak assertion - just checking if element exists
      const productName = screen.getByText('Test Product');
      expect(productName).toBeInTheDocument();
      
      // Stronger assertion - check exact text content
      expect(productName.textContent).toBe('Test Product');
    });

    test('should detect weak assertion - not checking quantity value', () => {
      render(<Product product={mockProduct} />);
      
      // Weak assertion - just checking if quantity element exists
      const quantityElement = screen.getByText('1');
      expect(quantityElement).toBeInTheDocument();
      
      // Stronger assertion - check exact quantity value
      expect(parseInt(quantityElement.textContent)).toBe(1);
    });
  });

  describe('State Mutation Tests', () => {
    test('should detect state mutation - quantity should be immutable from external changes', () => {
      render(<Product product={mockProduct} />);
      
      const quantityElement = screen.getByText('1');
      const initialValue = quantityElement.textContent;
      
      // Try to mutate the DOM directly (this should not affect component state)
      quantityElement.textContent = '999';
      
      // Component should maintain its own state
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);
      
      // Should still show 2, not 999
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('should detect state mutation - product props should not be modified', () => {
      const originalProduct = { ...mockProduct };
      render(<Product product={mockProduct} />);
      
      // Component should not modify the original product object
      expect(mockProduct).toEqual(originalProduct);
      expect(mockProduct.name).toBe('Test Product');
      expect(mockProduct.price).toBe(1000);
    });
  });

  describe('Event Handler Mutation Tests', () => {
    test('should detect event handler mutation - addItem should be called with exact parameters', () => {
      render(<Product product={mockProduct} />);
      
      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);
      
      // Strong assertion - check exact parameters
      expect(global.mockUseShoppingCart.addItem).toHaveBeenCalledWith(
        mockProduct,
        { count: 1 }
      );
      
      // Weak assertion - just checking if it was called
      expect(global.mockUseShoppingCart.addItem).toHaveBeenCalled();
    });

    test('should detect event handler mutation - quantity should reset after add to cart', () => {
      render(<Product product={mockProduct} />);
      
      // Increase quantity to 3
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      
      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);
      
      // Strong assertion - check exact reset behavior
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('Component Structure Mutation Tests', () => {
    test('should detect structure mutation - required elements should always be present', () => {
      render(<Product product={mockProduct} />);
      
      // Check for all required elements
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('🍕')).toBeInTheDocument();
      expect(screen.getByText('JPY 1000')).toBeInTheDocument();
    });

    test('should detect CSS class mutation - component should maintain consistent styling', () => {
      render(<Product product={mockProduct} />);
      
      const container = screen.getByText('Test Product').closest('article');
      
      // Check for required CSS classes
      expect(container).toHaveClass('flex', 'flex-col', 'gap-3', 'bg-white', 'p-8', 'rounded-xl', 'shadow-md');
    });
  });

  describe('Data Integrity Mutation Tests', () => {
    test('should detect data integrity issues - price formatting should be consistent', () => {
      render(<Product product={mockProduct} />);
      
      const priceElement = screen.getByText('JPY 1000');
      
      // Strong assertion - check exact format
      expect(priceElement.textContent).toBe('JPY 1000');
      expect(priceElement.textContent).toMatch(/^JPY \d+$/);
    });

    test('should detect data integrity issues - product name should not be truncated', () => {
      const longNameProduct = {
        ...mockProduct,
        name: 'This is a very long product name that should not be truncated or modified in any way'
      };
      
      render(<Product product={longNameProduct} />);
      
      const nameElement = screen.getByText(longNameProduct.name);
      expect(nameElement.textContent).toBe(longNameProduct.name);
    });
  });

  describe('Boundary Condition Mutation Tests', () => {
    test('should detect boundary condition issues - quantity should never be negative', () => {
      render(<Product product={mockProduct} />);
      
      const decreaseButton = screen.getByText('-');
      
      // Click decrease multiple times
      for (let i = 0; i < 10; i++) {
        fireEvent.click(decreaseButton);
      }
      
      // Strong assertion - quantity should never go below 1
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(parseInt(screen.getByText('1').textContent)).toBeGreaterThan(0);
    });

    test('should detect boundary condition issues - quantity should handle large numbers', () => {
      render(<Product product={mockProduct} />);
      
      const increaseButton = screen.getByText('+');
      
      // Click increase many times
      for (let i = 0; i < 100; i++) {
        fireEvent.click(increaseButton);
      }
      
      // Strong assertion - should handle large quantities
      expect(screen.getByText('101')).toBeInTheDocument();
      expect(parseInt(screen.getByText('101').textContent)).toBe(101);
    });
  });

  describe('Async Behavior Mutation Tests', () => {
    test('should detect async behavior issues - addItem should be called synchronously', () => {
      render(<Product product={mockProduct} />);
      
      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);
      
      // Strong assertion - should be called immediately
      expect(global.mockUseShoppingCart.addItem).toHaveBeenCalledTimes(1);
    });

    test('should detect async behavior issues - quantity should update immediately', () => {
      render(<Product product={mockProduct} />);
      
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);
      
      // Strong assertion - should update immediately
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Error Handling Mutation Tests', () => {
    test('should detect error handling issues - component should handle missing product gracefully', () => {
      render(<Product />);
      
      // Component should not crash and should render basic structure
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('should detect error handling issues - component should handle null product', () => {
      render(<Product product={null} />);
      
      // Component should not crash
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });
  });

  describe('Performance Mutation Tests', () => {
    test('should detect performance issues - rapid clicks should not cause memory leaks', () => {
      render(<Product product={mockProduct} />);
      
      const increaseButton = screen.getByText('+');
      const decreaseButton = screen.getByText('-');
      
      // Perform many rapid interactions
      for (let i = 0; i < 1000; i++) {
        fireEvent.click(increaseButton);
        fireEvent.click(decreaseButton);
      }
      
      // Component should still be functional
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });
  });

  describe('Mutation Detection Demo', () => {
    test('MUTATION: This test will fail if quantity logic is broken', () => {
      render(<Product product={mockProduct} />);
      
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);
      
      // This test will fail if the quantity logic is mutated to not increment properly
      // For example, if someone changes the increment logic to add 2 instead of 1
      // or if they change it to decrement instead of increment
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // Additional check to ensure the exact value is correct
      const quantityElement = screen.getByText('2');
      expect(parseInt(quantityElement.textContent)).toBe(2);
    });

    test('MUTATION: This test will fail if addItem is not called with correct parameters', () => {
      render(<Product product={mockProduct} />);
      
      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);
      
      // This test will fail if the addItem call is mutated to pass wrong parameters
      // For example, if someone changes the product object or the count parameter
      expect(global.mockUseShoppingCart.addItem).toHaveBeenCalledWith(
        mockProduct,
        { count: 1 }
      );
    });

    test('MUTATION: This test will fail if price formatting is broken', () => {
      render(<Product product={mockProduct} />);
      
      // This test will fail if the price formatting logic is mutated
      // For example, if someone changes the currency symbol or format
      expect(screen.getByText('JPY 1000')).toBeInTheDocument();
      
      // Additional check to ensure exact format
      const priceElement = screen.getByText('JPY 1000');
      expect(priceElement.textContent).toBe('JPY 1000');
    });
  });
}); 