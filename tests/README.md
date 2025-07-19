# E-commerce Test Suite

This directory contains a comprehensive test suite for the e-commerce application with Stripe integration. The tests are organized into different categories to ensure thorough coverage and maintainability.

## Test Structure

```
tests/
├── setup.js                    # Test setup and configuration
├── unit/                       # Normal path and expected use cases
│   ├── Product.test.js
│   ├── ShoppingCart.test.js
│   ├── CheckoutButton.test.js
│   ├── CartItem.test.js
│   └── products.test.js
├── edge_cases/                 # Handle unusual, null, or extreme inputs
│   └── Product.test.js
├── property_based/             # Test properties across generated input
│   └── Product.test.js
├── fuzz/                       # Randomized input generation
│   └── Product.test.js
├── mutation/                   # Highlight areas for mutation testing
│   └── Product.test.js
├── integration/                # End-to-end tests for multiple components
│   └── Ecommerce.test.js
└── README.md                   # This file
```

## Test Categories

### 1. Unit Tests (`unit/`)
- **Purpose**: Test individual components and functions in isolation
- **Coverage**: Normal functionality, expected use cases, component rendering
- **Examples**: 
  - Product component renders correctly
  - Shopping cart calculates totals properly
  - Checkout button enables/disables based on cart state

### 2. Edge Cases (`edge_cases/`)
- **Purpose**: Handle unusual, null, or extreme inputs
- **Coverage**: Boundary conditions, invalid data, error scenarios
- **Examples**:
  - Product with missing properties
  - Extreme price values (negative, zero, very large)
  - Special characters in product names
  - Rapid button clicks

### 3. Property-Based Tests (`property_based/`)
- **Purpose**: Test properties across generated input using hypothesis-like approach
- **Coverage**: Mathematical properties, invariants, consistency checks
- **Examples**:
  - Quantity should always be positive
  - Add/remove operations should be commutative
  - Component should maintain consistency across random inputs

### 4. Fuzz Tests (`fuzz/`)
- **Purpose**: Use randomized input generation to simulate unexpected behavior
- **Coverage**: Random data, malformed inputs, stress testing
- **Examples**:
  - Random product data without crashing
  - Extreme string lengths and special characters
  - Concurrent operations and rapid state changes

### 5. Mutation Tests (`mutation/`)
- **Purpose**: Highlight areas where mutation testing can detect weak assertions
- **Coverage**: Weak assertions, missing validations, incomplete tests
- **Examples**:
  - Tests that would pass even if logic is broken
  - Missing boundary condition checks
  - Incomplete error handling validation

### 6. Integration Tests (`integration/`)
- **Purpose**: End-to-end tests for multiple components working together
- **Coverage**: Component interactions, data flow, user workflows
- **Examples**:
  - Complete shopping flow (add to cart → view cart → checkout)
  - Cart state synchronization across components
  - Error handling in integrated scenarios

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Categories
```bash
# Unit tests only
npm run test:unit

# Edge cases only
npm run test:edge

# Property-based tests only
npm run test:property

# Fuzz tests only
npm run test:fuzz

# Mutation tests only
npm run test:mutation

# Integration tests only
npm run test:integration
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Test environment: `jsdom` for React component testing
- Setup file: `tests/setup.js` for global test configuration
- Coverage collection from components, pages, and data files
- Module name mapping for `@/` imports

### Test Setup (`tests/setup.js`)
- Jest DOM matchers for better assertions
- Next.js router mocking
- Next.js Image component mocking
- Shopping cart hook mocking
- Console method mocking to reduce noise

### Babel Configuration (`.babelrc`)
- Preset-env for modern JavaScript features
- Preset-react for JSX transformation

## Mocking Strategy

### Shopping Cart Context
The `use-shopping-cart` hook is mocked globally to provide consistent test behavior:

```javascript
const mockUseShoppingCart = {
  shouldDisplayCart: false,
  cartCount: 0,
  cartDetails: {},
  addItem: jest.fn(),
  removeItem: jest.fn(),
  redirectToCheckout: jest.fn(),
  totalPrice: 0,
};
```

### Next.js Components
- Router is mocked to prevent navigation issues
- Image component is mocked to avoid image loading problems

## Test Data

### Products Data (`data/products.js`)
- 8 food products with Japanese pricing (JPY)
- Each product has: product_id, price_id, name, price, emoji, currency
- Used across all test categories for consistent testing

### Test Utilities
- `generateRandomProduct()`: Creates random product data for property-based tests
- `generateFuzzString()`: Creates random strings for fuzz testing
- `generateFuzzNumber()`: Creates various numeric types for edge case testing

## Best Practices

### Writing New Tests
1. **Choose the right category**: Place tests in the appropriate directory based on their purpose
2. **Use descriptive names**: Test names should clearly describe what is being tested
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Mock external dependencies**: Use mocks for external services and APIs
5. **Test one thing at a time**: Each test should focus on a single behavior

### Test Organization
1. **Group related tests**: Use `describe` blocks to organize related test cases
2. **Use beforeEach**: Set up common test state and reset mocks
3. **Clean up after tests**: Use `screen.unmount()` or `unmount()` to clean up rendered components
4. **Avoid test interdependence**: Each test should be independent and not rely on other tests

### Assertions
1. **Be specific**: Use specific assertions rather than generic ones
2. **Test behavior, not implementation**: Focus on what the component does, not how it does it
3. **Use appropriate matchers**: Choose the right Jest matchers for the type of assertion
4. **Check for absence**: Use `queryByText` and `not.toBeInTheDocument()` to check for absence

## Coverage Goals

- **Unit Tests**: 90%+ line coverage for all components
- **Edge Cases**: Cover all boundary conditions and error scenarios
- **Property-Based**: Test mathematical properties and invariants
- **Fuzz Tests**: Ensure robustness against random inputs
- **Mutation Tests**: Identify weak assertions and missing validations
- **Integration Tests**: Cover all major user workflows

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm install
    npm run test:coverage
```

## Troubleshooting

### Common Issues
1. **Import errors**: Ensure module name mapping is correct in `jest.config.js`
2. **Mock not working**: Check that mocks are properly set up in `tests/setup.js`
3. **Component not rendering**: Verify that all required props are provided
4. **Async test failures**: Use `waitFor` for asynchronous operations

### Debugging
1. **Use `console.log`**: Add logging to understand test flow
2. **Check mock calls**: Use `toHaveBeenCalledWith` to verify mock parameters
3. **Inspect rendered output**: Use `screen.debug()` to see what was rendered
4. **Run single test**: Use `test.only()` to run only one test case

## Future Enhancements

1. **Visual Regression Testing**: Add visual testing for UI components
2. **Performance Testing**: Add performance benchmarks for critical paths
3. **Accessibility Testing**: Add automated accessibility testing
4. **E2E Testing**: Add Cypress or Playwright for full browser testing
5. **API Testing**: Add tests for API endpoints when implemented 