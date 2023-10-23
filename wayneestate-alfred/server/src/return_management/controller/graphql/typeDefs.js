import { gql} from 'apollo-server-express';

export const typeDefs = gql`
   
   enum returnStatus {
        RETURN_REQUESTED, 
        RETURN_CANCELLED, 
        RETURN_PROCESSED, 
        RETURN_REJECTED,
        RETURN_PICKED, 
        REFUND_PROCESSED,
        COMPLETE,
        CREATED

        #STATUS FROM UNIWARE - NOT SURE ABOUT THIS
        # CREATED,
        # COMPLETE,
        # CANCELLED,
        # REDISPATCH_PENDING,
        # REDISPATCHED,
        # COURIER_ALLOCATED,
        # APPROVAL_PENDING,
        # PICKED,
        # CUSTOMER_DISPUTED,
        # COURIER_DISPUTED,
        # MANIFESTED,
        # LOCATION_NOT_SERVICEABLE
    }
    
    enum returnType {
        WAC,
        DRDER
    }


   extend type Query {
        "Get ReturnInitiated using returnInitiated Id"
        getReturnInitiatedById(_id:ID!): ReturnInitiated
        "Get all returnInitiateds"
        getAllReturnInitiated(returnInitiatedStatus: returnStatus!): [ReturnInitiated]
        "Get Return Detail using Id"
        getReturnDetailById(_id: ID!): ReturnDetail
        "Get All Return Details"
        getAllReturnDetail(limit: Int, offset: Int): [ReturnDetail]
        "Find Return Initited by Bo Number"
        getAllReturnInitiatedsByBoNumber(orderBoPhone: String!): [ReturnInitiated]
        "Find Return Detail by Bo Number"
        getReturnDetailByBoNumber(orderBoPhone: String!): [ReturnDetail]
        "Get all returnInitiateds for New Alfred Panel"
        getAllReturnInitiatedForNewAlfred(offset:Int,limit:Int): [ReturnInitiated]
    }



  extend type Mutation {
        "Create ReturnInitiated"
        createReturnInitiated(input: ReturnInitiatedInput): ReturnInitiatedResponse
        "Create ReturnItem"
        createReturnItem(input: ReturnItemInput): ReturnItemResponse
        #"Create Return Detail"
        #createReturnDetail(input: ReturnDetailInput) : ReturnDetailResponse
        "Create Return Initiated and Items"
        createReturnInitiatedAndItem(input: ReturnInitiatedAndItemInput) : ReturnInitiatedAndItemResponse
        "Create Return Details and Update Return Items using this API from Alfred"
        createReturnDetailAndUpdateItem(input: ReturnDetailAndUpdateItemInput) : ReturnDetailResponse
        "Create Reverse Pickup Call to uniware - Used at the time of Picking Only"
        createReversePickup(_id:ID!, input: ReturnDetailAndUpdateItemInput) : ReturnDetailResponse
        "Cancel Return Initiated"
        changeReturnInitiatedStatus(_id:ID!, returnInitiatedStatus: returnStatus): ReturnInitiatedResponse
        "Cancel Return Detail"
        cancelReturnDetail(_id:ID!): ReturnDetailResponse
        updateTransactionIdInReturnDetail(_id:ID!, txnId: ID!): ReturnDetailResponse
        #updateReturnInitiatedWithDetails(_id:ID!,input: ReturnInitiatedInput): ReturnInitiatedResponse
        #updateReturnItem(_id:ID!,input: ReturnItemInput): ReturnInitiatedResponse
    }

    #Inputs

    input ReturnInitiatedAndItemInput {
        "Shipping package code for this return"
        shipmentPackageCode: String
        "Order for this return"
        order: ID
        "Total amount that will be refunded based on initiated items"
        returnInitiatedTotalRequestedRefund: Float
        "Return Items"
        returnItem: [ReturnItemInput]
    }

    input ReturnInitiatedInput {
        "Shipping package code for this return"
        shipmentPackageCode: String
        "Order for this return"
        order: ID
        "List of return item Id's, contains original initiated items"
        returnItem: [ID]
        "Total amount that will be refunded based on initiated items"
        returnInitiatedTotalRequestedRefund: Float
        "Status for this return"
        returnInitiatedStatus: returnStatus
        "List of return Detail Id's "
        returnDetail: [ID]
    }


    input ReturnItemInput {
        "Reference to the sku of this return item"
        sku: ID
        "Item level selling price for this return item"
        returnItemSellingPrice: Float
        "List of Images to validate return reason "
        returnItemImages: [String]
        "Reference to ReturnReasonTypeConstant , which contains reason for return"
        returnItemReason: ID
        "Requested quantity for return"
        returnItemRequestedQuantity: Int
        "Rejection Reason if any quantity of returnInitiated gets rejected"
        returnRejectQuantityReason: String
        "Quantity that is approved for refund"
        returnItemApprovedQuantity: Int
        "Flag to check if return item has been processed by admin"
        returnItemIsProcessed: Boolean
        "WAC - pick up return item or DRDER - Dont pickup return item "
        returnType: returnType
    }

    input ReturnDetailInput {
        "Reference to return initiated detail"
        returnInitiated: ID
        "Status of a return detail"
        returnStatus: returnStatus
        "WAC - pick up return item or DRDER - Dont pickup return item "
        returnType: returnType
        "Requested refund amount for this return"
        returnTotalRequestedRefund: Float
        "Approved refund amount for this return"
        returnTotalApprovedRefund: Float 
        "reverse pickup input"
        reversePickup: ReversePickupInput
    } 

    
    input ReturnDetailAndUpdateItemInput {
        "Reference to return initiated detail"
        returnInitiated: ID
        "Status of a return detail"
        returnStatus: returnStatus
        "WAC - pick up return item or DRDER - Dont pickup return item "
        returnType: returnType
        "Requested refund amount for this return"
        returnTotalRequestedRefund: Float
        "Approved refund amount for this return"
        returnTotalApprovedRefund: Float 
        "reverse pickup input"
        reversePickup: ReversePickupInput
        "Item updated information"
        returnItemsUpdate: [ReturnItemsUpdateInput]
    } 

    input ReturnItemsUpdateInput {
        _id: ID
        "Reference to ReturnReasonTypeConstant , which contains reason for return"
        returnItemReason: ID
        "Rejection Reason if any quantity of returnInitiated gets rejected"
        returnRejectQuantityReason: String
        "Quantity that is approved for refund"
        returnItemApprovedQuantity: Int
        "Flag to check if return item has been processed by admin"
        returnItemIsProcessed: Boolean
        "Return Type for the type of return"
        returnType: String
    }

    input ReversePickupInput {
        orderID: ID
        shipmentPackageCode: String
    }


    #Response
    type ReturnInitiatedAndItemResponse {
       "Indicates whether the mutation was successful"
       message: String!
       "Human-readable message for the UI"
       success: Boolean!
       "Newly updated banner after a successful mutation"
       returnInitiated: ReturnInitiated
   }

    type ReturnInitiatedResponse {
       
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated banner after a successful mutation"
        returnInitiated: ReturnInitiated
    }

    type ReturnItemResponse {
         "Indicates whether the mutation was successful"
         message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated banner after a successful mutation"
        returnItem: ReturnItem
    }

    type ReturnDetailResponse {
        "Indicates whether the mutation was successful on Gotham"
        messageFromGotham: String!
        "Indicates whether the mutation was successful on Uniware"
        messageFromUniware: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated banner after a successful mutation"
        returnDetail: ReturnDetail
    }



    #Schema Main

    type ReturnInitiated {
         _id: ID
        "Shipping package code for this return"
        shipmentPackageCode: String
        "Order for this return"
        order: Order
        "List of return item Id's, contains original initiated items"
        returnItem: [ReturnItem],
        "Total amount that will be refunded based on initiated items"
        returnInitiatedTotalRequestedRefund: Float
        "Status for this return"
        returnInitiatedStatus: returnStatus
        "List of return Detail Id's "
        returnDetail: [ReturnDetail]
        "Creation date of return initiated"
        returnInitiatedCreatedDate: String
        "Last updated date of return initiated"
        returnInitiatedLastUpdatedDate: String
        "Uset that last updated this return initiated"
        returnInitiatedLastUpdatedBy: String 

    }

    type ReturnItem {
        _id: ID
        "Reference to the sku of this return item"
        sku: Sku
        "Item level selling price for this return item"
        returnItemSellingPrice: Float
        "List of Images to validate return reason "
        returnItemImages: [String]
        "Reference to ReturnReasonTypeConstant , which contains reason for return"
        returnItemReason: ReturnReasonTypeConstant
        "Requested quantity for return"
        returnItemRequestedQuantity: Int
        "Rejection Reason if any quantity of returnInitiated gets rejected"
        returnRejectQuantityReason: String
        "Quantity that is approved for refund"
        returnItemApprovedQuantity: Int
        "Flag to check if return item has been processed by admin"
        returnItemIsProcessed: Boolean
        "WAC - pick up return item or DRDER - Dont pickup return item "
        returnType: returnType
        "Creation date of a return item"
        returnItemCreatedDate: String
    }


    type ReturnDetail {
        _id: ID
        "Code generated by unicommerce for each reverse pickup"
        reversePickupCode: String
        "Reference to return initiated detail"
        returnInitiated: ReturnInitiated
        "Status of a return detail"
        returnStatus: returnStatus
        "WAC - pick up return item or DRDER - Dont pickup return item "
        returnType: returnType
        "Requested refund amount for this return"
        returnTotalRequestedRefund: Float
        "Approved refund amount for this return"
        returnTotalApprovedRefund: Float 
        "Last updated date of return initiated"
        returnLastUpdatedDate: String
        "Uset that last updated this return initiated"
        returnLastUpdatedBy: String
        "Reference to refund transaction for this return detail"
        transaction: Transaction
        "Creation date of a return detail"
        returnCreatedDate: String,
         
    }

    
         
    

         

`;
