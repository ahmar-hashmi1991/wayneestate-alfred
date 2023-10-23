 import { gql} from 'apollo-server-express';


export const typeDefs = gql`
   

    enum inventoryType {
        GOOD_INVENTORY, #Default
        BAD_INVENTORY,
        QC_REJECTED,
        VIRTUAL_INVENTORY
    }

    enum adjustmentType {
        ADD, #Default
        REMOVE,
        REPLACE,
        TRANSFER
    }


    extend type Query {
         "Get Inventory Snapshot for the given SKUs"                
         getInventorySnapshot(skuCodes: [String!], updatedSinceInMinutes: Int, facility: String!): InventorySnapshotResponse
         checkInventoryforSKU(skuCodes: [String!], updatedSinceInMinutes: Int, facility: String!): InventorySnapshotResponse
     }

    extend type Mutation {
        adjustSingleInventory(input: InventoryAdjustmentInput, facility: String!): InventoryAdjustmentResponse
        adjustMultipleInventory(input: [InventoryMultipleAdjustmentInput], facility: String!): InventoryMultipleAdjustmentResponse
    }


    input InventoryAdjustmentInput {
        itemSKU: String!
        quantity: Int!
        shelfCode: String!
        inventoryType: inventoryType
        transferToShelfCode: String
        sla: Int
        adjustmentType: adjustmentType!
        remarks: String 
    }

    input InventoryMultipleAdjustmentInput {
        itemSKU: String!
        quantity: Int!
        shelfCode: String!
        inventoryType: inventoryType
        transferToShelfCode: String
        sla: Int
        adjustmentType: adjustmentType!
        remarks: String 
        facilityCode: String!
    }

    type InventoryAdjustmentResponse {
        "Gets the message saying either an error or a success message."
        message: String!
        "Success Message for the API - True or False."
        success: Boolean!
    }

    type InventoryMultipleAdjustmentResponse {
        "Gets the message saying either an error or a success message."
        message: String!
        "Success Message for the API - True or False."
        success: Boolean!
        "Response from the Unicom on adjusting Inventory"
        inventoryMultipleAdjustmentResponses: [InventoryMultipleAdjustmentResponses]
    }

    type InventoryMultipleAdjustmentResponses {
        facilityInventoryAdjustment: FacilityInventoryAdjustmentResponse
        successful: Boolean
    }

    type FacilityInventoryAdjustmentResponse {
        itemSKU: String!,
        quantity: Int!,
        shelfCode: String!,
        inventoryType: inventoryType,
        transferToShelfCode: String,
        sla: Int,
        adjustmentType: adjustmentType!,
        remarks: String
        facilityCode: String!     
    }


    type InventorySnapshotResponse {  
        "Gets the message saying either an error or a success message."
        message: String
        "Success Message for the API - True or False."
        success: Boolean
        "Response Object from Get Inventory Snapshot"
        inventorySnapshot: [InventorySnapshot]
    }


    type InventorySnapshot {
        itemTypeSKU: String
        "Inventory"
        inventory: Int
        "Open Sale"
        openSale: Int
        "Open Purchase"
        openPurchase: Int
        "Put Away Pending"
        putawayPending: Int
        "Inventory Blocked"
        inventoryBlocked: Int
        "Pending Stock Transfer"
        pendingStockTtransfer: Int
        "Vendor Inventory"
        vendorInventory: Int
        "Virtual Inventory"
        virtualInventory: Int
        "Inventory items whose assessment is pending"
        pendingInventoryAssessment: Int
    }

`;
