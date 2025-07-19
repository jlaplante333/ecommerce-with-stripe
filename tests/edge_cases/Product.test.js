import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Product from '@/components/Product';

beforeEach(() => {
  jest.clearAllMocks();
  global.mockUseShoppingCart.addItem.mockClear();
});

describe('Product Component - Edge Cases', () => {
  describe('Invalid Product Data', () => {
    test('should handle product with missing name', () => {
      const productWithMissingName = {
        product_id: "prod_test123",
        price_id: "price_test123",
        price: 1000,
        emoji: "🍕",
        currency: "JPY"
      };
      
      render(<Product product={productWithMissingName} />);
      
      // Should not crash and should still render other elements
      expect(screen.getByText('🍕')).toBeInTheDocument();
      expect(screen.getByText('JPY 1000')).toBeInTheDocument();
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });

    test('should handle product with missing price', () => {
      const productWithMissingPrice = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "Test Product",
        emoji: "🍕",
        currency: "JPY"
      };
      
      render(<Product product={productWithMissingPrice} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('🍕')).toBeInTheDocument();
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });

    test('should handle product with missing emoji', () => {
      const productWithMissingEmoji = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "Test Product",
        price: 1000,
        currency: "JPY"
      };
      
      render(<Product product={productWithMissingEmoji} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('JPY 1000')).toBeInTheDocument();
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });

    test('should handle product with null values', () => {
      const productWithNullValues = {
        product_id: null,
        price_id: null,
        name: null,
        price: null,
        emoji: null,
        currency: null
      };
      
      render(<Product product={productWithNullValues} />);
      
      // Should not crash and should render basic structure
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('should handle product with undefined values', () => {
      const productWithUndefinedValues = {
        product_id: undefined,
        price_id: undefined,
        name: undefined,
        price: undefined,
        emoji: undefined,
        currency: undefined
      };
      
      render(<Product product={productWithUndefinedValues} />);
      
      // Should not crash and should render basic structure
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('Extreme Price Values', () => {
    test('should handle zero price', () => {
      const productWithZeroPrice = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "Free Product",
        price: 0,
        emoji: "🎁",
        currency: "JPY"
      };
      
      render(<Product product={productWithZeroPrice} />);
      
      expect(screen.getByText('Free Product')).toBeInTheDocument();
      expect(screen.getByText('JPY 0')).toBeInTheDocument();
    });

    test('should handle very large price', () => {
      const productWithLargePrice = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "Expensive Product",
        price: 999999999,
        emoji: "💎",
        currency: "JPY"
      };
      
      render(<Product product={productWithLargePrice} />);
      
      expect(screen.getByText('Expensive Product')).toBeInTheDocument();
      expect(screen.getByText('JPY 999999999')).toBeInTheDocument();
    });

    test('should handle negative price', () => {
      const productWithNegativePrice = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "Negative Price Product",
        price: -100,
        emoji: "📉",
        currency: "JPY"
      };
      
      render(<Product product={productWithNegativePrice} />);
      
      expect(screen.getByText('Negative Price Product')).toBeInTheDocument();
      expect(screen.getByText('JPY -100')).toBeInTheDocument();
    });

    test('should handle decimal price', () => {
      const productWithDecimalPrice = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "Decimal Price Product",
        price: 99.99,
        emoji: "💰",
        currency: "JPY"
      };
      
      render(<Product product={productWithDecimalPrice} />);
      
      expect(screen.getByText('Decimal Price Product')).toBeInTheDocument();
      expect(screen.getByText('JPY 99.99')).toBeInTheDocument();
    });
  });

  describe('Extreme Quantity Values', () => {
    test('should handle rapid quantity increases', () => {
      render(<Product product={{ name: "Test", price: 100, emoji: "🍕" }} />);
      
      const increaseButton = screen.getByText('+');
      
      // Rapidly click increase button multiple times
      for (let i = 0; i < 10; i++) {
        fireEvent.click(increaseButton);
      }
      
      expect(screen.getByText('11')).toBeInTheDocument();
    });

    test('should handle rapid quantity decreases', () => {
      render(<Product product={{ name: "Test", price: 100, emoji: "🍕" }} />);
      
      const increaseButton = screen.getByText('+');
      const decreaseButton = screen.getByText('-');
      
      // Increase to 5 first
      for (let i = 0; i < 4; i++) {
        fireEvent.click(increaseButton);
      }
      
      // Then rapidly decrease
      for (let i = 0; i < 10; i++) {
        fireEvent.click(decreaseButton);
      }
      
      // Should not go below 1
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('should handle very large quantity', () => {
      render(<Product product={{ name: "Test", price: 100, emoji: "🍕" }} />);
      
      const increaseButton = screen.getByText('+');
      
      // Click increase button many times
      for (let i = 0; i < 1000; i++) {
        fireEvent.click(increaseButton);
      }
      
      expect(screen.getByText('1001')).toBeInTheDocument();
    });
  });

  describe('Special Characters and Unicode', () => {
    test('should handle product name with special characters', () => {
      const productWithSpecialChars = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "Product with 🎉 & <script>alert('xss')</script> & 'quotes'",
        price: 1000,
        emoji: "🍕",
        currency: "JPY"
      };
      
      render(<Product product={productWithSpecialChars} />);
      
      expect(screen.getByText("Product with 🎉 & <script>alert('xss')</script> & 'quotes'")).toBeInTheDocument();
    });

    test('should handle emoji with multiple characters', () => {
      const productWithComplexEmoji = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "Complex Emoji Product",
        price: 1000,
        emoji: "👨‍👩‍👧‍👦", // Family emoji (multiple unicode characters)
        currency: "JPY"
      };
      
      render(<Product product={productWithComplexEmoji} />);
      
      expect(screen.getByText('👨‍👩‍👧‍👦')).toBeInTheDocument();
    });

    test('should handle currency with special characters', () => {
      const productWithSpecialCurrency = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "Special Currency Product",
        price: 1000,
        emoji: "💱",
        currency: "€"
      };
      
      render(<Product product={productWithSpecialCurrency} />);
      
      expect(screen.getByText('€ 1000')).toBeInTheDocument();
    });
  });

  describe('Empty and Whitespace Values', () => {
    test('should handle empty string product name', () => {
      const productWithEmptyName = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "",
        price: 1000,
        emoji: "🍕",
        currency: "JPY"
      };
      
      render(<Product product={productWithEmptyName} />);
      
      expect(screen.getByText('🍕')).toBeInTheDocument();
      expect(screen.getByText('JPY 1000')).toBeInTheDocument();
    });

    test('should handle whitespace-only product name', () => {
      const productWithWhitespaceName = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "   ",
        price: 1000,
        emoji: "🍕",
        currency: "JPY"
      };
      
      render(<Product product={productWithWhitespaceName} />);
      
      expect(screen.getByText('🍕')).toBeInTheDocument();
      expect(screen.getByText('JPY 1000')).toBeInTheDocument();
    });

    test('should handle empty emoji', () => {
      const productWithEmptyEmoji = {
        product_id: "prod_test123",
        price_id: "price_test123",
        name: "No Emoji Product",
        price: 1000,
        emoji: "",
        currency: "JPY"
      };
      
      render(<Product product={productWithEmptyEmoji} />);
      
      expect(screen.getByText('No Emoji Product')).toBeInTheDocument();
      expect(screen.getByText('JPY 1000')).toBeInTheDocument();
    });
  });

  describe('Component Props Edge Cases', () => {
    test('should handle missing product prop', () => {
      render(<Product />);
      
      // Should not crash and should render basic structure
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('should handle null product prop', () => {
      render(<Product product={null} />);
      
      // Should not crash and should render basic structure
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('should handle undefined product prop', () => {
      render(<Product product={undefined} />);
      
      // Should not crash and should render basic structure
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
}); 