import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutButton from '@/components/CheckoutButton';

beforeEach(() => {
  jest.clearAllMocks();
  // Reset mock shopping cart state
  global.mockUseShoppingCart.cartCount = 0;
  global.mockUseShoppingCart.totalPrice = 0;
  global.mockUseShoppingCart.redirectToCheckout.mockClear();
});

describe('CheckoutButton Component - Unit Tests', () => {
  describe('Button State Management', () => {
    test('should render button with "Proceed to checkout" text initially', () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      
      render(<CheckoutButton />);
      
      expect(screen.getByText('Proceed to checkout')).toBeInTheDocument();
    });

    test('should change button text to "Loading..." when clicked', async () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    test('should return to "Proceed to checkout" text after loading completes', async () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockResolvedValue({});
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Proceed to checkout')).toBeInTheDocument();
      });
    });
  });

  describe('Cart Validation', () => {
    test('should disable button when cart is empty', () => {
      global.mockUseShoppingCart.cartCount = 0;
      global.mockUseShoppingCart.totalPrice = 0;
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      expect(button).toBeDisabled();
    });

    test('should disable button when total price is below minimum', () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 20; // Below £0.30 minimum
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      expect(button).toBeDisabled();
    });

    test('should disable button when cart has too many items', () => {
      global.mockUseShoppingCart.cartCount = 25; // Above 20 item limit
      global.mockUseShoppingCart.totalPrice = 1000;
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      expect(button).toBeDisabled();
    });

    test('should enable button when cart is valid', () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Error Messages', () => {
    test('should show minimum price error message', () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 20;
      
      render(<CheckoutButton />);
      
      expect(screen.getByText('You must have at least £0.30 in your basket')).toBeInTheDocument();
    });

    test('should show maximum items error message', () => {
      global.mockUseShoppingCart.cartCount = 25;
      global.mockUseShoppingCart.totalPrice = 1000;
      
      render(<CheckoutButton />);
      
      expect(screen.getByText('You cannot have more than 20 items')).toBeInTheDocument();
    });

    test('should show redirect error message when checkout fails', async () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockResolvedValue({ error: 'Checkout failed' });
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Unable to redirect to Stripe checkout page')).toBeInTheDocument();
      });
    });

    test('should show no items error message when cart is empty', () => {
      global.mockUseShoppingCart.cartCount = 0;
      global.mockUseShoppingCart.totalPrice = 0;
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      fireEvent.click(button);
      
      expect(screen.getByText('Please add some items to your cart')).toBeInTheDocument();
    });

    test('should not show error messages when cart is valid', () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      
      render(<CheckoutButton />);
      
      const errorContainer = screen.getByText('Proceed to checkout').closest('article').querySelector('.text-red-700');
      expect(errorContainer.textContent.trim()).toBe('');
    });
  });

  describe('Checkout Process', () => {
    test('should call redirectToCheckout when button is clicked', async () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockResolvedValue({});
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(global.mockUseShoppingCart.redirectToCheckout).toHaveBeenCalled();
      });
    });

    test('should handle successful checkout redirect', async () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockResolvedValue({});
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Proceed to checkout')).toBeInTheDocument();
      });
    });

    test('should handle checkout redirect error', async () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockResolvedValue({ error: 'Network error' });
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Unable to redirect to Stripe checkout page')).toBeInTheDocument();
      });
    });

    test('should handle checkout redirect exception', async () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockRejectedValue(new Error('Network error'));
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Unable to redirect to Stripe checkout page')).toBeInTheDocument();
      });
    });
  });

  describe('Button Styling', () => {
    test('should apply correct CSS classes to enabled button', () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      expect(button).toHaveClass(
        'bg-emerald-50',
        'hover:bg-emerald-500',
        'hover:text-white',
        'transition-colors',
        'duration-500',
        'text-emerald-500',
        'py-3',
        'px-5',
        'rounded-md',
        'w-100'
      );
    });

    test('should apply disabled styling when button is disabled', () => {
      global.mockUseShoppingCart.cartCount = 0;
      global.mockUseShoppingCart.totalPrice = 0;
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      expect(button).toHaveClass(
        'disabled:bg-slate-300',
        'disabled:cursor-not-allowed',
        'disabled:text-white'
      );
      expect(button).toBeDisabled();
    });
  });

  describe('Error Message Styling', () => {
    test('should apply correct CSS classes to error message container', () => {
      global.mockUseShoppingCart.cartCount = 0;
      global.mockUseShoppingCart.totalPrice = 0;
      
      render(<CheckoutButton />);
      
      const errorContainer = screen.getByText('Please add some items to your cart').closest('div');
      expect(errorContainer).toHaveClass(
        'text-red-700',
        'text-xs',
        'mb-3',
        'h-5',
        'text-center'
      );
    });
  });

  describe('Event Handling', () => {
    test('should prevent default form submission', async () => {
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockResolvedValue({});
      
      render(<CheckoutButton />);
      
      const button = screen.getByText('Proceed to checkout');
      const mockPreventDefault = jest.fn();
      
      fireEvent.click(button, { preventDefault: mockPreventDefault });
      
      await waitFor(() => {
        expect(global.mockUseShoppingCart.redirectToCheckout).toHaveBeenCalled();
      });
    });
  });
}); 