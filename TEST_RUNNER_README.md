# Test Runner Interface

A web-based test runner interface for the e-commerce application that allows you to run tests by category and view results with pass/fail percentages.

## Features

- **Category-based Testing**: Run tests by specific categories (unit, edge cases, property-based, fuzz, mutation, integration)
- **Real-time Results**: See test results as they run with live updates
- **Visual Statistics**: View pass/fail percentages with progress bars
- **Test Logs**: Monitor test execution with detailed logs
- **Responsive Design**: Works on desktop and mobile devices

## Accessing the Test Runner

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the test runner:
   - Go to `http://localhost:3000/test-runner`
   - Or click the "Test Runner" button on the main page

## Using the Test Runner

### 1. Select Test Category
Choose from the available test categories:
- **All Tests**: Run all tests across all categories
- **Unit Tests**: Test individual component functionality
- **Edge Cases**: Test boundary conditions and error scenarios
- **Property Based**: Test with randomized inputs and properties
- **Fuzz Tests**: Test with extreme and malformed inputs
- **Mutation Tests**: Test for weak assertions and robustness
- **Integration Tests**: Test component interactions and workflows

### 2. Run Tests
Click the "Run Tests" button to execute the selected category of tests.

### 3. View Results
- **Overall Statistics**: See total tests, passed, failed, and success rate
- **Category Breakdown**: View detailed results for each test category
- **Progress Bars**: Visual representation of test success rates
- **Test Logs**: Monitor test execution in real-time

## Test Categories Explained

### Unit Tests (`tests/unit/`)
- Test individual components in isolation
- Mock external dependencies
- Focus on component logic and rendering
- Examples: Product component rendering, ShoppingCart display logic

### Edge Cases (`tests/edge_cases/`)
- Test boundary conditions and extreme values
- Test error handling and null/undefined scenarios
- Test special characters and unicode
- Examples: Empty product names, negative prices, large quantities

### Property Based (`tests/property_based/`)
- Test with randomized inputs
- Verify properties that should always hold true
- Test commutativity and consistency
- Examples: Quantity should always be positive, addItem should always be called with correct parameters

### Fuzz Tests (`tests/fuzz/`)
- Test with malformed and extreme inputs
- Test rapid state changes and concurrent operations
- Test memory and performance under stress
- Examples: Random strings, extreme numbers, rapid button clicks

### Mutation Tests (`tests/mutation/`)
- Detect weak assertions and test robustness
- Test state immutability and data integrity
- Test error handling and async behavior
- Examples: Detect if quantity logic is broken, verify exact parameter passing

### Integration Tests (`tests/integration/`)
- Test component interactions and workflows
- Test end-to-end user scenarios
- Test cart state synchronization
- Examples: Add to cart flow, checkout process, cart management

## Command Line Usage

You can also run tests from the command line:

```bash
# Run all tests
npm test

# Run specific category
npm run test:unit
npm run test:edge
npm run test:property
npm run test:fuzz
npm run test:mutation
npm run test:integration

# Run test demo
npm run test:demo

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Test Configuration

The test runner uses Jest with the following configuration:
- **Environment**: jsdom for DOM testing
- **Setup**: `tests/setup.js` for global mocks and configuration
- **Coverage**: HTML, LCOV, and text reports
- **Transform**: Babel for JSX and modern JavaScript

## Mock Strategy

The test runner uses comprehensive mocking:
- **Next.js Router**: Mocked for navigation testing
- **Next.js Image**: Mocked to render as regular img elements
- **use-shopping-cart**: Mocked shopping cart hook
- **Console**: Suppressed to reduce noise in test output

## Troubleshooting

### Tests Not Running
- Ensure all dependencies are installed: `npm install`
- Check Jest configuration in `jest.config.js`
- Verify test files follow the naming convention: `*.test.js`

### API Errors
- Ensure the development server is running
- Check that the API endpoint `/api/run-tests` is accessible
- Verify Jest is installed and accessible via `npx jest`

### Performance Issues
- Large test suites may take time to run
- Consider running specific categories instead of all tests
- Monitor memory usage for fuzz tests with many iterations

## Future Enhancements

- **Test History**: Save and compare test results over time
- **Test Filtering**: Filter tests by name or pattern
- **Parallel Execution**: Run multiple test categories simultaneously
- **Test Coverage Visualization**: Interactive coverage reports
- **Performance Metrics**: Track test execution time and trends
- **CI/CD Integration**: Connect to continuous integration systems 