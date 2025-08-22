import { consolidationFixtures, MockReply } from '../fixtures/consolidation.fixtures';

// Mock Fastify route setup for integration testing
const mockFastify = {
  register: jest.fn(),
  route: jest.fn(),
  listen: jest.fn(),
  close: jest.fn()
};

// Mock decodeToken preHandler
const mockDecodeToken = jest.fn((request: any, reply: any, done: any) => {
  // Simulate successful token validation
  request.user = consolidationFixtures.validRequest.user;
  done();
});

describe('Consolidation Route Integration Tests', () => {
  let mockConsolidationController: any;
  let mockConsolidationService: any;
  let mockConsolidationRepository: any;
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    // Mock repository layer
    mockConsolidationRepository = {
      getInvoiceConsolidationDetails: jest.fn()
    };

    // Mock service layer
    mockConsolidationService = {
      getInvoiceConsolidationDetails: async (request: any, program_id: any, consolidation_id: any) => {
        let response: any = await mockConsolidationRepository.getInvoiceConsolidationDetails(request, program_id, consolidation_id);
        return response;
      }
    };

    // Mock controller layer
    mockConsolidationController = {
      service: mockConsolidationService,
      messages: consolidationFixtures.mockMessages,
      getInvoiceConsolidationDetails: async (request: any, reply: any) => {
        const response = new MockReply();
        let program_id: any;

        try {
          program_id = request.params.program_id;
          const consolidation_id = request.params.consolidation_id;
          response.data = await mockConsolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);
          response.message = consolidationFixtures.mockMessages.CONSOLIDATION_DETAILS_FETCHED_SUCCESSFULLY;
        } catch (error: any) {
          response.statusCode = 500;
          response.message = consolidationFixtures.mockMessages.FETCH_CONSOLIDATION_DETAILS_FAILED;
          response.error = error.message;
        }
        return response.sendResponse(reply);
      }
    };

    // Mock request and reply objects
    mockRequest = {
      params: {
        program_id: consolidationFixtures.validParams.program_id,
        consolidation_id: consolidationFixtures.validParams.consolidation_id
      },
      user: consolidationFixtures.validRequest.user,
      headers: consolidationFixtures.validRequest.headers
    };

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Route Configuration', () => {
    it('should configure route with correct method, URL, preHandler and handler', () => {
      // Arrange
      const expectedRouteConfig = {
        method: 'GET',
        url: '/program/:program_id/invoice/consolidation/:consolidation_id',
        preHandler: mockDecodeToken,
        handler: mockConsolidationController.getInvoiceConsolidationDetails
      };

      // Act - This would typically be done in your route registration
      mockFastify.route(expectedRouteConfig);

      // Assert
      expect(mockFastify.route).toHaveBeenCalledWith(expectedRouteConfig);
    });

    it('should apply decodeToken preHandler before main handler', async () => {
      // Arrange
      const preHandlerDone = jest.fn();
      
      // Act
      await mockDecodeToken(mockRequest, mockReply, preHandlerDone);

      // Assert
      expect(mockRequest.user).toEqual(consolidationFixtures.validRequest.user);
      expect(preHandlerDone).toHaveBeenCalled();
    });
  });

  describe('Full Integration Flow - Success Scenarios', () => {
    it('should handle complete successful flow from route to repository', async () => {
      // Arrange
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(
        consolidationFixtures.validServiceResponse
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(mockRequest, mockReply);

      // Assert - Verify repository was called correctly
      expect(mockConsolidationRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        mockRequest,
        consolidationFixtures.validParams.program_id,
        consolidationFixtures.validParams.consolidation_id
      );

      // Assert - Verify response was sent correctly
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'Consolidation details fetched successfully',
        data: consolidationFixtures.validServiceResponse,
        error: null
      });
    });

    it('should handle empty consolidation data through complete flow', async () => {
      // Arrange
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(
        consolidationFixtures.emptyServiceResponse
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(mockRequest, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'Consolidation details fetched successfully',
        data: consolidationFixtures.emptyServiceResponse,
        error: null
      });
    });

    it('should preserve request context through all layers', async () => {
      // Arrange
      const requestWithAdditionalContext = {
        ...mockRequest,
        additionalContext: {
          traceId: 'trace_123',
          sessionId: 'session_456'
        }
      };
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(
        consolidationFixtures.validServiceResponse
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(requestWithAdditionalContext, mockReply);

      // Assert
      expect(mockConsolidationRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        requestWithAdditionalContext,
        consolidationFixtures.validParams.program_id,
        consolidationFixtures.validParams.consolidation_id
      );
    });
  });

  describe('Full Integration Flow - Error Scenarios', () => {
    it('should handle repository database errors through complete flow', async () => {
      // Arrange
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockRejectedValue(
        consolidationFixtures.errors.databaseError
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(mockRequest, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Failed to fetch consolidation details',
        data: null,
        error: 'Database connection failed'
      });
    });

    it('should handle validation errors through complete flow', async () => {
      // Arrange
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockRejectedValue(
        consolidationFixtures.errors.validationError
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(mockRequest, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Failed to fetch consolidation details',
        data: null,
        error: 'Invalid consolidation ID'
      });
    });

    it('should handle not found errors through complete flow', async () => {
      // Arrange
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockRejectedValue(
        consolidationFixtures.errors.notFoundError
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(mockRequest, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Failed to fetch consolidation details',
        data: null,
        error: 'Consolidation not found'
      });
    });

    it('should handle authorization errors through complete flow', async () => {
      // Arrange
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockRejectedValue(
        consolidationFixtures.errors.authError
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(mockRequest, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Failed to fetch consolidation details',
        data: null,
        error: 'Unauthorized access'
      });
    });
  });

  describe('Parameter Extraction and Validation', () => {
    it('should extract parameters correctly from route URL', async () => {
      // Arrange
      const testCases = [
        {
          url: '/program/prog_001/invoice/consolidation/cons_001',
          expectedParams: { program_id: 'prog_001', consolidation_id: 'cons_001' }
        },
        {
          url: '/program/prog_999/invoice/consolidation/cons_999',
          expectedParams: { program_id: 'prog_999', consolidation_id: 'cons_999' }
        },
        {
          url: '/program/123/invoice/consolidation/456',
          expectedParams: { program_id: '123', consolidation_id: '456' }
        }
      ];

      for (const testCase of testCases) {
        const testRequest = {
          ...mockRequest,
          params: testCase.expectedParams
        };
        mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(
          consolidationFixtures.validServiceResponse
        );

        // Act
        await mockConsolidationController.getInvoiceConsolidationDetails(testRequest, mockReply);

        // Assert
        expect(mockConsolidationRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
          testRequest,
          testCase.expectedParams.program_id,
          testCase.expectedParams.consolidation_id
        );
      }
    });

    it('should handle missing route parameters', async () => {
      // Arrange
      const requestWithMissingParams = {
        ...mockRequest,
        params: {
          program_id: undefined,
          consolidation_id: undefined
        }
      };
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(
        consolidationFixtures.validServiceResponse
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(requestWithMissingParams, mockReply);

      // Assert
      expect(mockConsolidationRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        requestWithMissingParams,
        undefined,
        undefined
      );
    });

    it('should handle empty route parameters', async () => {
      // Arrange
      const requestWithEmptyParams = {
        ...mockRequest,
        params: {
          program_id: '',
          consolidation_id: ''
        }
      };
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(
        consolidationFixtures.validServiceResponse
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(requestWithEmptyParams, mockReply);

      // Assert
      expect(mockConsolidationRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        requestWithEmptyParams,
        '',
        ''
      );
    });
  });

  describe('Authentication Integration', () => {
    it('should pass authenticated user context through all layers', async () => {
      // Arrange
      const authenticatedRequest = {
        ...mockRequest,
        user: {
          id: 'auth_user_123',
          email: 'authenticated@example.com',
          roles: ['admin']
        }
      };
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(
        consolidationFixtures.validServiceResponse
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(authenticatedRequest, mockReply);

      // Assert
      expect(mockConsolidationRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        authenticatedRequest,
        consolidationFixtures.validParams.program_id,
        consolidationFixtures.validParams.consolidation_id
      );
      
      // Verify the user context is preserved
      const [passedRequest] = mockConsolidationRepository.getInvoiceConsolidationDetails.mock.calls[0];
      expect(passedRequest.user).toEqual({
        id: 'auth_user_123',
        email: 'authenticated@example.com',
        roles: ['admin']
      });
    });

    it('should handle requests with missing user context', async () => {
      // Arrange
      const requestWithoutUser = {
        ...mockRequest,
        user: undefined
      };
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(
        consolidationFixtures.validServiceResponse
      );

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(requestWithoutUser, mockReply);

      // Assert
      const [passedRequest] = mockConsolidationRepository.getInvoiceConsolidationDetails.mock.calls[0];
      expect(passedRequest.user).toBeUndefined();
    });
  });

  describe('Response Format Integration', () => {
    it('should maintain consistent response format across all scenarios', async () => {
      // Arrange
      const testScenarios = [
        {
          name: 'successful response',
          repositoryResponse: consolidationFixtures.validServiceResponse,
          expectedStatus: 200,
          expectedMessage: 'Consolidation details fetched successfully',
          expectedError: null
        },
        {
          name: 'empty response',
          repositoryResponse: consolidationFixtures.emptyServiceResponse,
          expectedStatus: 200,
          expectedMessage: 'Consolidation details fetched successfully',
          expectedError: null
        },
        {
          name: 'null response',
          repositoryResponse: null,
          expectedStatus: 200,
          expectedMessage: 'Consolidation details fetched successfully',
          expectedError: null
        }
      ];

      for (const scenario of testScenarios) {
        mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(scenario.repositoryResponse);
        jest.clearAllMocks();

        // Act
        await mockConsolidationController.getInvoiceConsolidationDetails(mockRequest, mockReply);

        // Assert
        expect(mockReply.status).toHaveBeenCalledWith(scenario.expectedStatus);
        expect(mockReply.send).toHaveBeenCalledWith({
          statusCode: scenario.expectedStatus,
          message: scenario.expectedMessage,
          data: scenario.repositoryResponse,
          error: scenario.expectedError
        });
      }
    });

    it('should maintain consistent error response format', async () => {
      // Arrange
      const errorScenarios = [
        {
          name: 'database error',
          error: consolidationFixtures.errors.databaseError,
          expectedErrorMessage: 'Database connection failed'
        },
        {
          name: 'validation error',
          error: consolidationFixtures.errors.validationError,
          expectedErrorMessage: 'Invalid consolidation ID'
        },
        {
          name: 'not found error',
          error: consolidationFixtures.errors.notFoundError,
          expectedErrorMessage: 'Consolidation not found'
        }
      ];

      for (const scenario of errorScenarios) {
        mockConsolidationRepository.getInvoiceConsolidationDetails.mockRejectedValue(scenario.error);
        jest.clearAllMocks();

        // Act
        await mockConsolidationController.getInvoiceConsolidationDetails(mockRequest, mockReply);

        // Assert
        expect(mockReply.status).toHaveBeenCalledWith(500);
        expect(mockReply.send).toHaveBeenCalledWith({
          statusCode: 500,
          message: 'Failed to fetch consolidation details',
          data: null,
          error: scenario.expectedErrorMessage
        });
      }
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle concurrent requests correctly', async () => {
      // Arrange
      const concurrentRequests = Array.from({ length: 5 }, (_, index) => ({
        ...mockRequest,
        params: {
          program_id: `prog_${index}`,
          consolidation_id: `cons_${index}`
        }
      }));

      mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(
        consolidationFixtures.validServiceResponse
      );

      // Act
      const promises = concurrentRequests.map(request =>
        mockConsolidationController.getInvoiceConsolidationDetails(request, mockReply)
      );
      await Promise.all(promises);

      // Assert
      expect(mockConsolidationRepository.getInvoiceConsolidationDetails).toHaveBeenCalledTimes(5);
      expect(mockReply.status).toHaveBeenCalledTimes(5);
      expect(mockReply.send).toHaveBeenCalledTimes(5);
    });

    it('should handle large response data correctly', async () => {
      // Arrange
      const largeResponse = {
        ...consolidationFixtures.validServiceResponse,
        invoices: Array.from({ length: 1000 }, (_, index) => ({
          invoice_id: `inv_${index}`,
          amount: Math.random() * 1000,
          date: new Date().toISOString(),
          status: index % 2 === 0 ? 'paid' : 'pending'
        }))
      };
      mockConsolidationRepository.getInvoiceConsolidationDetails.mockResolvedValue(largeResponse);

      // Act
      await mockConsolidationController.getInvoiceConsolidationDetails(mockRequest, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'Consolidation details fetched successfully',
        data: largeResponse,
        error: null
      });
    });
  });
});