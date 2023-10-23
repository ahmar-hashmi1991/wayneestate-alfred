import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtKycTypeConstantSchema = new Schema({
   kycDocName: {type: String},
   kycDocDescription: {type: String, },
   boDocumentNumber: Boolean,
   kycDocImageFront: Boolean,
   kycDocumentImageBack: Boolean,
   kycDocumentExpiryDate: Boolean
});

export const GtKycTypeConstant = mongoose.model('GtKycTypeConstant', gtKycTypeConstantSchema);

