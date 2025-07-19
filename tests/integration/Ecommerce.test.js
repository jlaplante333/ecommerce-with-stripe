import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Product from '@/components/Product';
import ShoppingCart from '@/components/ShoppingCart';
import CheckoutButton from '@/components/CheckoutButton';
import CartItem from '@/components/CartItem';

beforeEach(() => {
  jest.clearAllMocks();
  // Reset mock shopping cart state
  global.mockUseShoppingCart.shouldDisplayCart = false;
  global.mockUseShoppingCart.cartCount = 0;
  global.mockUseShoppingCart.cartDetails = {};
  global.mockUseShoppingCart.totalPrice = 0;
  global.mockUseShoppingCart.addItem.mockClear();
  global.mockUseShoppingCart.removeItem.mockClear();
  global.mockUseShoppingCart.redirectToCheckout.mockClear();
});

describe('E-commerce Application - Integration Tests', () => {
  const mockProduct = {
    product_id: "prod_test123",
    price_id: "price_test123",
    name: "Test Pizza",
    price: 1200,
    emoji: "🍕",
    currency: "JPY"
  };

  describe('Product to Cart Flow', () => {
    test('should add product to cart and update cart display', async () => {
      // Arrange
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.addItem.mockImplementation((product, options) => {
        global.mockUseShoppingCart.cartCount = 1;
        global.mockUseShoppingCart.cartDetails = {
          [product.product_id]: {
            id: product.product_id,
            name: product.name,
            price: product.price,
            quantity: options.count,
            emoji: product.emoji
          }
        };
        global.mockUseShoppingCart.totalPrice = product.price * options.count;
      });

      // Act
      render(
        <div>
          <Product product={mockProduct} />
          <ShoppingCart />
        </div>
      );

      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);

      // Assert
      await waitFor(() => {
        expect(global.mockUseShoppingCart.addItem).toHaveBeenCalledWith(
          mockProduct,
          { count: 1 }
        );
      });

      // Cart should display the added item
      expect(screen.getByText('Test Pizza')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
      expect(screen.getByText('￥1200')).toBeInTheDocument();
    });

    test('should add multiple quantities to cart', async () => {
      // Arrange
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.addItem.mockImplementation((product, options) => {
        global.mockUseShoppingCart.cartCount = 1;
        global.mockUseShoppingCart.cartDetails = {
          [product.product_id]: {
            id: product.product_id,
            name: product.name,
            price: product.price,
            quantity: options.count,
            emoji: product.emoji
          }
        };
        global.mockUseShoppingCart.totalPrice = product.price * options.count;
      });

      // Act
      render(
        <div>
          <Product product={mockProduct} />
          <ShoppingCart />
        </div>
      );

      // Increase quantity to 3
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);
      fireEvent.click(increaseButton);

      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);

      // Assert
      await waitFor(() => {
        expect(global.mockUseShoppingCart.addItem).toHaveBeenCalledWith(
          mockProduct,
          { count: 3 }
        );
      });

      // Cart should display correct quantity and total
      expect(screen.getByText('Test Pizza')).toBeInTheDocument();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(screen.getByText('￥3600')).toBeInTheDocument();
    });
  });

  describe('Cart Management Integration', () => {
    test('should remove item from cart and update display', async () => {
      // Arrange
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'prod_test123': {
          id: 'prod_test123',
          name: 'Test Pizza',
          price: 1200,
          quantity: 1,
          emoji: '🍕'
        }
      };
      global.mockUseShoppingCart.totalPrice = 1200;

      global.mockUseShoppingCart.removeItem.mockImplementation((itemId) => {
        delete global.mockUseShoppingCart.cartDetails[itemId];
        global.mockUseShoppingCart.cartCount = 0;
        global.mockUseShoppingCart.totalPrice = 0;
      });

      // Act
      render(<ShoppingCart />);

      const deleteButton = screen.getByAltText('delete icon').closest('button');
      fireEvent.click(deleteButton);

      // Assert
      await waitFor(() => {
        expect(global.mockUseShoppingCart.removeItem).toHaveBeenCalledWith('prod_test123');
      });

      // Cart should show empty state
      expect(screen.getByText('You have no items in your cart')).toBeInTheDocument();
    });

    test('should handle multiple items in cart', () => {
      // Arrange
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 2;
      global.mockUseShoppingCart.cartDetails = {
        'prod_test123': {
          id: 'prod_test123',
          name: 'Test Pizza',
          price: 1200,
          quantity: 1,
          emoji: '🍕'
        },
        'prod_test456': {
          id: 'prod_test456',
          name: 'Test Burger',
          price: 800,
          quantity: 2,
          emoji: '🍔'
        }
      };
      global.mockUseShoppingCart.totalPrice = 2800;

      // Act
      render(<ShoppingCart />);

      // Assert
      expect(screen.getByText('Test Pizza')).toBeInTheDocument();
      expect(screen.getByText('Test Burger')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
      expect(screen.getByText('(2)')).toBeInTheDocument();
      expect(screen.getByText('Total: ￥2800(3)')).toBeInTheDocument();
    });
  });

  describe('Checkout Process Integration', () => {
    test('should enable checkout button when cart has valid items', () => {
      // Arrange
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;

      // Act
      render(<CheckoutButton />);

      // Assert
      const checkoutButton = screen.getByText('Proceed to checkout');
      expect(checkoutButton).not.toBeDisabled();
    });

    test('should disable checkout button when cart is empty', () => {
      // Arrange
      global.mockUseShoppingCart.cartCount = 0;
      global.mockUseShoppingCart.totalPrice = 0;

      // Act
      render(<CheckoutButton />);

      // Assert
      const checkoutButton = screen.getByText('Proceed to checkout');
      expect(checkoutButton).toBeDisabled();
    });

    test('should handle successful checkout redirect', async () => {
      // Arrange
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockResolvedValue({});

      // Act
      render(<CheckoutButton />);

      const checkoutButton = screen.getByText('Proceed to checkout');
      fireEvent.click(checkoutButton);

      // Assert
      await waitFor(() => {
        expect(global.mockUseShoppingCart.redirectToCheckout).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText('Proceed to checkout')).toBeInTheDocument();
      });
    });

    test('should handle checkout redirect error', async () => {
      // Arrange
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.totalPrice = 1000;
      global.mockUseShoppingCart.redirectToCheckout.mockResolvedValue({ error: 'Checkout failed' });

      // Act
      render(<CheckoutButton />);

      const checkoutButton = screen.getByText('Proceed to checkout');
      fireEvent.click(checkoutButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Unable to redirect to Stripe checkout page')).toBeInTheDocument();
      });
    });
  });

  describe('Full Shopping Flow', () => {
    test('should complete full shopping flow: add items, manage cart, checkout', async () => {
      // Arrange
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.addItem.mockImplementation((product, options) => {
        global.mockUseShoppingCart.cartCount = 1;
        global.mockUseShoppingCart.cartDetails = {
          [product.product_id]: {
            id: product.product_id,
            name: product.name,
            price: product.price,
            quantity: options.count,
            emoji: product.emoji
          }
        };
        global.mockUseShoppingCart.totalPrice = product.price * options.count;
      });

      global.mockUseShoppingCart.redirectToCheckout.mockResolvedValue({});

      // Act - Add product to cart
      render(
        <div>
          <Product product={mockProduct} />
          <ShoppingCart />
          <CheckoutButton />
        </div>
      );

      // Add product with quantity 2
      const increaseButton = screen.getByText('+');
      fireEvent.click(increaseButton);

      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);

      // Assert - Cart should be updated
      await waitFor(() => {
        expect(screen.getByText('Test Pizza')).toBeInTheDocument();
        expect(screen.getByText('(2)')).toBeInTheDocument();
        expect(screen.getByText('￥2400')).toBeInTheDocument();
      });

      // Act - Proceed to checkout
      const checkoutButton = screen.getByText('Proceed to checkout');
      fireEvent.click(checkoutButton);

      // Assert - Checkout should be initiated
      await waitFor(() => {
        expect(global.mockUseShoppingCart.redirectToCheckout).toHaveBeenCalled();
      });
    });
  });

  describe('Cart State Synchronization', () => {
    test('should synchronize cart state across components', async () => {
      // Arrange
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.addItem.mockImplementation((product, options) => {
        global.mockUseShoppingCart.cartCount = 1;
        global.mockUseShoppingCart.cartDetails = {
          [product.product_id]: {
            id: product.product_id,
            name: product.name,
            price: product.price,
            quantity: options.count,
            emoji: product.emoji
          }
        };
        global.mockUseShoppingCart.totalPrice = product.price * options.count;
      });

      // Act
      render(
        <div>
          <Product product={mockProduct} />
          <ShoppingCart />
          <CheckoutButton />
        </div>
      );

      // Add item to cart
      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);

      // Assert - All components should reflect the same cart state
      await waitFor(() => {
        // Shopping cart should show the item
        expect(screen.getByText('Test Pizza')).toBeInTheDocument();
        expect(screen.getByText('Total: ￥1200(1)')).toBeInTheDocument();

        // Checkout button should be enabled
        const checkoutButton = screen.getByText('Proceed to checkout');
        expect(checkoutButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle addItem errors gracefully', async () => {
      // Arrange
      global.mockUseShoppingCart.addItem.mockImplementation(() => {
        throw new Error('Failed to add item');
      });

      // Act
      render(<Product product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to cart');
      fireEvent.click(addToCartButton);

      // Assert - Component should not crash
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });

    test('should handle removeItem errors gracefully', async () => {
      // Arrange
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 1;
      global.mockUseShoppingCart.cartDetails = {
        'prod_test123': {
          id: 'prod_test123',
          name: 'Test Pizza',
          price: 1200,
          quantity: 1,
          emoji: '🍕'
        }
      };

      global.mockUseShoppingCart.removeItem.mockImplementation(() => {
        throw new Error('Failed to remove item');
      });

      // Act
      render(<ShoppingCart />);

      const deleteButton = screen.getByAltText('delete icon').closest('button');
      fireEvent.click(deleteButton);

      // Assert - Component should not crash
      expect(screen.getByText('Test Pizza')).toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    test('should handle large cart operations efficiently', async () => {
      // Arrange
      global.mockUseShoppingCart.shouldDisplayCart = true;
      global.mockUseShoppingCart.cartCount = 10;
      global.mockUseShoppingCart.cartDetails = {};

      // Create 10 different items
      for (let i = 0; i < 10; i++) {
        global.mockUseShoppingCart.cartDetails[`prod_${i}`] = {
          id: `prod_${i}`,
          name: `Product ${i}`,
          price: 100 * (i + 1),
          quantity: i + 1,
          emoji: '🍕'
        };
      }

      global.mockUseShoppingCart.totalPrice = 5500;

      // Act
      render(<ShoppingCart />);

      // Assert - Should render all items without performance issues
      for (let i = 0; i < 10; i++) {
        expect(screen.getByText(`Product ${i}`)).toBeInTheDocument();
      }

      expect(screen.getByText('Total: ￥5500(55)')).toBeInTheDocument();
    });
  });
}); 