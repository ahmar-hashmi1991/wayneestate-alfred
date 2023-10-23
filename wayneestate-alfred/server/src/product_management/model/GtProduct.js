import mongoose from "mongoose";
import { GtProductGroup } from "./GtProductGroup";
import { getCurrentLocalTime } from "../../utility";

const Schema = mongoose.Schema;

const gtProductSchema = new Schema({
    
    productName: String, 
    productShortDescription: String,
    productLongDescription: String,
    productBrand: String,
    productCompany: String,
    productRank: Number,
    productAttributes: [
        {
            _id: false,
            key: String,
            value: [String]
        }
    ],
    productHsnCode: String,
    productFlashSaleDiscountPercentage: Number,
    nonServiceablePincode: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtPincode',autopopulate:false, index: true}],
    productDisplayName: String,
    productGroup: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtProductGroup',autopopulate:false, index: true}],
    sku: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtSku',autopopulate:false, index: true}],
    productModel: String,
    productIsReturnEligible: Boolean,
    productReturnWithinDays: Number,
    productIsExchangeEligible: Boolean,
    productExchangeWithinDays: Number,
    productIsActive: Boolean,
    productKeywords: [String],
    productImage: String,
    productVideos: [String],
    productAverageRating: Number,
    productLastUpdateBy: String,
    productCountryOrigin: String,
    productBatchGroupCode: String,
    productShelfLifeinDays: Number,
    productExpirable: Boolean

},{
    timestamps: {
      createdAt: 'productCreatedDate', // Use `productCreatedDate` to store the created date
      updatedAt: 'productLastUpdateDate' // and `productLastUpdateDate` to store the last updated date
    }
  });

gtProductSchema.post('save', async function(doc, next) {
    // console.log(getCurrentLocalTime(), 'docID >> ', doc._id);
    
    try{
            console.log(getCurrentLocalTime(), "doc >> ", doc.productGroup);
            for(let i=0; i<(doc.productGroup.length); i++)
            {
                let pgProduct = await GtProductGroup.findById({_id: doc.productGroup[i]}, {product: 1});
                //console.log(getCurrentLocalTime(), "pgProducts >> ", pgProduct); 
                console.log(getCurrentLocalTime(), await GtProductGroup.updateOne({_id: doc.productGroup[i]._id}, {$set: {product:  [...pgProduct.product, doc._id]}}));
            }
    }
    catch(error)
    {
        console.error(getCurrentLocalTime(), ": ", "failed at creating back link to Products from SKU >> ", error.message);
    }
    next();
  });

gtProductSchema.post('insertMany', async function (docs, next) {
    try {
        const multipProdGroupUpd = await Promise.all(docs.map(async doc =>{
            const productGroups = doc.productGroup;
            await Promise.all(productGroups.map( async productGroup => {
              const res = await GtProductGroup.updateOne({_id: productGroup}, {$addToSet: { product: doc._id}});
            }));
        }));
    } catch (error) {
        console.error(getCurrentLocalTime(), ": ", "failed at creating back link to ProductGroup from Product for bulk create >> ", error.message);
    }
    next();
});

gtProductSchema.plugin(require('mongoose-autopopulate'));

export const GtProduct = mongoose.model('GtProduct', gtProductSchema);

