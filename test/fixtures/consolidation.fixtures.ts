// Test fixtures for consolidation functionality
export const consolidationFixtures = {
  // Request parameters
  validParams: {
    program_id: 'prog_123',
    consolidation_id: 'cons_456'
  },
  
  invalidParams: {
    program_id: '',
    consolidation_id: ''
  },

  // Mock request objects
  validRequest: {
    params: {
      program_id: 'prog_123',
      consolidation_id: 'cons_456'
    },
    user: {
      id: 'user_123',
      email: 'test@example.com'
    },
    headers: {
      authorization: 'Bearer valid_token'
    }
  },

  invalidRequest: {
    params: {
      program_id: '',
      consolidation_id: ''
    }
  },

  // Mock reply object
  mockReply: {
    code: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis()
  },

  // Expected service response data
  validServiceResponse: {
    consolidation_id: 'cons_456',
    program_id: 'prog_123',
    invoice_details: {
      total_amount: 1500.00,
      currency: 'USD',
      invoice_count: 5,
      status: 'consolidated'
    },
    invoices: [
      {
        invoice_id: 'inv_001',
        amount: 300.00,
        date: '2024-01-15',
        status: 'paid'
      },
      {
        invoice_id: 'inv_002', 
        amount: 450.00,
        date: '2024-01-16',
        status: 'paid'
      },
      {
        invoice_id: 'inv_003',
        amount: 750.00,
        date: '2024-01-17',
        status: 'pending'
      }
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-17T14:30:00Z'
  },

  emptyServiceResponse: {
    consolidation_id: 'cons_456',
    program_id: 'prog_123',
    invoice_details: {
      total_amount: 0,
      currency: 'USD',
      invoice_count: 0,
      status: 'empty'
    },
    invoices: [],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },

  // Expected controller responses
  successControllerResponse: {
    statusCode: 200,
    message: 'CONSOLIDATION_DETAILS_FETCHED_SUCCESSFULLY',
    data: null, // Will be populated with service response
    error: null
  },

  errorControllerResponse: {
    statusCode: 500,
    message: 'FETCH_CONSOLIDATION_DETAILS_FAILED',
    data: null,
    error: 'Database connection failed'
  },

  // Mock messages object
  mockMessages: {
    CONSOLIDATION_DETAILS_FETCHED_SUCCESSFULLY: 'Consolidation details fetched successfully',
    FETCH_CONSOLIDATION_DETAILS_FAILED: 'Failed to fetch consolidation details'
  },

  // Error scenarios
  errors: {
    databaseError: new Error('Database connection failed'),
    validationError: new Error('Invalid consolidation ID'),
    notFoundError: new Error('Consolidation not found'),
    authError: new Error('Unauthorized access')
  }
};

// Mock Reply class
export class MockReply {
  statusCode: number = 200;
  message: string = '';
  data: any = null;
  error: any = null;

  sendResponse(reply: any) {
    return reply.status(this.statusCode).send({
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      error: this.error
    });
  }
}