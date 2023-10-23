import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtReturnReasonTypeConstantSchema = new Schema({
    reasonName: {type: String, },
    reasonDescription: {type: String, }
    
});

export const GtReturnReasonTypeConstant = mongoose.model('GtReturnReasonTypeConstant', gtReturnReasonTypeConstantSchema);