import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtReturnItemSchema = new Schema({
    
    sku: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtSku', autopopulate:false, index: true},
    returnItemSellingPrice: Number, // Selling Price of single SKU
    returnItemImages: [String],
    returnItemReason: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtReturnReasonTypeConstant', autopopulate:false, index: true},
    returnItemRequestedQuantity: Number, 
    returnRejectQuantityReason: String, // Reason for partial or complete rejection (if any)
    returnItemApprovedQuantity: Number,
    returnItemIsProcessed: Boolean, // Default - false, true if any event is done by Admin
    returnType: String, //ENUM - DRDER or WAC
}, {
    timestamps: {
      createdAt: 'returnItemCreatedDate', // Use `created_at` to store the created date
      updatedAt: 'returnItemUpdatedDate' // and `updated_at` to store the last updated date
    }
  });


gtReturnItemSchema.plugin(require('mongoose-autopopulate'));
export const GtReturnItem = mongoose.model('GtReturnItem', gtReturnItemSchema);

