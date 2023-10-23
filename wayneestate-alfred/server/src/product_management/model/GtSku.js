import  { getCurrentLocalTime } from '../../utility';
import mongoose from "mongoose";
import { GtProduct } from "./GtProduct";
import atlasPlugin from "mongoose-atlas-search";
import { GtProductGroup } from "./GtProductGroup";
import { GtSubSubCategory } from "./GtSubSubCategory";
import { GtSubCategory } from "./GtSubCategory";
import { GtCategory } from "./GtCategory";

const Schema = mongoose.Schema;

const gtSkuSchema = new Schema({
    product: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtProduct', autopopulate:false, index: true},  
    skuImages: [String],
    skuName: String,
    skuTotalBought: Number, 
    skuCode: String,
    skuDescriptions: [String],
    skuAttribute: 
    [{
        _id: false,
        key: {type: String, index: true},
        value: String
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
            pincode: {type: mongoose.SchemaTypes.ObjectId, ref:'GtPincode',autopopulate:true, index: true},
            boPrice: Number,
            skuFlashSaleDiscountPercentage: Number
        }],
        boLevelSellingPrice: [{
            _id: false,
            boDetail: {type: mongoose.SchemaTypes.ObjectId, ref:'GtBoDetail', autopopulate: false, index: true},
            boPrice: Number,
            skuFlashSaleDiscountPercentage: Number
        }],
    },
    skuThresholdObject: {
        threshold: Number,
        startTime: String,
        endTime: String,
        startDate: Date,
        endDate: Date
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
    skuIsAreaSpecific: Boolean,
    skuAvailability: {
        _id: false,
        isTypeBlacklist: Boolean,
        pincode: [{type: mongoose.SchemaTypes.ObjectId, ref:'GtPincode',autopopulate:false, index: true}]
    },
    skuIsActive: Boolean,
    tag:{type: mongoose.SchemaTypes.ObjectId, ref: 'GtTagTypeConstant',autopopulate:false, index: true},
    skuReturnDetails: {
        skuIsReturnEligible: Boolean,
        skuReturnWithinDays: Number,
        skuIsExchangeEligible: Boolean,
        skuExchangeWithinDays: Number
        },
    skuLastUpdateBy: String,
},{
    timestamps: {
      createdAt: 'skuCreatedDate', // Use `skuCreatedDate` to store the created date
      updatedAt: 'skuLastUpdateDate' // and `skuLastUpdateDate` to store the last updated date
    }
  });


 gtSkuSchema.post('save', async function (doc, next) {
    //     console.log(getCurrentLocalTime(), 'docID >> ', doc._id);
    
        try {
            let productSku = await GtProduct.findById({ _id: doc.product._id }, { sku: 1 });
            await GtProduct.updateOne({ _id: doc.product._id }, { $set: { sku: [...productSku.sku, doc._id] } });
        }
        catch (error) {
            console.error(getCurrentLocalTime(), ": ", "Failed at creating back link to Products from SKU >> ", error.message);
        }
        // next();
    
    
        try {
    
            let productGroups = await GtProductGroup.find({ product: doc.product });
            console.log(getCurrentLocalTime(), "Start post >> ", productGroups);
            productGroups.forEach(async pg => {
                let subsubCats = await GtSubSubCategory.find({ productGroup: pg });
                subsubCats.forEach(async sscat => {
                    let subCats = await GtSubCategory.find({ subSubCategory: sscat });
                    subCats.forEach(async scat => {
                        let cats = await GtCategory.find({ subCategory: scat });
                        console.log(getCurrentLocalTime(), "cat >> ", cats, "subCat >> ", scat, "sscat >>", sscat, "pg >> ", pg);
                    })
                })
            })
    
            let productSku = await GtProduct.findById({ _id: doc.product._id }, { sku: 1 });
            await GtProduct.updateOne({ _id: doc.product._id }, { $set: { sku: [...productSku.sku, doc._id] } });
        }
        catch (error) {
            console.error(getCurrentLocalTime(), ": ", "failed at creating back link to Products from SKU >> ", error.message);
        }
        next();
    });

gtSkuSchema.post('insertMany', async function (docs, next) {
    try {
        const multipProdUpd = await Promise.all(docs.map(async doc =>{
            const productId = doc.product;
            const res = await GtProduct.updateOne({_id: productId}, {$addToSet: { sku: doc._id}});
        }));
    } catch (error) {
        console.error(getCurrentLocalTime(), ": ", "failed at creating back link to Products from SKU for bulk create >> ", error.message);
    }
    next();
});

gtSkuSchema.plugin(require('mongoose-autopopulate'));

export const GtSku = mongoose.model('GtSku', gtSkuSchema);

atlasPlugin.initialize({
    model: GtSku,
    overwriteFind: true,
    searchKey: 'search',
    // addFields: {
    //   id: '$_id'
    // },
    searchFunction: query => {
      return {
          'index': 'Sku Search',
          'text': {
            'query': `${query}*`,
            'path': ['skuName','skuKeywords'],
              'fuzzy': {
                  'maxEdits': 1
              }
          }
      }
    }
  },
  {
    model: GtSku,
    overwriteFind: true,
    searchKey: 'autocomplete',
    // addFields: {
    //   id: '$_id'
    // },
    searchFunction: query => {
      return {
          'index': 'Sku Search',
          'autocomplete': {
              'query': `${query}*`,
              'path': ['skuName','skuKeywords'],
              'fuzzy': {
                'maxEdits': 1
            }
          }
      }
    }
  });


