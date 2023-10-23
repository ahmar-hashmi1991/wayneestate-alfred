import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtBannerSchema = new Schema({
     
    bannerIsActive: {type: Boolean, required: true},
    bannerDescription: {type: String, required: true},
    bannerName: String,
    bannerImage: [String],
    bannerVideo:[String],
    bannerPlaceHolderTags: {type: String, index: true},
    // bannerType:
    // [{
    //     _id: false,
    //     bannerIsReadOnly: Boolean,
    //     tag: {type: mongoose.SchemaTypes.ObjectId,ref: 'GtTagTypeConstant', autopopulate:false, index: true}
    // }]
    sku: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtSku', autopopulate:false, index: true}],
},{
    timestamps: {
      createdAt: 'bannerCreatedDate', // Use `bannerCreatedDate` to store the created date
      updatedAt: 'bannerLastUpdateDate', // Use `bannerLastUpdateDate` to store the created date
    }
  });

gtBannerSchema.plugin(require('mongoose-autopopulate'));

export const GtBanner = mongoose.model('GtBanner', gtBannerSchema);

