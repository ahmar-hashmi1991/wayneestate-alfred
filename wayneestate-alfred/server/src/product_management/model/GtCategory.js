import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtCategorySchema = new Schema({
    
    categoryName: String, 
    categoryCode: String,
    categoryDisplayName: String,
    categoryDescription: String,
    categoryImages: [String],
    categoryVideos: [String],   
    categoryFlashSaleDiscountPercentage: Number,
    subCategory: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtSubCategory',required: true, autopopulate:false, index: true}],
    nonServiceablePincode: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtPincode',required: true, autopopulate:false, index: true}],
    categoryIsActive: Boolean,
    categoryLastUpdateBy: String,     
    },{
        timestamps: {
        createdAt: 'categoryCreatedDate', // Use `categoryCreatedDate` to store the created date
        updatedAt: 'categoryLastUpdateDate' // and `categoryLastUpdateDate` to store the last updated date
        }
    });

gtCategorySchema.plugin(require('mongoose-autopopulate'));

export const GtCategory = mongoose.model('GtCategory', gtCategorySchema);

