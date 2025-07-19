import React from 'react';
import { render, screen } from '@testing-library/react';
import ShoppingCart from '@/components/ShoppingCart';

beforeEach(() => {
  jest.clearAllMocks();
  // Reset mock shopping cart state
  global.mockUseShoppingCart.shouldDisplayCart = false;
  global.mockUseShoppingCart.cartCount = 0;
  global.mockUseShoppingCart.cartDetails = {};
});

describe('ShoppingCart Component - Unit Tests', () => {
  describe('Cart Display Logic', () => {
    test('should show cart when shouldDisplayCart is true', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { id: 'item1', name: 'Test Item', price: 100, quantity: 1 }
      };
      
      render(<ShoppingCart />);
      
      expect(screen.getByText('Test Item')).toBeInTheDocument();
      expect(screen.getByText('Total: ￥100(1)')).toBeInTheDocument();
    });

    test('should hide cart when shouldDisplayCart is false', () => {
      global.mockUseShoppingCart.shouldDisplayCart = false;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { id: 'item1', name: 'Test Item', price: 100, quantity: 1 }
      };
      
      render(<ShoppingCart />);
      
      const cartContainer = screen.getByText('Test Item').closest('div');
      expect(cartContainer).toHaveClass('opacity-0');
    });

    test('should show empty cart message when cart is empty', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 0;
      global.mockUseShoppingCart.cartDetails = {};
      
      render(<ShoppingCart />);
      
      expect(screen.getByText('You have no items in your cart')).toBeInTheDocument();
    });
  });

  describe('Cart Items Display', () => {
    test('should display single cart item correctly', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 1,
          emoji: '🍕'
        }
      };
      
      render(<ShoppingCart />);
      
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
      expect(screen.getByText('￥1200')).toBeInTheDocument();
    });

    test('should display multiple cart items correctly', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 2;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 1,
          emoji: '🍕'
        },
        'item2': { 
          id: 'item2', 
          name: 'Burger', 
          price: 800, 
          quantity: 2,
          emoji: '🍔'
        }
      };
      
      render(<ShoppingCart />);
      
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Burger')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
      expect(screen.getByText('(2)')).toBeInTheDocument();
      expect(screen.getByText('￥1200')).toBeInTheDocument();
      expect(screen.getByText('￥800')).toBeInTheDocument();
    });
  });

  describe('Total Price Calculation', () => {
    test('should calculate total price for single item', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 1
        }
      };
      
      render(<ShoppingCart />);
      
      expect(screen.getByText('Total: ￥1200(1)')).toBeInTheDocument();
    });

    test('should calculate total price for multiple items', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 2;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 1
        },
        'item2': { 
          id: 'item2', 
          name: 'Burger', 
          price: 800, 
          quantity: 2
        }
      };
      
      render(<ShoppingCart />);
      
      // Total: 1200 + (800 * 2) = 2800, Quantity: 1 + 2 = 3
      expect(screen.getByText('Total: ￥2800(3)')).toBeInTheDocument();
    });

    test('should calculate total price for items with quantity > 1', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 3
        }
      };
      
      render(<ShoppingCart />);
      
      // Total: 1200 * 3 = 3600, Quantity: 3
      expect(screen.getByText('Total: ￥3600(3)')).toBeInTheDocument();
    });
  });

  describe('Total Quantity Calculation', () => {
    test('should calculate total quantity for single item', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 1
        }
      };
      
      render(<ShoppingCart />);
      
      expect(screen.getByText('Total: ￥1200(1)')).toBeInTheDocument();
    });

    test('should calculate total quantity for multiple items', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 3;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 2
        },
        'item2': { 
          id: 'item2', 
          name: 'Burger', 
          price: 800, 
          quantity: 1
        }
      };
      
      render(<ShoppingCart />);
      
      // Total quantity: 2 + 1 = 3
      expect(screen.getByText('Total: ￥3200(3)')).toBeInTheDocument();
    });
  });

  describe('Cart Structure', () => {
    test('should render cart with correct CSS classes', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 1
        }
      };
      
      render(<ShoppingCart />);
      
      const cartContainer = screen.getByText('Pizza').closest('div');
      expect(cartContainer).toHaveClass(
        'bg-white',
        'flex',
        'flex-col',
        'absolute',
        'right-3',
        'md:right-9',
        'top-14',
        'w-80',
        'py-4',
        'px-4',
        'shadow-[0_5px_15px_0_rgba(0,0,0,.15)]',
        'rounded-md',
        'transition-opacity',
        'duration-500'
      );
    });

    test('should include checkout button when cart has items', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 1
        }
      };
      
      render(<ShoppingCart />);
      
      expect(screen.getByText('Proceed to checkout')).toBeInTheDocument();
    });

    test('should not include checkout button when cart is empty', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 0;
      global.mockUseShoppingCart.cartDetails = {};
      
      render(<ShoppingCart />);
      
      expect(screen.queryByText('Proceed to checkout')).not.toBeInTheDocument();
    });
  });

  describe('Empty Cart State', () => {
    test('should display empty cart message with correct styling', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 0;
      global.mockUseShoppingCart.cartDetails = {};
      
      render(<ShoppingCart />);
      
      const emptyMessage = screen.getByText('You have no items in your cart');
      expect(emptyMessage).toBeInTheDocument();
      expect(emptyMessage.closest('div')).toHaveClass('p-5');
    });
  });

  describe('Cart Visibility Transitions', () => {
    test('should apply opacity transition when cart is visible', () => {
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 1
        }
      };
      
      render(<ShoppingCart />);
      
      const cartContainer = screen.getByText('Pizza').closest('div');
      expect(cartContainer).toHaveClass('opacity-100');
    });

    test('should apply opacity transition when cart is hidden', () => {
      global.mockUseShoppingCart.shouldDisplayCart = false;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'item1': { 
          id: 'item1', 
          name: 'Pizza', 
          price: 1200, 
          quantity: 1
        }
      };
      
      render(<ShoppingCart />);
      
      const cartContainer = screen.getByText('Pizza').closest('div');
      expect(cartContainer).toHaveClass('opacity-0');
    });
  });
}); 