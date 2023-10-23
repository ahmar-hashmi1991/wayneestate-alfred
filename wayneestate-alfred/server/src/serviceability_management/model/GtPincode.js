import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtPincodeSchema = new Schema({
    pincode: {type: Number, required: true, index: true},
    pincodeDistrict: {type: String, required: true},
    pincodeRegion:  {type: String},
    state: {
        type: mongoose.SchemaTypes.ObjectId, 
        ref: 'GtState', 
        required: true,
        autopopulate: false
    },
    pincodeIsServiceable: {type: Boolean, required: true},
},{
    timestamps: {
      createdAt: 'pincodeCreatedDate', // Use `pincodeCreatedDate` to store the created date
      updatedAt: 'pincodeUpdatedDate' // and `pincodeUpdatedDate` to store the last updated date
    }
  });

gtPincodeSchema.plugin(require('mongoose-autopopulate'));

export const GtPincode = mongoose.model('GtPincode', gtPincodeSchema);