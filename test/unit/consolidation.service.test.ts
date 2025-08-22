import { consolidationFixtures } from '../fixtures/consolidation.fixtures';

describe('ConsolidationService - getInvoiceConsolidationDetails', () => {
  let consolidationService: any;
  let mockRepository: any;

  beforeEach(() => {
    // Mock repository
    mockRepository = {
      getInvoiceConsolidationDetails: jest.fn()
    };

    // Create service instance with mocked dependencies
    consolidationService = {
      consolidationRepository: mockRepository,
      getInvoiceConsolidationDetails: async (request: any, program_id: any, consolidation_id: any) => {
        let response: any = await mockRepository.getInvoiceConsolidationDetails(request, program_id, consolidation_id);
        return response;
      }
    };

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Successful scenarios', () => {
    it('should successfully return consolidation details from repository', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        program_id,
        consolidation_id
      );
      expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledTimes(1);
      expect(result).toEqual(consolidationFixtures.validServiceResponse);
    });

    it('should handle empty consolidation details from repository', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.emptyServiceResponse);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        program_id,
        consolidation_id
      );
      expect(result).toEqual(consolidationFixtures.emptyServiceResponse);
    });

    it('should pass through all parameters correctly to repository', async () => {
      // Arrange
      const testCases = [
        {
          request: { user: { id: '1' }, params: { program_id: 'prog_1', consolidation_id: 'cons_1' } },
          program_id: 'prog_1',
          consolidation_id: 'cons_1'
        },
        {
          request: { user: { id: '2' }, params: { program_id: 'prog_2', consolidation_id: 'cons_2' } },
          program_id: 'prog_2',
          consolidation_id: 'cons_2'
        },
        {
          request: { user: { id: '3' }, params: { program_id: 'prog_3', consolidation_id: 'cons_3' } },
          program_id: 'prog_3',
          consolidation_id: 'cons_3'
        }
      ];

      for (const testCase of testCases) {
        mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

        // Act
        await consolidationService.getInvoiceConsolidationDetails(
          testCase.request,
          testCase.program_id,
          testCase.consolidation_id
        );

        // Assert
        expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
          testCase.request,
          testCase.program_id,
          testCase.consolidation_id
        );
      }
    });

    it('should return null when repository returns null', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(null);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(result).toBeNull();
    });

    it('should return undefined when repository returns undefined', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(undefined);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('Error scenarios', () => {
    it('should propagate repository database errors', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      mockRepository.getInvoiceConsolidationDetails.mockRejectedValue(consolidationFixtures.errors.databaseError);

      // Act & Assert
      await expect(
        consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id)
      ).rejects.toThrow('Database connection failed');
      
      expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        program_id,
        consolidation_id
      );
    });

    it('should propagate repository validation errors', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      mockRepository.getInvoiceConsolidationDetails.mockRejectedValue(consolidationFixtures.errors.validationError);

      // Act & Assert
      await expect(
        consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id)
      ).rejects.toThrow('Invalid consolidation ID');
    });

    it('should propagate repository not found errors', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      mockRepository.getInvoiceConsolidationDetails.mockRejectedValue(consolidationFixtures.errors.notFoundError);

      // Act & Assert
      await expect(
        consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id)
      ).rejects.toThrow('Consolidation not found');
    });

    it('should propagate repository authorization errors', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      mockRepository.getInvoiceConsolidationDetails.mockRejectedValue(consolidationFixtures.errors.authError);

      // Act & Assert
      await expect(
        consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id)
      ).rejects.toThrow('Unauthorized access');
    });
  });

  describe('Parameter handling', () => {
    it('should handle null parameters', async () => {
      // Arrange
      const request = null;
      const program_id = null;
      const consolidation_id = null;
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        null,
        null,
        null
      );
      expect(result).toEqual(consolidationFixtures.validServiceResponse);
    });

    it('should handle undefined parameters', async () => {
      // Arrange
      const request = undefined;
      const program_id = undefined;
      const consolidation_id = undefined;
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(consolidationFixtures.validServiceResponse);
    });

    it('should handle empty string parameters', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = '';
      const consolidation_id = '';
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        '',
        ''
      );
      expect(result).toEqual(consolidationFixtures.validServiceResponse);
    });

    it('should handle numeric string parameters', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = '12345';
      const consolidation_id = '67890';
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        '12345',
        '67890'
      );
      expect(result).toEqual(consolidationFixtures.validServiceResponse);
    });

    it('should handle mixed data types for IDs', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = 123; // number
      const consolidation_id = 'cons_456'; // string
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(consolidationFixtures.validServiceResponse);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(mockRepository.getInvoiceConsolidationDetails).toHaveBeenCalledWith(
        request,
        123,
        'cons_456'
      );
      expect(result).toEqual(consolidationFixtures.validServiceResponse);
    });
  });

  describe('Response data integrity', () => {
    it('should return exact response from repository without modification', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      const complexResponse = {
        ...consolidationFixtures.validServiceResponse,
        nested: {
          deep: {
            data: {
              array: [1, 2, 3],
              object: { key: 'value' },
              null_value: null,
              undefined_value: undefined
            }
          }
        }
      };
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(complexResponse);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(result).toEqual(complexResponse);
      expect(result).toBe(complexResponse); // Should be the exact same object reference
    });

    it('should preserve data types in response', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      const typedResponse = {
        string_field: 'test',
        number_field: 123,
        boolean_field: true,
        array_field: [1, 'two', false],
        object_field: { nested: 'value' },
        null_field: null,
        date_field: new Date('2024-01-01'),
        big_number: BigInt(9007199254740991)
      };
      mockRepository.getInvoiceConsolidationDetails.mockResolvedValue(typedResponse);

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(typeof result.string_field).toBe('string');
      expect(typeof result.number_field).toBe('number');
      expect(typeof result.boolean_field).toBe('boolean');
      expect(Array.isArray(result.array_field)).toBe(true);
      expect(typeof result.object_field).toBe('object');
      expect(result.null_field).toBeNull();
      expect(result.date_field instanceof Date).toBe(true);
      expect(typeof result.big_number).toBe('bigint');
    });
  });

  describe('Async behavior', () => {
    it('should handle repository promise resolution correctly', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      const resolvedValue = consolidationFixtures.validServiceResponse;
      
      mockRepository.getInvoiceConsolidationDetails.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(resolvedValue), 10))
      );

      // Act
      const result = await consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id);

      // Assert
      expect(result).toEqual(resolvedValue);
    });

    it('should handle repository promise rejection correctly', async () => {
      // Arrange
      const request = consolidationFixtures.validRequest;
      const program_id = consolidationFixtures.validParams.program_id;
      const consolidation_id = consolidationFixtures.validParams.consolidation_id;
      const error = new Error('Async error');
      
      mockRepository.getInvoiceConsolidationDetails.mockImplementation(
        () => new Promise((resolve, reject) => setTimeout(() => reject(error), 10))
      );

      // Act & Assert
      await expect(
        consolidationService.getInvoiceConsolidationDetails(request, program_id, consolidation_id)
      ).rejects.toThrow('Async error');
    });
  });
});