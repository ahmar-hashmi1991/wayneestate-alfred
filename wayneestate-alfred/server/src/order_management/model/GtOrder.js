import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtOrderSchema = new Schema({
    saleOrderId: {type: String, index: true},
    boDetail: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtBoDetail', autopopulate:false, index: true},
    orderBoFullName: String,
    orderBoPhone: String,
    orderDevicePhoneNumbers: [String],
    orderBoGSTNumber: String,
    orderDeltaId: String,
    orderBillingAddress: {
        _id: false,
        orderLegalBusinessName: String,
        orderAddressLine1: String,
        orderAddressLine2: String,
        orderDistrict: String,
        orderCountry: String,
        orderState: String,
        orderPincode: Number,
        orderMapLocation: String,
    },
    orderShippingAddress: {
        _id: false,
        orderAddressLine1: String,
        orderAddressLine2: String,
        orderDistrict: String,
        orderCountry: String,
        orderState: String,
        orderPincode: Number,
        orderMapLocation: String,
    },
    orderShippingPackages: [
        {   // Most fields below will be mapped from "Shipping Packages" in Get Sale Order Response from Unicomm 
            _id: false, 
            shipmentPackageCode: {type: String, index: true},
            shipmentPackageType: String,
            shipmentProvider: String,
            shipmentMethod: String,
            shipmentFCStatus: String, // CREATED, PICKING, PICKED, PACKED, READY TO SHIP, ADDED TO MANIFEST, DISPATCHED, SHIPPED, DELIVERED, CANCELED, RETURN EXPECTED, RETURN ACKNOWLEDGED, RETURNED
            shipmentTrackingNumber: String,
            shipmentTrackingStatus: String,
            shipmentCourierStatus: String,
            shipmentEstimatedWeight: Number,
            shipmentActualWeight: Number,
            shipmentBoxWidth: Number,
            shipmentBoxHeight: Number,
            shipmentBoxLength: Number,
            shipmentCreatedDate: Date,
            shipmentUpdatedDate: Date,
            shipmentDispatchedDate: String,
            shipmentDeliveredDate: String,
            shipmentInvoiceCode: String,
            shipmentInvoiceDisplayCode: String,
            shipmentNoOfItems: Number,
            shipmentCollectableAmount: Number,
            shipmentPaymentReconciled: Boolean,
            shipmentPodCode: String,
            shipmentManifestCode: String,
            shipmentShippingCharges: Number,
            shipmentInvoiceCreatedDate: Date,
            shipmentPackageItems: 
            [{
                _id: false,
                itemSku: String,
                itemName: String,
                quantity: Number,
            }],
            returnInitiated: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtReturnInitiated', autopopulate: false, index: true}]
        }],
    orderItems:
    [
        {
            _id: false,
            sku: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtSku', autopopulate:false, index: true},
            orderSkuCode: {type: String, index: true},
            orderSkuName: {type: String, index: true},
            orderQuantity: Number,
            orderQuantityFulfillable: Number,
            orderItemIsCancelled: Boolean,
            orderIsReturnEligible: Boolean, // SKU is returnable or not
            orderReturnEligibleDays: Number, // Days to return for an SKU
            orderIsExhangeEligible: Boolean, // SKU is Exhange-able or not
            orderExhangeEligibleDays: Number, // Days to Exhange for an SKU
            orderTag: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtTagTypeConstant', autopopulate:false, index: true},
            orderCoupon: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtCoupon', autopopulate:false, index: true},
            orderHookTagCoupon: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtCoupon', autopopulate:false, index: true},
            orderPrice:
            {
                _id: false,
                orderSellingPrice: Number,
                orderTotalPrice: Number,
                orderDiscountAmount: Number,
                // Price of SKU at the time of Order
                orderSkuPrices:
                {
                    orderCostPrice: Number,
                    orderBoPrice: Number,
                    orderMsp: Number,
                    orderGstPercent: Number,
                    orderCategoryFlashSaleDiscountPercentage: Number,
                    orderSubCategoryFlashSaleDiscountPercentage: Number,
                    orderSubSubCategoryFlashSaleDiscountPercentage: Number,
                    orderProductGroupFlashSaleDiscountPercentage: Number,
                    orderProductFlashSaleDiscountPercentage: Number,
                    orderSkuFlashSaleDiscountPercentage: Number,
                    orderSkuSpecialDiscountPercentage: Number,
                    // orderPincodeLevelSellingPrice: [{
                    //     _id: false,
                    //     pincode: {type: mongoose.SchemaTypes.ObjectId, ref:'GtPincode',autopopulate: false, index: true},
                    //     orderSellingPrice: Number,
                    // }],
                    // orderBoLevelSellingPrice: [{
                    //     _id: false,
                    //     boDetail: {type: mongoose.SchemaTypes.ObjectId, ref:'GtBoDetail', autopopulate: false, index: true},
                    //     orderSellingPrice: Number
                    // }],
                    orderIsPincodePriceUsed: Boolean,
                    orderIsBoPriceUsed: Boolean

                },
            },
        }
    ],
    orderBoConsumers: 
    [{
        _id: false,
        orderBoConsumerName: {type: String, index: true},
        orderBoConsumerPhoneNumber: {type: String, index: true},
        orderBoConsumerQuantity: Number
    }],
    orderAmount: Number, //  "Total Payble amount for this order"
    orderBizzcoinUsed: Number, // "Bizzcoins used for this order"
    orderTotalDiscountAmount: Number, // "Total Discount Amount for this order without Bizzcoins"
    orderShippingCharges: Number,
    orderPaymentMethod: String,
    coupon: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtCoupon',autopopulate: false, index: true},
    orderStatus: String,
    orderCancellationReason: String,
    orderCreatedBy: String,
    orderChannel: String,
},
{
    timestamps: {
      createdAt: 'orderCreatedDate', // Use `created_at` to store the created date
      updatedAt: 'orderLastUpdateDate' // Use `updated_at` to store the last updated date
    }
});


gtOrderSchema.plugin(require('mongoose-autopopulate'));
export const GtOrder = mongoose.model('GtOrder', gtOrderSchema);

