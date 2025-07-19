import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Product from '@/components/Product';

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  global.mockUseShoppingCart.addItem.mockClear();
});

describe('Product Component - Unit Tests', () => {
  const mockProduct = {
    product_id: "prod_test123",
    price_id: "price_test123",
    name: "Test Product",
    price: 1000,
    emoji: "🍕",
    currency: "JPY"
  };

  describe('Rendering', () => {
    test('should render product information correctly', () => {
      render(<Product product={mockProduct} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('🍕')).toBeInTheDocument();
      expect(screen.getByText('JPY 1000')).toBeInTheDocument();
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });

    test('should display quantity controls', () => {
      render(<Product product={mockProduct} />);
      
      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('should have correct initial quantity of 1', () => {
      render(<Product product={mockProduct} />);
      
      const quantityDisplay = screen.getByText('1');
      expect(quantityDisplay).toBeInTheDocument();
    });
  });

  describe('Quantity Controls', () => {
    test('should increase quantity when + button is clicked', () => {
      render(<Product product={mockProduct} />);
      
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);
      
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('should decrease quantity when - button is clicked', () => {
      render(<Product product={mockProduct} />);
      
      // First increase to 2
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);
      
      // Then decrease back to 1
      const decreaseButton = screen.getByText('-');
      fireEvent.click(decreaseButton);
      
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('should not decrease quantity below 1', () => {
      render(<Product product={mockProduct} />);
      
      const decreaseButton = screen.getByText('-');
      fireEvent.click(decreaseButton);
      
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('should allow multiple quantity increases', () => {
      render(<Product product={mockProduct} />);
      
      const increaseButton = screen.getByText('+');
      
      fireEvent.click(increaseButton);
      expect(screen.getByText('2')).toBeInTheDocument();
      
      fireEvent.click(increaseButton);
      expect(screen.getByText('3')).toBeInTheDocument();
      
      fireEvent.click(increaseButton);
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  describe('Add to Cart Functionality', () => {
    test('should call addItem with correct product and quantity', () => {
      render(<Product product={mockProduct} />);
      
      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);
      
      expect(global.mockUseShoppingCart.addItem).toHaveBeenCalledWith(
        mockProduct,
        { count: 1 }
      );
    });

    test('should call addItem with increased quantity', () => {
      render(<Product product={mockProduct} />);
      
      // Increase quantity to 3
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);
      
      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);
      
      expect(global.mockUseShoppingCart.addItem).toHaveBeenCalledWith(
        mockProduct,
        { count: 3 }
      );
    });

    test('should reset quantity to 1 after adding to cart', async () => {
      render(<Product product={mockProduct} />);
      
      // Increase quantity to 3
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      
      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);
      
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });
  });

  describe('Button Interactions', () => {
    test('should have hover effects on quantity buttons', () => {
      render(<Product product={mockProduct} />);
      
      const increaseButton = screen.getByText('+');
      const decreaseButton = screen.getByText('-');
      
      expect(increaseButton).toHaveClass('hover:text-emerald-500', 'hover:bg-emerald-50');
      expect(decreaseButton).toHaveClass('hover:text-emerald-500', 'hover:bg-emerald-50');
    });

    test('should have hover effects on add to cart button', () => {
      render(<Product product={mockProduct} />);
      
      const addToCartButton = screen.getByText('Add to cart');
      
      expect(addToCartButton).toHaveClass('hover:bg-emerald-500', 'hover:text-white');
    });
  });

  describe('Product Display', () => {
    test('should display large emoji', () => {
      render(<Product product={mockProduct} />);
      
      const emojiElement = screen.getByText('🍕');
      expect(emojiElement).toHaveClass('text-8xl');
    });

    test('should display product name in correct size', () => {
      render(<Product product={mockProduct} />);
      
      const nameElement = screen.getByText('Test Product');
      expect(nameElement).toHaveClass('text-lg');
    });

    test('should display price in correct format and size', () => {
      render(<Product product={mockProduct} />);
      
      const priceElement = screen.getByText('JPY 1000');
      expect(priceElement).toHaveClass('text-2xl', 'font-semibold');
    });
  });
}); 