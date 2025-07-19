import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '@/components/CartItem';

beforeEach(() => {
  jest.clearAllMocks();
  global.mockUseShoppingCart.removeItem.mockClear();
});

describe('CartItem Component - Unit Tests', () => {
  const mockItem = {
    id: 'item1',
    name: 'Pizza',
    emoji: '🍕',
    quantity: 2,
    price: 1200
  };

  describe('Item Display', () => {
    test('should render item information correctly', () => {
      render(<CartItem item={mockItem} />);
      
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('🍕')).toBeInTheDocument();
      expect(screen.getByText('(2)')).toBeInTheDocument();
      expect(screen.getByText('￥1200')).toBeInTheDocument();
    });

    test('should display emoji with correct size', () => {
      render(<CartItem item={mockItem} />);
      
      const emojiElement = screen.getByText('🍕');
      expect(emojiElement).toHaveClass('text-4xl');
    });

    test('should display quantity in parentheses', () => {
      render(<CartItem item={mockItem} />);
      
      const quantityElement = screen.getByText('(2)');
      expect(quantityElement).toHaveClass('text-xs');
    });

    test('should display price with yen symbol', () => {
      render(<CartItem item={mockItem} />);
      
      expect(screen.getByText('￥1200')).toBeInTheDocument();
    });
  });

  describe('Remove Item Functionality', () => {
    test('should call removeItem when delete button is clicked', () => {
      render(<CartItem item={mockItem} />);
      
      const deleteButton = screen.getByAltText('delete icon').closest('button');
      fireEvent.click(deleteButton);
      
      expect(global.mockUseShoppingCart.removeItem).toHaveBeenCalledWith('item1');
    });

    test('should call removeItem with correct item ID', () => {
      const itemWithDifferentId = { ...mockItem, id: 'different-id' };
      render(<CartItem item={itemWithDifferentId} />);
      
      const deleteButton = screen.getByAltText('delete icon').closest('button');
      fireEvent.click(deleteButton);
      
      expect(global.mockUseShoppingCart.removeItem).toHaveBeenCalledWith('different-id');
    });
  });

  describe('Button Styling', () => {
    test('should apply correct CSS classes to delete button', () => {
      render(<CartItem item={mockItem} />);
      
      const deleteButton = screen.getByAltText('delete icon').closest('button');
      expect(deleteButton).toHaveClass(
        'hover:bg-emerald-50',
        'transition-colors',
        'rounded-full',
        'duration-500',
        'p-1'
      );
    });

    test('should render delete icon with correct dimensions', () => {
      render(<CartItem item={mockItem} />);
      
      const deleteIcon = screen.getByAltText('delete icon');
      expect(deleteIcon).toHaveAttribute('width', '20');
      expect(deleteIcon).toHaveAttribute('height', '20');
    });
  });

  describe('Layout Structure', () => {
    test('should render with correct flex layout classes', () => {
      render(<CartItem item={mockItem} />);
      
      const container = screen.getByText('Pizza').closest('div');
      expect(container).toHaveClass('flex', 'items-center', 'gap-4', 'mb-3');
    });

    test('should position price on the right side', () => {
      render(<CartItem item={mockItem} />);
      
      const priceElement = screen.getByText('￥1200');
      expect(priceElement.closest('div')).toHaveClass('ml-auto');
    });
  });

  describe('Item Information Layout', () => {
    test('should group name and quantity together', () => {
      render(<CartItem item={mockItem} />);
      
      const nameElement = screen.getByText('Pizza');
      const quantityElement = screen.getByText('(2)');
      
      // Both should be in the same container
      const container = nameElement.closest('div');
      expect(container).toContainElement(quantityElement);
    });

    test('should display item details in correct order', () => {
      render(<CartItem item={mockItem} />);
      
      const container = screen.getByText('Pizza').closest('div');
      const children = Array.from(container.children);
      
      // Should have: emoji, details div, price div, delete button
      expect(children).toHaveLength(4);
      expect(children[0]).toHaveTextContent('🍕'); // emoji
      expect(children[1]).toHaveTextContent('Pizza (2)'); // details
      expect(children[2]).toHaveTextContent('￥1200'); // price
      expect(children[3]).toContainElement(screen.getByAltText('delete icon')); // delete button
    });
  });

  describe('Different Quantity Values', () => {
    test('should display single quantity correctly', () => {
      const singleItem = { ...mockItem, quantity: 1 };
      render(<CartItem item={singleItem} />);
      
      expect(screen.getByText('(1)')).toBeInTheDocument();
    });

    test('should display large quantity correctly', () => {
      const largeQuantityItem = { ...mockItem, quantity: 99 };
      render(<CartItem item={largeQuantityItem} />);
      
      expect(screen.getByText('(99)')).toBeInTheDocument();
    });

    test('should display zero quantity correctly', () => {
      const zeroQuantityItem = { ...mockItem, quantity: 0 };
      render(<CartItem item={zeroQuantityItem} />);
      
      expect(screen.getByText('(0)')).toBeInTheDocument();
    });
  });

  describe('Different Price Values', () => {
    test('should display zero price correctly', () => {
      const freeItem = { ...mockItem, price: 0 };
      render(<CartItem item={freeItem} />);
      
      expect(screen.getByText('￥0')).toBeInTheDocument();
    });

    test('should display large price correctly', () => {
      const expensiveItem = { ...mockItem, price: 999999 };
      render(<CartItem item={expensiveItem} />);
      
      expect(screen.getByText('￥999999')).toBeInTheDocument();
    });

    test('should display decimal price correctly', () => {
      const decimalPriceItem = { ...mockItem, price: 99.99 };
      render(<CartItem item={decimalPriceItem} />);
      
      expect(screen.getByText('￥99.99')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper alt text for delete icon', () => {
      render(<CartItem item={mockItem} />);
      
      const deleteIcon = screen.getByAltText('delete icon');
      expect(deleteIcon).toBeInTheDocument();
    });

    test('should have clickable delete button', () => {
      render(<CartItem item={mockItem} />);
      
      const deleteButton = screen.getByAltText('delete icon').closest('button');
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).not.toBeDisabled();
    });
  });

  describe('Component Integration', () => {
    test('should work with shopping cart context', () => {
      render(<CartItem item={mockItem} />);
      
      // Should be able to remove item
      const deleteButton = screen.getByAltText('delete icon').closest('button');
      fireEvent.click(deleteButton);
      
      expect(global.mockUseShoppingCart.removeItem).toHaveBeenCalled();
    });

    test('should maintain item state during interactions', () => {
      render(<CartItem item={mockItem} />);
      
      // Item information should remain consistent
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('(2)')).toBeInTheDocument();
      expect(screen.getByText('￥1200')).toBeInTheDocument();
      
      // After clicking delete, item should still be displayed (until parent re-renders)
      const deleteButton = screen.getByAltText('delete icon').closest('button');
      fireEvent.click(deleteButton);
      
      expect(screen.getByText('Pizza')).toBeInTheDocument();
    });
  });
}); 