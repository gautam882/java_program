// Global test setup file
// This file runs before all tests

// Increase test timeout for integration tests
jest.setTimeout(30000);

// Mock console methods to reduce noise during testing
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress console.error and console.warn during tests unless explicitly needed
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
(global as any).testUtils = {
  // Helper to create deep clones of objects for test isolation
  deepClone: (obj: any) => JSON.parse(JSON.stringify(obj)),
  
  // Helper to wait for async operations
  wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Helper to generate random test data
  generateRandomId: () => Math.random().toString(36).substring(2, 15),
  
  // Helper to validate response structure
  validateResponseStructure: (response: any) => {
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('error');
  }
};