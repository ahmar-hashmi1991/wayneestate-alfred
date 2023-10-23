import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtReturnDetail = new Schema({
        reversePickupCode: String,
        returnInitiated: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtReturnInitiated', autopopulate:false, index: true},
        returnStatus: String, // ENUM - statuses
        returnType: String, // ENUM - WAC or DRDER
        returnTotalRequestedRefund: Number, // Calculated according to  Refund
        returnTotalApprovedRefund: Number, 
        returnLastUpdatedBy: Number,
        transaction: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtTransaction', autopopulate:false, index: true},
},{
    timestamps: {
      createdAt: 'returnCreatedDate', // Use `returnCreatedDate` to store the created date
      updatedAt: 'returnLastUpdatedDate' // and `returnLastUpdatedBy` to store the last updated date
    }
  });



gtReturnDetail.plugin(require('mongoose-autopopulate'));
export const GtReturnDetail = mongoose.model('GtReturnDetail', gtReturnDetail);

