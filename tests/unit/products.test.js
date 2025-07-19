import { products } from '@/data/products';

describe('Products Data - Unit Tests', () => {
  describe('Data Structure', () => {
    test('should export products as an array', () => {
      expect(Array.isArray(products)).toBe(true);
    });

    test('should have at least one product', () => {
      expect(products.length).toBeGreaterThan(0);
    });

    test('should have exactly 8 products', () => {
      expect(products).toHaveLength(8);
    });
  });

  describe('Product Object Structure', () => {
    test('each product should have required fields', () => {
      products.forEach((product, index) => {
        expect(product).toHaveProperty('product_id');
        expect(product).toHaveProperty('price_id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('emoji');
        expect(product).toHaveProperty('currency');
      });
    });

    test('each product should have string values for text fields', () => {
      products.forEach((product, index) => {
        expect(typeof product.product_id).toBe('string');
        expect(typeof product.price_id).toBe('string');
        expect(typeof product.name).toBe('string');
        expect(typeof product.emoji).toBe('string');
        expect(typeof product.currency).toBe('string');
      });
    });

    test('each product should have numeric price', () => {
      products.forEach((product, index) => {
        expect(typeof product.price).toBe('number');
      });
    });
  });

  describe('Product IDs', () => {
    test('all product_ids should be unique', () => {
      const productIds = products.map(p => p.product_id);
      const uniqueIds = new Set(productIds);
      expect(uniqueIds.size).toBe(products.length);
    });

    test('all price_ids should be unique', () => {
      const priceIds = products.map(p => p.price_id);
      const uniqueIds = new Set(priceIds);
      expect(uniqueIds.size).toBe(products.length);
    });

    test('product_ids should follow Stripe format', () => {
      products.forEach((product, index) => {
        expect(product.product_id).toMatch(/^prod_[A-Za-z0-9]+$/);
      });
    });

    test('price_ids should follow Stripe format', () => {
      products.forEach((product, index) => {
        expect(product.price_id).toMatch(/^price_[A-Za-z0-9]+$/);
      });
    });
  });

  describe('Product Names', () => {
    test('all product names should be non-empty strings', () => {
      products.forEach((product, index) => {
        expect(product.name).toBeTruthy();
        expect(product.name.trim()).toBeGreaterThan(0);
      });
    });

    test('product names should be unique', () => {
      const names = products.map(p => p.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(products.length);
    });

    test('product names should not contain special characters that could cause issues', () => {
      products.forEach((product, index) => {
        // Should not contain characters that could break HTML or cause XSS
        expect(product.name).not.toMatch(/[<>"']/);
      });
    });
  });

  describe('Product Prices', () => {
    test('all prices should be positive numbers', () => {
      products.forEach((product, index) => {
        expect(product.price).toBeGreaterThan(0);
      });
    });

    test('all prices should be integers', () => {
      products.forEach((product, index) => {
        expect(Number.isInteger(product.price)).toBe(true);
      });
    });

    test('prices should be reasonable values (not too high or too low)', () => {
      products.forEach((product, index) => {
        expect(product.price).toBeGreaterThanOrEqual(100); // Minimum 100 JPY
        expect(product.price).toBeLessThanOrEqual(10000); // Maximum 10,000 JPY
      });
    });
  });

  describe('Product Emojis', () => {
    test('all emojis should be non-empty strings', () => {
      products.forEach((product, index) => {
        expect(product.emoji).toBeTruthy();
        expect(product.emoji.trim()).toBeGreaterThan(0);
      });
    });

    test('emojis should be valid unicode characters', () => {
      products.forEach((product, index) => {
        // Check if emoji is a valid unicode character
        expect(product.emoji.length).toBeGreaterThan(0);
        expect(typeof product.emoji).toBe('string');
      });
    });

    test('emojis should be food-related', () => {
      const foodEmojis = ['🍙', '🍠', '🥐', '🍣', '🥚', '🌯', '🍮', '🥨'];
      products.forEach((product, index) => {
        expect(foodEmojis).toContain(product.emoji);
      });
    });
  });

  describe('Currency', () => {
    test('all products should have the same currency', () => {
      const currencies = products.map(p => p.currency);
      const uniqueCurrencies = new Set(currencies);
      expect(uniqueCurrencies.size).toBe(1);
    });

    test('currency should be JPY', () => {
      products.forEach((product, index) => {
        expect(product.currency).toBe('JPY');
      });
    });
  });

  describe('Specific Product Validation', () => {
    test('should have Onigiri product with correct data', () => {
      const onigiri = products.find(p => p.name === 'Onigiri');
      expect(onigiri).toBeDefined();
      expect(onigiri.price).toBe(120);
      expect(onigiri.emoji).toBe('🍙');
      expect(onigiri.currency).toBe('JPY');
    });

    test('should have Sweet Potato product with correct data', () => {
      const sweetPotato = products.find(p => p.name === 'Sweet Potato');
      expect(sweetPotato).toBeDefined();
      expect(sweetPotato.price).toBe(290);
      expect(sweetPotato.emoji).toBe('🍠');
      expect(sweetPotato.currency).toBe('JPY');
    });

    test('should have Croissant product with correct data', () => {
      const croissant = products.find(p => p.name === 'Croissant');
      expect(croissant).toBeDefined();
      expect(croissant.price).toBe(200);
      expect(croissant.emoji).toBe('🥐');
      expect(croissant.currency).toBe('JPY');
    });

    test('should have Sushi product with correct data', () => {
      const sushi = products.find(p => p.name === 'Sushi');
      expect(sushi).toBeDefined();
      expect(sushi.price).toBe(120);
      expect(sushi.emoji).toBe('🍣');
      expect(sushi.currency).toBe('JPY');
    });

    test('should have Egg product with correct data', () => {
      const egg = products.find(p => p.name === 'Egg');
      expect(egg).toBeDefined();
      expect(egg.price).toBe(100);
      expect(egg.emoji).toBe('🥚');
      expect(egg.currency).toBe('JPY');
    });

    test('should have Buritto product with correct data', () => {
      const buritto = products.find(p => p.name === 'Buritto');
      expect(buritto).toBeDefined();
      expect(buritto.price).toBe(390);
      expect(buritto.emoji).toBe('🌯');
      expect(buritto.currency).toBe('JPY');
    });

    test('should have Pudding product with correct data', () => {
      const pudding = products.find(p => p.name === 'Pudding');
      expect(pudding).toBeDefined();
      expect(pudding.price).toBe(150);
      expect(pudding.emoji).toBe('🍮');
      expect(pudding.currency).toBe('JPY');
    });

    test('should have Pretzel product with correct data', () => {
      const pretzel = products.find(p => p.name === 'Pretzel');
      expect(pretzel).toBeDefined();
      expect(pretzel.price).toBe(520);
      expect(pretzel.emoji).toBe('🥨');
      expect(pretzel.currency).toBe('JPY');
    });
  });

  describe('Data Consistency', () => {
    test('should have consistent data types across all products', () => {
      const expectedTypes = {
        product_id: 'string',
        price_id: 'string',
        name: 'string',
        price: 'number',
        emoji: 'string',
        currency: 'string'
      };

      products.forEach((product, index) => {
        Object.entries(expectedTypes).forEach(([key, expectedType]) => {
          expect(typeof product[key]).toBe(expectedType);
        });
      });
    });

    test('should not have any undefined or null values', () => {
      products.forEach((product, index) => {
        Object.values(product).forEach(value => {
          expect(value).not.toBeUndefined();
          expect(value).not.toBeNull();
        });
      });
    });
  });

  describe('Price Distribution', () => {
    test('should have a good range of prices', () => {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      expect(minPrice).toBe(100); // Egg
      expect(maxPrice).toBe(520); // Pretzel
    });

    test('should have reasonable price distribution', () => {
      const prices = products.map(p => p.price);
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      
      // Average should be reasonable (between 200-400 JPY)
      expect(averagePrice).toBeGreaterThan(200);
      expect(averagePrice).toBeLessThan(400);
    });
  });
}); 