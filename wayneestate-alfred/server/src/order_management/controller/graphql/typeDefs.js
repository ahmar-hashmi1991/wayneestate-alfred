import { gql} from 'apollo-server-express';

export const typeDefs = gql`

    enum PaymentMethods {
        PAYONDELIVERY
        CASHONDELIVERY
        CREDIT
        PREPAID
    }

    extend  type Query {
        "Get order details using orderId"
        getOrderById(_id:ID!): Order
        "Get all orders for a specific business owner"        
        getAllOrdersByBoId(offset: Int, limit: Int, _id:ID!): [Order]
        "Get today's orders for a specific business owner"        
        getTodaysOrdersForBoId(offset: Int, limit: Int, _id:ID!): [Order]
        "Get all orders"
        getAllOrders(offset: Int!, limit: Int! ): [Order]
        "Get Sale Order Details"
        getSaleOrder(_id:ID!, saleOrderID:String!, facilityCodes: [String!] ): GetSaleOrderResponse
        "Get Shipping Package Details"
        getShippingPackageDetails(shippingPackageCode: String!): String #For now only fetching Status Code from shippingPackageDetailDTO Response
        "Get Invoice PDF for the order"
        getInvoicePDF(invoiceCodes: String!, facility: String): String
        "Get Invoice Details for given shipping package code"
        getInvoiceDetails(shippingPackageCode: String!): GetInvoiceDetailsResponse
        "Fetch Orders And Shippment For All the Active Orders"
        fetchOrderAndShippmentForActiveOrders: [Order]
        "Get Order by SOID"
        getOrderBySOID(saleOrderId: String!): Order
        "Get All Orders by Bo Phone Number"
        getAllOrdersByBoPhone(orderBoPhone: String!): [Order],
        "Get All orders with return initiateds by Bo Phone Number"
        getAllReturnInitiatedIdsOfOrdersByBoPhone(orderBoPhone: String!): [ID],
        "Order Query For Alfred Order Page"
        getOrdersForAlfredOrderPage(saleOrderId: String, orderBoPhone: String): [Order],
        "Get order count for Alfred for today"
        getAlfredOrderCountForToday: Int,
        "Get alfred's order count delta from yesterday"
        getAlfredOrderCountDeltaFromYesterday: Int
        "Get order count for Robin for today"
        getRobinOrderCountForToday: Int,
        "Get robin's order count delta from yesterday"
        getRobinOrderCountDeltaFromYesterday: Int,
        "Get total revenue for today"
        getTotalRevenueForToday: Float,
        "Get total revenue delta from yesterday"
        getTotalRevenueDeltaFromYesterday: Float,
        "Get total revenue from Alfred for today"
        getTotalAlfredRevenueForToday: Float,
        "Get total revenue from Robin for today"
        getTotalRobinRevenueForToday: Float,
        "Get total discount all time"
        getTotalOrderDiscountAllTime: Float,
        "Get total bizzcoin used all time"
        getTotalBizzcoinUsedAllTime: Int,
        "Get total revenue all time"
        getTotalRevenueAllTime: Float,
        "Get count of orders from Alfred all time"
        getTotalAlfredOrderCount: Int,
        "Get count of orders from Robin all time"
        getTotalRobinOrderCount: Int,
        "Get orders revenue by state"
        getStatewiseRevenue: [GetStatewiseRevenueResponse],
        "Get orders count by state"
        getStatewiseOrderCount: [GetStatewiseOrderCountResponse],
        "Get top selling skus by count"
        getTopSellingSkusByCount(limit: Int): [GetSkuwiseCountResponse],
        "Get top selling skus by revenue"
        getTopSellingSkusByRevenue(limit: Int): [GetSkuwiseRevenueResponse],
        "Get daily revenue from Alfred since past n days"
        getDailyRevenueFromAlfredSincePastNDays(limit: Int): [GetDailyRevenueResponse],
        "Get daily revenue from Robin since past n days"
        getDailyRevenueFromRobinSincePastNDays(limit: Int): [GetDailyRevenueResponse],
        "Get daily order count from Alfred since past n days"
        getDailyOrderCountFromAlfredSincePastNDays(limit: Int): [GetDailyOrderCountResponse],
        "Get daily order count from Robin since past n days"
        getDailyOrderCountFromRobinSincePastNDays(limit: Int): [GetDailyOrderCountResponse]
    }

    # Need to create resolvers for this
    extend type Mutation {
       createOrder(input: OrderInput): OrderResponse
       "STRICTLY DO NOT USE UPDATE ORDER- This API is not actually to be used by the clients but internally by the server only."
       updateOrder(_id:ID!,input:OrderInput): OrderResponse
       cancelOrder(_id:ID!, orderCancellationReason: String): OrderResponse
    }

    #Inputs
    input OrderBillingAddressInput {
        "Address Name for Billing Purpose"
        orderLegalBusinessName: String
 		"Line 1 for order billing address "
        orderAddressLine1: String!
        "Line 2 for order billing address"
        orderAddressLine2: String
        "District/City in here"
        orderDistrict: String!
        "Country input string"
        orderCountry: String!
        "State input string"
        orderState: String!
        "Pincode input Number"
        orderPincode: Int!
        "Exact map location for a order billing address"
        orderMapLocation: String       
    }

    input  OrderShippingAddressInput {
 		"Line 1 for order billing address "
        orderAddressLine1: String!
        "Line 2 for order billing address"
        orderAddressLine2: String
        "District/City in here"
        orderDistrict: String!
        "Country input string"
        orderCountry: String!
        "State input string"
        orderState: String!
        "Pincode input Number"
        orderPincode: Int!
        "Exact map location for a order billing address"
        orderMapLocation: String       
    }

    input OrderPriceInput {
        orderSellingPrice: Float
        orderShippingCharges: Float
        orderTotalPrice: Float 
        orderDiscountAmount: Float 
        "Price of SKU at the time of Ordering"
        orderSkuPrices: OrderSkuPricesInput
    }



    input OrderItemsInput {
        sku: ID 
        orderSkuName: String
        orderSkuCode: String
        orderQuantity: Int
        orderItemIsCancelled: Boolean 
        orderPrice: OrderPriceInput
        orderIsReturnEligible: Boolean # SKU is returnable or not
        orderReturnEligibleDays: Int # Days to return for an SKU
        orderIsExhangeEligible: Boolean # SKU is Exhange-able or not
        orderExhangeEligibleDays: Int # Days to Exhange for an SKU
        orderTag: ID
        orderCoupon: ID
        orderHookTagCoupon: ID
    }

    input OrderSkuPricesInput {
        "Cost price of this SKU"
        orderCostPrice: Float
        "Selling price for a generic BO"
        orderBoPrice: Float
        "MSP/MRP of the price"
        orderMsp: Float,
        "GST Percentage"
        orderGstPercent: Float,
        "Category Flash Sale Discount Percentage"
        orderCategoryFlashSaleDiscountPercentage: Float
        "Sub Category Flash Sale Discount Percentage"
        orderSubCategoryFlashSaleDiscountPercentage: Float
        "SubSubCategory Flash Sale Discount Percentage"
        orderSubSubCategoryFlashSaleDiscountPercentage: Float
        "Product Gp Flash Sale Discount Percentage"
        orderProductGroupFlashSaleDiscountPercentage: Float
        "Product Flash Sale Percentage Discount"
        orderProductFlashSaleDiscountPercentage: Float
        "SKU Flash Sale Percentage Discount"
        orderSkuFlashSaleDiscountPercentage: Float
        "SKU Special Discount Percentage"
        orderSkuSpecialDiscountPercentage: Float
        "Has pincode level pricing been used or not"
        orderIsPincodePriceUsed: Boolean
        "Has BO level pricing been used or not"
        orderIsBoPriceUsed: Boolean
    }

    input OrderInput {
        boDetail: ID
        orderDeltaId: String
        orderBoFullName: String
        orderBoPhone: String
        orderDevicePhoneNumbers: [String],
        orderBoGSTNumber: String
        orderBillingAddress: OrderBillingAddressInput
        orderShippingAddress: OrderShippingAddressInput
        orderItems: [OrderItemsInput]
        orderBoConsumers: [orderBoConsumersInput!]
        "Total payble amount for this order"
        orderAmount: Float!
        "Bizzcoins used for this order"
        orderBizzcoinUsed: Int
        "Total Discount Amount for this order without Bizzcoins"
        orderTotalDiscountAmount: Float
        "Total Shipping Charges Applied"
        orderShippingCharges: Float
        orderPaymentMethod: PaymentMethods
        orderStatus: String
        orderCancellationReason: String
        orderDeliveredDate: String 
        orderChannel: String 
        
    }


    
    input  orderBoConsumersInput   {
        orderBoConsumerName: String
        orderBoConsumerPhoneNumber: String
        orderBoConsumerQuantity: Int
    }


    type OrderResponse {
        
        "Indicates whether the mutation was successful"
        messageFromGotham: String
        "Indicates whether the Create Sale Order at Unicom was successful"
        messageFromUniware: String
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated order after a successful mutation"
        order: Order
        "Status of the order"
        orderStatus: String
        "Indicates if inventory for a sku on Unicommerce is less than inventory on gotham DB at the time of order placement. "
        isSkuOutOfStock: Boolean
    }


    type ReturnResponse {
        
        "Indicates whether the mutation was successful"
        messageFromGotham: String
        "Indicates whether the Create Sale Order at Unicom was successful"
        messageFromUniware: String
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated order after a successful mutation"
        reversePickupCode: String
    }
    

    type OrderBillingAddress {
            "Address Name for Billing Purpose"
            orderLegalBusinessName: String
			"Line 1 for order billing address "
            orderAddressLine1: String
            "Line 2 for order billing address"
            orderAddressLine2: String
            "District/City in here"
            orderDistrict: String
            "Country input string"
            orderCountry: String
            "State input string"
            orderState: String
            "Pincode input Number"
            orderPincode: Int
            "Exact map location for a order billing address"
            orderMapLocation: String       
    }

    type OrderShippingAddress {
			"Line 1 for order billing address "
            orderAddressLine1: String!
            "Line 2 for order billing address"
            orderAddressLine2: String
            "District/City in here"
            orderDistrict: String!
            "Country input string"
            orderCountry: String!
            "State input string"
            orderState: String!
            "Pincode input Number"
            orderPincode: Int!
            "Exact map location for a order billing address"
            orderMapLocation: String
    }

    type ShipmentPackageItems {

           "Sku item of a shipping package"
           itemSku: String!
           "Name of item in a shipping package"
           itemName: String!
            "quantity of shipment Item"
           quantity: Int

    }




    type OrderShippingPackages {
           "Code for a shipping package given by unicommerce"
            shipmentPackageCode: String 
            shipmentPackageType: String
            shipmentProvider: String
            shipmentMethod: String
            shipmentFCStatus: String #PENDING_VERIFICATION, CREATED, PROCESSING, COMPLETE, CANCELLED
            shipmentTrackingNumber: String
            shipmentTrackingStatus: String
            shipmentCourierStatus: String
            shipmentEstimatedWeight: Float
            shipmentActualWeight: Float # in gms
            shipmentBoxWidth: Float # in mm
            shipmentBoxHeight: Float # in mm
            shipmentBoxLength: Float # in mm
            shipmentCreatedDate: String
            shipmentUpdatedDate: String
            shipmentDispatchedDate: String
            shipmentDeliveredDate: String
            shipmentInvoiceCode: String
            shipmentInvoiceDisplayCode: String
            shipmentNoOfItems: Int
            shipmentCollectableAmount: Float
            shipmentPaymentReconciled: Boolean
            shipmentPodCode: String
            shipmentManifestCode: String
            shipmentShippingCharges: Float
            shipmentInvoiceCreatedDate: String
            shipmentPackageItems: [ShipmentPackageItems] 
            returnInitiated: [ReturnInitiated]

        
    }

    type OrderPrice {
        "Selling price for a order"
        orderSellingPrice: Float
        "Shipping charges for a order"
        orderShippingCharges: Float
        "Total price for a order"
        orderTotalPrice: Float 
        "Discount amount for a order"
        orderDiscountAmount: Float 
        "Price of SKU at the time of Ordering"
        orderSkuPrices: OrderSkuPrices
    }

    type OrderSkuPrices {
        "Cost price of this SKU"
        orderCostPrice: Float
        "Selling price for a generic BO"
        orderBoPrice: Float
        "MSP/MRP of the price"
        orderMsp: Float,
        "GST Percentage"
        orderGstPercent: Float,
        "Category Flash Sale Discount Percentage"
        orderCategoryFlashSaleDiscountPercentage: Float
        "Sub Category Flash Sale Discount Percentage"
        orderSubCategoryFlashSaleDiscountPercentage: Float
        "SubSubCategory Flash Sale Discount Percentage"
        orderSubSubCategoryFlashSaleDiscountPercentage: Float
        "Product Gp Flash Sale Discount Percentage"
        orderProductGroupFlashSaleDiscountPercentage: Float
        "Product Flash Sale Percentage Discount"
        orderProductFlashSaleDiscountPercentage: Float
        "SKU Flash Sale Percentage Discount"
        orderSkuFlashSaleDiscountPercentage: Float
        "SKU Special Discount Percentage"
        orderSkuSpecialDiscountPercentage: Float
        "Pincode Specific Price for this SKU applicable at the time of Order"
        pincodeLevelSellingPrice: [PincodeLevelSellingPrice]
        "Prices specific to BO for this SKU applicable"
        boLevelSellingPrice: [BoLevelSellingPrice]
    }

    type PincodeLevelSellingPrice {
        pincode: Pincode!
        orderSellingPrice: Float
    }

    type BoLevelSellingPrice {
        boDetail: BoDetail
        sellingPrice: Float
    }


    type OrderItems {
        "Sku that belongs to a Order"
        sku: Sku! 
        "Sku name for the order item "
        orderSkuName: String!
        "Order SKU bizztm generated code"
        orderSkuCode: String!
        "Quantity of the order"
        orderQuantity: Int!
        "Quantity that is fulfillable and inventory is present according to unicommerce"
        orderQuantityFulfillable: Int
        "Flag to mark if a order is cancelled"
        orderItemIsCancelled: Boolean 
        "Reference to order price type for all price related details"
        orderPrice: OrderPrice!
        orderIsReturnEligible: Boolean # SKU is returnable or not
        orderReturnEligibleDays: Int # Days to return for an SKU
        orderIsExhangeEligible: Boolean # SKU is Exhange-able or not
        orderExhangeEligibleDays: Int # Days to Exhange for an SKU
        " Denotes the Tag to which SKU belong - can be a hook tag or a normal tag"
        orderTag: TagTypeConstant 
        " Generic coupon applied on this item "
        orderCoupon: Coupon
        "Hook tag coupon applied on this item" 
        orderHookTagCoupon: Coupon
    }

    type   orderBoConsumers   {
        orderBoConsumerName: String
        orderBoConsumerPhoneNumber: String
        orderBoConsumerQuantity: Int
    }

    type Order {
        _id: ID!
        "Sale Order Id is created only after order is created on unicom"
        saleOrderId: String
        "Name of the business owner that placed the order"
        orderBoFullName: String!
        "Reference to the business owner that placed the order"
        boDetail: BoDetail 
        "Delta ID by BDEs to track order"
        orderDeltaId: String
        "Phone number of the user/bo that placed the order"
        orderBoPhone: String!
        "Phone Numbers of the device through which the order was placed"
        orderDevicePhoneNumbers: [String],
        "GST Number of the BO placing the order"
        orderBoGSTNumber: String
        "Reference to the order billing address"
        orderBillingAddress: OrderBillingAddress
        "Reference to the order shipping address"
        orderShippingAddress: OrderShippingAddress!
        "Reference to the shipping packages"
        orderShippingPackages: [OrderShippingPackages]
        "Reference to the order items for a order"
        orderItems: [OrderItems]
        "Customers tagged in this order"
        orderBoConsumers: [orderBoConsumers!]
        "Total payble amount for this order"
        orderAmount: Float!
        "Bizzcoins used for this order"
        orderBizzcoinUsed: Int
        "Total Discount Amount for this order without Bizzcoins"
        orderTotalDiscountAmount: Float
        "Total Shipping Charges for the order"
        orderShippingCharges: Float
         "Payment method for a order"
        orderPaymentMethod: PaymentMethods!
        "Status for the order"
        orderStatus: String
        "Order if Cancelled, the reason to cancel -"
        orderCancellationReason: String
        "Delivered date for  a order"
        orderDeliveredDate: String 
        "User that the order was created by"
        orderCreatedBy: String 
        "Channel that the order was created on"
        orderChannel: String 
        "Date on which Order is created"
        orderCreatedDate: String
    }

    type GetSaleOrderResponse {
        success: Boolean!
        message: String!
        saleOrderDTOResponse: SaleOrderDTOResponse
    }

    type GetInvoiceDetailsResponse {
        success: Boolean!
        message: String!
        invoiceDetailsDTOResponse: InvoiceDetailsDTOResponse
    }

    type SaleOrderDTOResponse {
      code: String,
      displayOrderCode: String,
      channel: String,
      source: String
      displayOrderDateTime: String,
      status: String,
      created: String,
      updated: String,
      fulfillmentTat: String,
      notificationEmail: String,
      notificationMobile: String,
      customerGSTIN: String,
      cod: Boolean,
      thirdPartyShipping: Boolean,
      priority: Int,
      currencyCode: String,
      customerCode: String,
    }

    type InvoiceDetailsDTOResponse {
        code: String,
        displayCode: String,
        shippingPackageCode: String,
        totalQuantity: Int,
        shippingCharges: Float 
    }

    type GetStatewiseRevenueResponse {
        orderState: String,
        orderRevenue: Float
    }

    type GetStatewiseOrderCountResponse {
        orderState: String,
        orderCount: Int
    }

    type GetSkuwiseCountResponse {
        orderSkuCode: String,
        skuCount: Int
    }

    type GetSkuwiseRevenueResponse {
        orderSkuCode: String,
        skuRevenue: Float
    }

    type GetDailyRevenueResponse {
        ordersDate: String,
        ordersRevenue: Float
    }

    type GetDailyOrderCountResponse {
        ordersDate: String,
        ordersCount: Int
    }

   
`;
