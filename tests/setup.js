import React from 'react';
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock use-shopping-cart hook
const mockUseShoppingCart = {
  shouldDisplayCart: false,
  cartCount: 0,
  cartDetails: {},
  addItem: jest.fn(),
  removeItem: jest.fn(),
  redirectToCheckout: jest.fn(),
  totalPrice: 0,
};

jest.mock('use-shopping-cart', () => ({
  useShoppingCart: () => mockUseShoppingCart,
  formatCurrencyString: jest.fn(({ value, currency }) => `${currency} ${value}`),
}));

// Global test utilities
global.mockUseShoppingCart = mockUseShoppingCart;

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
}; 