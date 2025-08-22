# Consolidation API Test Suite

This repository contains comprehensive unit and integration tests for the consolidation API functionality, specifically testing the `getInvoiceConsolidationDetails` endpoint and its related components.

## Overview

The test suite covers three main components:
1. **Route Handler** - GET `/program/:program_id/invoice/consolidation/:consolidation_id`
2. **Controller** - `consolidationController.getInvoiceConsolidationDetails`
3. **Service** - `service.getInvoiceConsolidationDetails`

## Test Structure

```
test/
├── fixtures/
│   └── consolidation.fixtures.ts    # Centralized test data and mocks
├── unit/
│   ├── consolidation.controller.test.ts
│   └── consolidation.service.test.ts
├── integration/
│   └── consolidation.route.test.ts
└── setup.ts                         # Global test configuration
```

## Features

### ✅ Centralized Payload Management
- All test data, mocks, and fixtures are managed in a single location
- Consistent data structures across all test files
- Easy to maintain and update test scenarios

### ✅ Comprehensive Test Coverage
- **Unit Tests**: Individual component testing with mocked dependencies
- **Integration Tests**: End-to-end flow testing from route to repository
- **Error Handling**: All error scenarios and edge cases covered
- **Parameter Validation**: Various input validation scenarios

### ✅ Test Categories Covered

#### Controller Tests (`consolidation.controller.test.ts`)
- ✅ Successful consolidation detail retrieval
- ✅ Empty consolidation handling
- ✅ Parameter extraction from request
- ✅ Error handling (database, validation, not found, auth)
- ✅ Edge cases (null responses, missing parameters)
- ✅ Response format validation

#### Service Tests (`consolidation.service.test.ts`)
- ✅ Repository interaction and data pass-through
- ✅ Error propagation from repository layer
- ✅ Parameter handling (null, undefined, empty values)
- ✅ Data type preservation
- ✅ Async behavior testing
- ✅ Response integrity validation

#### Integration Tests (`consolidation.route.test.ts`)
- ✅ Complete flow from route to repository
- ✅ Route configuration validation
- ✅ Authentication middleware integration
- ✅ Parameter extraction from URL
- ✅ Response format consistency
- ✅ Concurrent request handling
- ✅ Large data handling

## Installation

```bash
# Install dependencies
npm install

# Install development dependencies (Jest, TypeScript, etc.)
npm install --dev
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:verbose
```

## Test Data Management

All test data is centralized in `test/fixtures/consolidation.fixtures.ts`:

```typescript
export const consolidationFixtures = {
  validParams: { program_id: 'prog_123', consolidation_id: 'cons_456' },
  validRequest: { /* complete request object */ },
  validServiceResponse: { /* expected service response */ },
  errors: { /* various error scenarios */ },
  // ... more fixtures
};
```

## Mock Objects

The test suite includes comprehensive mocks for:
- **MockReply**: Simulates Fastify reply object
- **Service Layer**: Mocked service methods
- **Repository Layer**: Mocked database operations
- **Authentication**: Mocked decodeToken middleware

## Test Scenarios

### Success Scenarios
- Valid consolidation details retrieval
- Empty consolidation data handling
- Different parameter combinations
- Null and undefined responses

### Error Scenarios
- Database connection failures
- Validation errors
- Resource not found errors
- Authorization failures
- Missing parameters
- Invalid data formats

### Edge Cases
- Concurrent requests
- Large response data
- Mixed data types
- Async operation timeouts
- Memory efficiency

## Coverage Goals

The test suite aims for:
- **Line Coverage**: >95%
- **Function Coverage**: 100%
- **Branch Coverage**: >90%
- **Statement Coverage**: >95%

## Best Practices Implemented

1. **AAA Pattern**: Arrange, Act, Assert structure
2. **DRY Principle**: Reusable fixtures and utilities
3. **Isolation**: Each test is independent
4. **Descriptive Names**: Clear test descriptions
5. **Error Testing**: Comprehensive error scenario coverage
6. **Async Testing**: Proper async/await handling
7. **Mock Management**: Clean mock setup and teardown

## Configuration Files

- `package.json` - Dependencies and Jest configuration
- `tsconfig.json` - TypeScript compiler options
- `test/setup.ts` - Global test setup and utilities

## API Endpoint Details

### Route Configuration
```typescript
{
  method: 'GET',
  url: '/program/:program_id/invoice/consolidation/:consolidation_id',
  preHandler: decodeToken,
  handler: consolidationController.getInvoiceConsolidationDetails
}
```

### Expected Response Format
```typescript
{
  statusCode: number,
  message: string,
  data: any | null,
  error: string | null
}
```

## Contributing

When adding new tests:
1. Add test data to `consolidation.fixtures.ts`
2. Follow the existing test structure and naming conventions
3. Include both success and error scenarios
4. Ensure tests are isolated and don't depend on external state
5. Update this README if adding new test categories

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure `@types/jest` is installed
2. **Import Errors**: Check file paths in import statements
3. **Mock Issues**: Verify mocks are properly cleared between tests
4. **Async Errors**: Use proper async/await or return promises

### Debug Mode

To debug tests:
```bash
# Run specific test file
npx jest test/unit/consolidation.controller.test.ts

# Run with debug output
npx jest --verbose --no-cache

# Run single test
npx jest -t "should successfully fetch consolidation details"
```