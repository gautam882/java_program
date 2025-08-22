import { consolidationFixtures, MockReply } from '../fixtures/consolidation.fixtures';

describe('ConsolidationController - getInvoiceConsolidationDetails', () => {
  let consolidationController: any;
  let mockService: any;
  let mockReply: any;

  beforeEach(() => {
    // Mock service
    mockService = {
      getInvoiceConsolidationDetails: jest.fn()
    };

    // Mock messages
    const mockMessages = consolidationFixtures.mockMessages;

    // Create controller instance with mocked dependencies
    consolidationController = {
      service: mockService,
      messages: mockMessages,
      getInvoiceConsolidationDetails: async (request: any, reply: any) => {
        const response = new MockReply();
        let program_id: any;

        try {
          program_id = request.params.program_id;
          const consolidation_id = request.params.consolidation_id;
          response.data = await mockService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);
          response.message = mockMessages.CONSOLIDATION_DETAILS_FETCHED_SUCCESSFULLY;
        } catch (error: any) {
          response.statusCode = 500;
          response.message = mockMessages.FETCH_CONSOLIDATION_DETAILS_FAILED;
          response.error = error.message;
        }
        return response.sendResponse(reply);
      }
    };

    // Mock reply object
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Successful scenarios', () => {
    it('should successfully fetch consolidation details with valid parameters', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      mockService.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

      // Act
      const result = await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockService.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        'prog_123',
        'cons_456'
      );
      expect(mockService.getInvoiceConsolidationDetails).toHaveBeenCalledTimes(1);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'Consolidation details fetched successfully',
        data: consolidationFixtures.validServiceResponse,
        error: null
      });
    });

    it('should handle empty consolidation details successfully', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      mockService.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.emptyServiceResponse);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockService.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        'prog_123',
        'cons_456'
      );
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'Consolidation details fetched successfully',
        data: consolidationFixtures.emptyServiceResponse,
        error: null
      });
    });

    it('should extract program_id and consolidation_id correctly from request params', async () => {
      // Arrange
      const request = {
        params: {
          program_id: 'different_prog_id',
          consolidation_id: 'different_cons_id'
        }
      };
      mockService.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockService.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        'different_prog_id',
        'different_cons_id'
      );
    });
  });

  describe('Error scenarios', () => {
    it('should handle service errors gracefully', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      mockService.getInvoiceConsolidationDetails.mockRejectedValue(consolidationFixtures.errors.databaseError);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockService.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        'prog_123',
        'cons_456'
      );
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Failed to fetch consolidation details',
        data: null,
        error: 'Database connection failed'
      });
    });

    it('should handle validation errors', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      mockService.getInvoiceConsolidationDetails.mockRejectedValue(consolidationFixtures.errors.validationError);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Failed to fetch consolidation details',
        data: null,
        error: 'Invalid consolidation ID'
      });
    });

    it('should handle not found errors', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      mockService.getInvoiceConsolidationDetails.mockRejectedValue(consolidationFixtures.errors.notFoundError);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Failed to fetch consolidation details',
        data: null,
        error: 'Consolidation not found'
      });
    });

    it('should handle authorization errors', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      mockService.getInvoiceConsolidationDetails.mockRejectedValue(consolidationFixtures.errors.authError);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Failed to fetch consolidation details',
        data: null,
        error: 'Unauthorized access'
      });
    });

    it('should handle missing request parameters gracefully', async () => {
      // Arrange
      const request = {
        params: {
          program_id: undefined,
          consolidation_id: undefined
        }
      };
      mockService.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockService.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        undefined,
        undefined
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle null service response', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      mockService.getInvoiceConsolidationDetails.mockResolvedValue(null);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'Consolidation details fetched successfully',
        data: null,
        error: null
      });
    });

    it('should handle undefined service response', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      mockService.getInvoiceConsolidationDetails.mockResolvedValue(undefined);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 200,
        message: 'Consolidation details fetched successfully',
        data: undefined,
        error: null
      });
    });

    it('should handle errors without message property', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const errorWithoutMessage = { code: 'DB_ERROR', details: 'Connection timeout' };
      mockService.getInvoiceConsolidationDetails.mockRejectedValue(errorWithoutMessage);

      // Act
      await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        statusCode: 500,
        message: 'Failed to fetch consolidation details',
        data: null,
        error: undefined // Since error.message is undefined
      });
    });
  });

  describe('Parameter validation', () => {
    it('should pass correct parameters to service layer', async () => {
      // Arrange
      const testCases = [
        { program_id: 'prog_001', consolidation_id: 'cons_001' },
        { program_id: 'prog_999', consolidation_id: 'cons_999' },
        { program_id: '123', consolidation_id: '456' }
      ];

      for (const testCase of testCases) {
        const request = {
          params: testCase
        };
        mockService.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

        // Act
        await consolidationController.getInvoiceConsolidationDetails(request, mockReply);

        // Assert
        expect(mockService.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
          request,
          testCase.program_id,
          testCase.consolidation_id
        );
      }
    });
  });
});