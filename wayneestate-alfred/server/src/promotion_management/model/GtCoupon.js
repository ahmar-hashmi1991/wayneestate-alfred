import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtCouponSchema = new Schema({
     
    couponCode: {type: String, index: true, unique: true},
    couponTitle: String,
    couponDescription: String,
    couponImage: String,
    couponAmount: Number,
    couponBoDetail:
    [{
        _id: false,
        isBoCoupon: Boolean,
        boDetail: {type:mongoose.SchemaTypes.ObjectId, ref:'GtBoDetail', autopopulate:false, index: true}
    }],
    couponType: {type:mongoose.SchemaTypes.ObjectId, ref: 'GtCouponTypeConstant', autopopulate:false, index: true},
    couponMinOrderValue: Number,
    couponMaxDiscountAmount: Number,
    couponMaxUsageOverall: Number,
    couponMaxUsagePerUser: Number,
    // couponGroupAssociation:
    // [{
    //     _id: false,
    //     gaConstantCode: String,
    //     // tag:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtTagTypeConstant',autopopulate:false, index: true}],
    //     // product:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtProduct',autopopulate:false, index: true}],
    //     // productGroup:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtProductGroup',autopopulate:false, index: true}],
    //     // subSubCategory:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtSubSubCategory',autopopulate:false, index: true}],
    //     // subCategory:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtSubCategory',autopopulate:false, index: true}],
    //     // category:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtCategory', autopopulate:false, index: true}],
    //     sku:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtSku',autopopulate:false, index: true}],
    // }],
    couponTermsAndConditions: String,
    couponIsActive: {type: Boolean, index: true},
    couponStartDate: Date,
    couponEndDate: {type: Date, index: true},
    
},{
    timestamps: {
      createdAt: 'couponCreatedDate', // Use `couponCreatedDate` to store the created date
      updatedAt: 'couponLastUpdateDate' // and `couponLastUpdateDate` to store the last updated date
    }
  });

gtCouponSchema.plugin(require('mongoose-autopopulate'));

export const GtCoupon = mongoose.model('GtCoupon', gtCouponSchema);

