import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// ------------------ MOCK DATABASE FIRST ------------------
jest.mock("../../src/config/database", () => ({
  sequelize: {
    transaction: jest.fn(),
    define: jest.fn(() => ({
      init: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      aggregate: jest.fn(),
      count: jest.fn(),
    })),
  },
}));

// ------------------ MOCK ALL MODELS BEFORE IMPORTING ANYTHING ------------------
jest.mock("../../src/app/invoice/models/invoice_consolidation.model", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    aggregate: jest.fn(() => Promise.resolve(5)),
    count: jest.fn(() => Promise.resolve(5)),
    init: jest.fn(),
  },
}));

jest.mock("../../src/app/invoice/models/invoice.model", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    aggregate: jest.fn(),
    init: jest.fn(),
  },
}));

jest.mock("../../src/app/invoice/models/invoice_consolidation_items.model", () => ({
  InvoiceConsolidationItemsModel: {
    init: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    aggregate: jest.fn(),
  },
}));

jest.mock("../../src/app/invoice/models/invoice_consolidation_amount.model", () => ({
  InvoiceConsolidationAmountModel: {
    init: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    aggregate: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("../../src/app/invoice/models/invoice_request.model", () => ({
  RequestModel: {
    findOne: jest.fn(),
    update: jest.fn(),
    aggregate: jest.fn(),
    init: jest.fn(),
  },
}));

jest.mock("../../src/app/invoice/models/invoice_parent.model", () => ({
  InvoiceParentModel: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    aggregate: jest.fn(),
    init: jest.fn(),
  },
}));

jest.mock("../../src/app/invoice/models/invoice_master_data.model", () => ({
  MasterDataModel: {
    findOne: jest.fn(),
    aggregate: jest.fn(),
    init: jest.fn(),
  },
}));

jest.mock("../../src/app/invoice/models/invoice_custom_field.model", () => ({
  CustomFieldModel: {
    findOne: jest.fn(),
    aggregate: jest.fn(),
    init: jest.fn(),
  },
}));

// ------------------ MOCK REPOSITORIES ------------------
jest.mock("../../src/app/invoice/repositories/consolidation.repository");
jest.mock("../../src/app/invoice/repositories/invoice.repository");

// ------------------ MOCK UTILITIES ------------------
jest.mock("../../src/app/invoice/utilities/generate_code");
jest.mock("../../src/app/invoice/utilities/consolidation_group.utility", () => ({
  __esModule: true,
  default: {
    removeAfterLastPipe: jest.fn().mockReturnValue("vendor-123"),
    groupInvoices: jest.fn().mockReturnValue({
      "vendor1": [
        { invoice_id: "1", uuid: "uuid1", currency: "USD", hierarchy_id: "hier1", msp_managed_by: "msp1" },
        { invoice_id: "2", uuid: "uuid2", currency: "USD", hierarchy_id: "hier1", msp_managed_by: "msp1" },
      ]
    }),
  },
}));

// ------------------ MOCK SEQUELIZE DATATYPES ------------------
jest.mock("sequelize", () => ({
  DataTypes: {
    INTEGER: 'INTEGER',
    STRING: 'STRING',
    TEXT: 'TEXT',
    BOOLEAN: 'BOOLEAN',
    DATE: 'DATE',
    DECIMAL: 'DECIMAL',
    FLOAT: 'FLOAT',
    UUID: 'UUID',
    ENUM: jest.fn(),
  },
  Model: class MockModel {
    static init = jest.fn();
    static findOne = jest.fn();
    static findAll = jest.fn();
    static create = jest.fn();
    static update = jest.fn();
    static destroy = jest.fn();
    static aggregate = jest.fn();
    static count = jest.fn();
  },
  Sequelize: jest.fn(),
}));

// ------------------ NOW IMPORT THE MODULES ------------------
import consolidationModel from "../../src/app/invoice/models/invoice_consolidation.model";
import ConsolidationService from "../../src/app/invoice/services/consolidation.service";
import ConsolidationRepository from "../../src/app/invoice/repositories/consolidation.repository";
import InvoiceRepository from "../../src/app/invoice/repositories/invoice.repository";
import { sequelize } from "../../src/config/database";

describe("ConsolidationService - getInvoiceConsolidationDetails", () => {
  let consolidationModelMock: typeof consolidationModel;
  let consolidationService: ConsolidationService;
  let consolidationRepoMock: jest.Mocked<ConsolidationRepository>;
  let invoiceRepoMock: jest.Mocked<InvoiceRepository>;

  const validConsolidationDetails = {
    id: 1,
    code: "CONS123",
    batch_number: "BATCH001",
    status: "ACTIVE",
    transaction_complete: false,
    action_allow: {
      transaction_complete: true,
      cancel_consolidation: true,
      confirm_consolidation: true,
    },
    invoice_ids: ["inv1", "inv2"],
    invoices: [],
    created_by: "user1",
    created_by_name: "John Doe",
    created_date: "2025-01-01",
    updated_by: "user2",
    updated_by_name: "Jane Smith",
    updated_date: "2025-01-02",
    summary: {
      invoice_count: 2,
      total_amount: 1000,
      total_balance_due: 500,
    },
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create fresh instances
    consolidationRepoMock = new (ConsolidationRepository as any)() as jest.Mocked<ConsolidationRepository>;
    invoiceRepoMock = new (InvoiceRepository as any)() as jest.Mocked<InvoiceRepository>;
    consolidationService = new ConsolidationService();

    // Setup default mock implementations
    consolidationRepoMock.getInvoiceConsolidationDetails = jest.fn();
  });

  it("returns consolidation details for valid consolidation id", async () => {
    consolidationRepoMock.getInvoiceConsolidationDetails.mockResolvedValue(validConsolidationDetails as any);

    const result = await consolidationService.getInvoiceConsolidationDetails({}, "prog1", "cons1");

    expect(result).toEqual(validConsolidationDetails);
    expect(consolidationRepoMock.getInvoiceConsolidationDetails).toHaveBeenCalledWith({}, "prog1", "cons1");
  });

  it("returns null if consolidation not found", async () => {
    consolidationRepoMock.getInvoiceConsolidationDetails.mockResolvedValue(null as any);

    const result = await consolidationService.getInvoiceConsolidationDetails({}, "prog1", "invalid-id");

    expect(result).toBeNull();
    expect(consolidationRepoMock.getInvoiceConsolidationDetails).toHaveBeenCalledWith({}, "prog1", "invalid-id");
  });

  it("throws error if repository throws", async () => {
    const errorMessage = "DB error";
    consolidationRepoMock.getInvoiceConsolidationDetails.mockRejectedValue(new Error(errorMessage));

    await expect(
      consolidationService.getInvoiceConsolidationDetails({}, "prog1", "cons1")
    ).rejects.toThrow(errorMessage);
    
    expect(consolidationRepoMock.getInvoiceConsolidationDetails).toHaveBeenCalledWith({}, "prog1", "cons1");
  });

  it("handles empty invoice list gracefully", async () => {
    const emptyInvoiceDetails = {
      ...validConsolidationDetails,
      invoice_ids: [],
      summary: {
        ...validConsolidationDetails.summary,
        invoice_count: 0,
      },
    };
    
    consolidationRepoMock.getInvoiceConsolidationDetails.mockResolvedValue(emptyInvoiceDetails as any);

    const result = await consolidationService.getInvoiceConsolidationDetails({}, "prog1", "cons2");
    
    expect(result?.invoice_ids).toEqual([]);
    expect(result?.summary.invoice_count).toBe(0);
    expect(consolidationRepoMock.getInvoiceConsolidationDetails).toHaveBeenCalledWith({}, "prog1", "cons2");
  });

  it("includes action_allow flags correctly", async () => {
    consolidationRepoMock.getInvoiceConsolidationDetails.mockResolvedValue(validConsolidationDetails as any);

    const result = await consolidationService.getInvoiceConsolidationDetails({}, "prog1", "cons3");

    expect(result?.action_allow.transaction_complete).toBe(true);
    expect(result?.action_allow.cancel_consolidation).toBe(true);
    expect(result?.action_allow.confirm_consolidation).toBe(true);
    expect(consolidationRepoMock.getInvoiceConsolidationDetails).toHaveBeenCalledWith({}, "prog1", "cons3");
  });

  it("handles undefined action_allow gracefully", async () => {
    const detailsWithoutActionAllow = {
      ...validConsolidationDetails,
      action_allow: undefined,
    };
    
    consolidationRepoMock.getInvoiceConsolidationDetails.mockResolvedValue(detailsWithoutActionAllow as any);

    const result = await consolidationService.getInvoiceConsolidationDetails({}, "prog1", "cons4");

    expect(result?.action_allow).toBeUndefined();
    expect(consolidationRepoMock.getInvoiceConsolidationDetails).toHaveBeenCalledWith({}, "prog1", "cons4");
  });

  it("handles partial action_allow flags", async () => {
    const partialActionAllow = {
      ...validConsolidationDetails,
      action_allow: {
        transaction_complete: false,
        cancel_consolidation: true,
        // confirm_consolidation is missing
      },
    };
    
    consolidationRepoMock.getInvoiceConsolidationDetails.mockResolvedValue(partialActionAllow as any);

    const result = await consolidationService.getInvoiceConsolidationDetails({}, "prog1", "cons5");

    expect(result?.action_allow.transaction_complete).toBe(false);
    expect(result?.action_allow.cancel_consolidation).toBe(true);
    expect(result?.action_allow.confirm_consolidation).toBeUndefined();
    expect(consolidationRepoMock.getInvoiceConsolidationDetails).toHaveBeenCalledWith({}, "prog1", "cons5");
  });
});