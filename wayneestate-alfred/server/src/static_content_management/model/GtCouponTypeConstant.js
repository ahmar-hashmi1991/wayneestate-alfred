import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtCouponTypeConstantSchema = new Schema({
   couponTypeCategory: {type: String},
   couponTypeCode: {type: String},
   couponTypeName: {type: String},
   couponTypeDescription: {type: String},
   couponTypeIsActive: Boolean    
});

export const GtCouponTypeConstant = mongoose.model('GtCouponTypeConstant', gtCouponTypeConstantSchema);

