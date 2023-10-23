import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtReturnInitiated = new Schema({
        shipmentPackageCode: String,
        order: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtOrder', autopopulate:false, index: true},
        returnItem: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtReturnItem', autopopulate:false, index: true}],
        returnInitiatedTotalRequestedRefund: Number,
        returnInitiatedStatus: String, // Return Requested, Return Cancelled, Return Processed
        returnDetail: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtReturnDetail', autopopulate:false, index: true}], // If returnInitiatedStatus is "Return Processed", then return Detail is created 
        returnInitiatedLastUpdatedBy: Number,
        },{
            timestamps: {
              createdAt: 'returnInitiatedCreatedDate', // Use `returnInitiatedCreatedDate` to store the created date
              updatedAt: 'returnInitiatedLastUpdatedDate' // and `returnInitiatedLastUpdatedDate` to store the last updated date
            }
          });


gtReturnInitiated.plugin(require('mongoose-autopopulate'));
export const GtReturnInitiated = mongoose.model('GtReturnInitiated', gtReturnInitiated);

