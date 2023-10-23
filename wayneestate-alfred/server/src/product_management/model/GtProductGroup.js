import  { getCurrentLocalTime } from '../../utility';
import mongoose from "mongoose";
import { GtSubSubCategory } from "./GtSubSubCategory";

const Schema = mongoose.Schema;

const gtProductGroupSchema = new Schema({
    
    productGroupName: String, 
    productGroupDisplayName: String,
    productGroupDescription: String,
    subSubCategory: [{type: mongoose.SchemaTypes.ObjectId, ref:'GtSubSubCategory',autopopulate:false, index: true}],
    product: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtProduct',autopopulate:false, index: true}],
    productGroupImages: [String],
    productGroupVideos: [String],
    productGroupFlashSaleDiscountPercentage: Number,
    nonServiceablePincode: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtPincode', autopopulate:false, index: true}],
    productGroupIsActive: Boolean,
    productGroupLastUpdateBy: String,
     
},{
    timestamps: {
      createdAt: 'productGroupCreatedDate', // Use `productGroupCreatedDate` to store the created date
      updatedAt: 'productGroupLastUpdateDate' // and `productGroupLastUpdateDate` to store the last updated date
    }
  });

gtProductGroupSchema.post('save', async function(doc, next) {
    // console.log(getCurrentLocalTime(), 'docID >> ', doc._id);
    
    try{
            console.log(getCurrentLocalTime(), "doc >> ", doc.subSubCategory);
            for(let i=0; i<(doc.subSubCategory.length); i++)
            {
                let sscatPGs = await GtSubSubCategory.findById({_id: doc.subSubCategory[i]}, {productGroup: 1});
                //console.log(getCurrentLocalTime(), "sscatPGss >> ", sscatPGs); 
                console.log(getCurrentLocalTime(), await GtSubSubCategory.updateOne({_id: doc.subSubCategory[i]._id}, {$set: {productGroup:  [...sscatPGs.productGroup, doc._id]}}));
            }
    }
    catch(error)
    {
        console.error(getCurrentLocalTime(), ": ", "failed at creating back link to Products from SKU >> ", error.message);
    }
    next();
  });

gtProductGroupSchema.post('insertMany', async function (docs, next) {
    try {
        const multipSubSubCatUpd = await Promise.all(docs.map(async doc =>{
            const subSubCats = doc.subSubCategory;
            await Promise.all(subSubCats.map( async subSubCat => {
              const res = await GtSubSubCategory.updateOne({_id: subSubCat}, {$addToSet: { productGroup: doc._id}});
            }));
        }));
    } catch (error) {
      console.error(getCurrentLocalTime(), ": ", "failed at creating back link to SubSubCats from PGs for bulk create >> ", error.message);
    }
    next();
});


gtProductGroupSchema.plugin(require('mongoose-autopopulate'));
export const GtProductGroup = mongoose.model('GtProductGroup', gtProductGroupSchema);

