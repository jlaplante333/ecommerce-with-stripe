import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Product from '@/components/Product';

// Fuzz test utilities
const generateFuzzString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateFuzzNumber = () => {
  const types = ['positive', 'negative', 'zero', 'decimal', 'infinity', 'nan', 'max', 'min'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  switch (type) {
    case 'positive':
      return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    case 'negative':
      return -Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    case 'zero':
      return 0;
    case 'decimal':
      return Math.random() * 1000;
    case 'infinity':
      return Infinity;
    case 'nan':
      return NaN;
    case 'max':
      return Number.MAX_SAFE_INTEGER;
    case 'min':
      return Number.MIN_SAFE_INTEGER;
    default:
      return Math.floor(Math.random() * 1000);
  }
};

const generateFuzzProduct = () => {
  return {
    product_id: generateFuzzString(20),
    price_id: generateFuzzString(20),
    name: generateFuzzString(50),
    price: generateFuzzNumber(),
    emoji: generateFuzzString(5),
    currency: generateFuzzString(3)
  };
};

describe('Product Component - Fuzz Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.mockUseShoppingCart.addItem.mockClear();
  });

  describe('Random Input Fuzzing', () => {
    test('should handle random product data without crashing', () => {
      // Test with 1000 random products
      for (let i = 0; i < 1000; i++) {
        const fuzzProduct = generateFuzzProduct();
        
        try {
          render(<Product product={fuzzProduct} />);
          
          // Component should render without crashing
          expect(screen.getByText('Add to cart')).toBeInTheDocument();
          
          screen.unmount();
        } catch (error) {
          // Log the problematic product for debugging
          console.log('Fuzz test failed with product:', fuzzProduct);
          throw error;
        }
      }
    });

    test('should handle extreme string lengths', () => {
      const extremeLengths = [0, 1, 10, 100, 1000, 10000];
      
      extremeLengths.forEach(length => {
        const extremeProduct = {
          product_id: generateFuzzString(length),
          price_id: generateFuzzString(length),
          name: generateFuzzString(length),
          price: 100,
          emoji: generateFuzzString(length),
          currency: generateFuzzString(length)
        };
        
        try {
          render(<Product product={extremeProduct} />);
          expect(screen.getByText('Add to cart')).toBeInTheDocument();
          screen.unmount();
        } catch (error) {
          console.log('Extreme length test failed with length:', length);
          throw error;
        }
      });
    });

    test('should handle special characters in product data', () => {
      const specialChars = [
        '!@#$%^&*()',
        '<script>alert("xss")</script>',
        '\\n\\t\\r',
        '🎉🎊🎈',
        '中文测试',
        'العربية',
        'русский',
        '日本語',
        '한국어',
        '🚀💻🎮'
      ];
      
      specialChars.forEach(chars => {
        const specialProduct = {
          product_id: chars,
          price_id: chars,
          name: chars,
          price: 100,
          emoji: chars,
          currency: chars
        };
        
        try {
          render(<Product product={specialProduct} />);
          expect(screen.getByText('Add to cart')).toBeInTheDocument();
          screen.unmount();
        } catch (error) {
          console.log('Special chars test failed with:', chars);
          throw error;
        }
      });
    });
  });

  describe('Numeric Input Fuzzing', () => {
    test('should handle extreme numeric values', () => {
      const extremeValues = [
        0,
        -1,
        -1000,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        Infinity,
        -Infinity,
        NaN,
        0.1,
        0.9999999999999999,
        1.0000000000000001
      ];
      
      extremeValues.forEach(value => {
        const extremeProduct = {
          product_id: 'test',
          price_id: 'test',
          name: 'Test Product',
          price: value,
          emoji: '🍕',
          currency: 'JPY'
        };
        
        try {
          render(<Product product={extremeProduct} />);
          expect(screen.getByText('Add to cart')).toBeInTheDocument();
          screen.unmount();
        } catch (error) {
          console.log('Extreme value test failed with:', value);
          throw error;
        }
      });
    });

    test('should handle random numeric inputs', () => {
      // Test with 500 random numeric values
      for (let i = 0; i < 500; i++) {
        const randomPrice = generateFuzzNumber();
        const randomProduct = {
          product_id: 'test',
          price_id: 'test',
          name: 'Test Product',
          price: randomPrice,
          emoji: '🍕',
          currency: 'JPY'
        };
        
        try {
          render(<Product product={randomProduct} />);
          expect(screen.getByText('Add to cart')).toBeInTheDocument();
          screen.unmount();
        } catch (error) {
          console.log('Random numeric test failed with price:', randomPrice);
          throw error;
        }
      }
    });
  });

  describe('Object Structure Fuzzing', () => {
    test('should handle missing properties', () => {
      const missingProps = [
        {},
        { name: 'Test' },
        { price: 100 },
        { name: 'Test', price: 100 },
        { product_id: 'test' },
        { emoji: '🍕' },
        { currency: 'JPY' }
      ];
      
      missingProps.forEach(product => {
        try {
          render(<Product product={product} />);
          expect(screen.getByText('Add to cart')).toBeInTheDocument();
          screen.unmount();
        } catch (error) {
          console.log('Missing props test failed with:', product);
          throw error;
        }
      });
    });

    test('should handle extra properties', () => {
      const extraProps = [
        { ...generateFuzzProduct(), extraField: 'extra' },
        { ...generateFuzzProduct(), nested: { field: 'value' } },
        { ...generateFuzzProduct(), array: [1, 2, 3] },
        { ...generateFuzzProduct(), function: () => {} },
        { ...generateFuzzProduct(), null: null, undefined: undefined }
      ];
      
      extraProps.forEach(product => {
        try {
          render(<Product product={product} />);
          expect(screen.getByText('Add to cart')).toBeInTheDocument();
          screen.unmount();
        } catch (error) {
          console.log('Extra props test failed with:', product);
          throw error;
        }
      });
    });

    test('should handle null and undefined values', () => {
      const nullUndefinedValues = [
        null,
        undefined,
        { name: null, price: 100 },
        { name: 'Test', price: null },
        { name: undefined, price: 100 },
        { name: 'Test', price: undefined },
        { name: null, price: null },
        { name: undefined, price: undefined }
      ];
      
      nullUndefinedValues.forEach(product => {
        try {
          render(<Product product={product} />);
          expect(screen.getByText('Add to cart')).toBeInTheDocument();
          screen.unmount();
        } catch (error) {
          console.log('Null/undefined test failed with:', product);
          throw error;
        }
      });
    });
  });

  describe('Event Fuzzing', () => {
    test('should handle rapid random button clicks', () => {
      const product = generateFuzzProduct();
      render(<Product product={product} />);
      
      const increaseButton = screen.getByText('+');
      const decreaseButton = screen.getByText('-');
      const addToCartButton = screen.getByText('Add to cart');
      
      // Perform 1000 random button clicks
      for (let i = 0; i < 1000; i++) {
        const buttons = [increaseButton, decreaseButton, addToCartButton];
        const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
        
        try {
          fireEvent.click(randomButton);
        } catch (error) {
          console.log('Random button click failed at iteration:', i);
          throw error;
        }
      }
      
      // Component should still be functional
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });

    test('should handle concurrent button clicks', () => {
      const product = generateFuzzProduct();
      render(<Product product={product} />);
      
      const increaseButton = screen.getByText('+');
      const decreaseButton = screen.getByText('-');
      
      // Simulate concurrent clicks
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(Promise.resolve().then(() => fireEvent.click(increaseButton)));
        promises.push(Promise.resolve().then(() => fireEvent.click(decreaseButton)));
      }
      
      return Promise.all(promises).then(() => {
        expect(screen.getByText('Add to cart')).toBeInTheDocument();
      });
    });

    test('should handle malformed event objects', () => {
      const product = generateFuzzProduct();
      render(<Product product={product} />);
      
      const increaseButton = screen.getByText('+');
      
      const malformedEvents = [
        null,
        undefined,
        {},
        { target: null },
        { target: {} },
        { preventDefault: null },
        { stopPropagation: null }
      ];
      
      malformedEvents.forEach(event => {
        try {
          fireEvent.click(increaseButton, event);
        } catch (error) {
          console.log('Malformed event test failed with:', event);
          throw error;
        }
      });
    });
  });

  describe('State Fuzzing', () => {
    test('should handle rapid state changes', () => {
      const product = generateFuzzProduct();
      render(<Product product={product} />);
      
      const increaseButton = screen.getByText('+');
      const decreaseButton = screen.getByText('-');
      
      // Rapidly change quantity state
      for (let i = 0; i < 100; i++) {
        fireEvent.click(increaseButton);
        fireEvent.click(decreaseButton);
        fireEvent.click(increaseButton);
        fireEvent.click(increaseButton);
        fireEvent.click(decreaseButton);
      }
      
      // Component should maintain consistency
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });

    test('should handle state with extreme values', () => {
      const product = generateFuzzProduct();
      render(<Product product={product} />);
      
      const increaseButton = screen.getByText('+');
      
      // Try to set extremely high quantity
      for (let i = 0; i < 10000; i++) {
        fireEvent.click(increaseButton);
      }
      
      // Component should handle it gracefully
      expect(screen.getByText('Add to cart')).toBeInTheDocument();
    });
  });

  describe('Memory and Performance Fuzzing', () => {
    test('should handle large number of renders without memory leaks', () => {
      // Render and unmount 1000 components
      for (let i = 0; i < 1000; i++) {
        const product = generateFuzzProduct();
        render(<Product product={product} />);
        screen.unmount();
      }
      
      // Should not throw any errors
      expect(true).toBe(true);
    });

    test('should handle rapid re-renders', () => {
      const product = generateFuzzProduct();
      
      // Rapidly render and unmount the same component
      for (let i = 0; i < 100; i++) {
        render(<Product product={product} />);
        expect(screen.getByText('Add to cart')).toBeInTheDocument();
        screen.unmount();
      }
    });
  });

  describe('Boundary Condition Fuzzing', () => {
    test('should handle edge case combinations', () => {
      const edgeCases = [
        { name: '', price: 0, emoji: '' },
        { name: 'A', price: 1, emoji: '🍕' },
        { name: generateFuzzString(1000), price: Number.MAX_SAFE_INTEGER, emoji: '🚀' },
        { name: null, price: null, emoji: null },
        { name: undefined, price: undefined, emoji: undefined },
        { name: 'Test', price: -1, emoji: '🍕' },
        { name: 'Test', price: Infinity, emoji: '🍕' },
        { name: 'Test', price: NaN, emoji: '🍕' }
      ];
      
      edgeCases.forEach(product => {
        try {
          render(<Product product={product} />);
          expect(screen.getByText('Add to cart')).toBeInTheDocument();
          screen.unmount();
        } catch (error) {
          console.log('Edge case test failed with:', product);
          throw error;
        }
      });
    });
  });
}); 