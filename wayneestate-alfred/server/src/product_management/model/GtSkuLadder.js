import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtSkuLadderSchema = new Schema({

    // Category Details
    category: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtCategory', autopopulate:false, index: true},  
    categoryName: String, 
    categoryCode: String,
    categoryDisplayName: String,
    categoryDescription: String,
    categoryImages: [String],
    categoryVideos: [String],   
    categoryFlashSaleDiscountPercentage: Number,

    // Sub Category Details
    subCategory: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtSubCategory', autopopulate:false, index: true},  
    subCategoryName: String, 
    subCategoryDisplayName: String,
    subCategoryDescription: String,
    subCategoryImages: [String],
    subCategoryVideos: [String],
    subCategoryFlashSaleDiscountPercentage: Number,

    // Sub Sub Category Details
    subSubCategoryName: String, 
    subSubCategoryDisplayName: String,
    subSubCategoryDescription: String,
    subSubCategoryImages: [String],
    subSubCategoryVideos: [String],
    subSubCategoryFlashSaleDiscountPercentage: Number,
    
    // Product Group Details
    productGroup: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtProductGroup', autopopulate:false, index: true},  
    productGroupName: String,
    productGroupDisplayName: String,
    productGroupImage: [String], 
    product: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtProduct', autopopulate:false, index: true},
    productName: String,
    productBrand: String,
    productCompany: String,
    productRank: Number,
    productDisplayName: String,
    productImage: [String],  
    sku: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtSku', autopopulate:false, index: true},   
    skuImages: [String],
    skuName: String,
    skuTotalBought: Number, 
    skuCode: String,
    skuDescriptions: [String],
    skuAttribute: 
    [{
        _id: false,
        key: {type: String, index: true},
        value: [String]
    }],
    skuPackOf: Number,
    skuInventory: Number,
    skuKeywords: [String],
    skuWeight: Number,
    skuWeightUnit: String,
    skuMinOrder: Number,
    skuEAN: String,
    skuScanIdentifier: String,
    skuPrice:
    {
        _id: false,
        costPrice: Number,
        boPrice: Number,
        msp: Number,
        gstPercent: Number,
        skuFlashSaleDiscountPercentage: Number,
        skuSpecialDiscountPercentage: Number,
        pincodeLevelSellingPrice: [{
            _id: false,
            pincode: {type: mongoose.SchemaTypes.ObjectId, ref:'GtPincode',autopopulate:false, index: true},
            sellingPrice: Number,
        }],
        boLevelSellingPrice: [{
            _id: false,
            boDetail: {type: mongoose.SchemaTypes.ObjectId, ref:'GtBoDetail', autopopulate: false, index: true},
            sellingPrice: Number
        }],
    },
    supplier: [String],
    skuFeature: [String],
    skuBreadth: Number,
    skuHeight: Number,
    skuLength: Number,
    skuDimensionUnit: String,
    packagingBreadth: Number,
    packagingHeight: Number,
    packagingLength: Number,
    packagingDimensionUnit: String,
    packagingWeight: Number,
    packagingWeightUnit: String,
    skuIsActive: Boolean,
    tag:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtTagTypeConstant',autopopulate:false, index: true}],
    skuLastUpdateBy: String,
    },{
    timestamps: {
      createdAt: 'skuCreatedDate', // Use `skuCreatedDate` to store the created date
      updatedAt: 'skuLastUpdateDate' // and `skuLastUpdateDate` to store the last updated date
    }
});


gtSkuLadderSchema.plugin(require('mongoose-autopopulate'));
export const GtSkuLadder = mongoose.model('GtSkuLadder', gtSkuLadderSchema);


