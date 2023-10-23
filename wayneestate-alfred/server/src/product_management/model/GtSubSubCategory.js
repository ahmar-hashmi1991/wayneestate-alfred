import  { getCurrentLocalTime } from '../../utility';
import mongoose from "mongoose";
import { GtSubCategory } from "./GtSubCategory";

const Schema = mongoose.Schema;

const gtSubSubCategorySchema = new Schema({
    
    subSubCategoryName: String, 
    subSubCategoryDisplayName: String,
    subSubCategoryDescription: String,
    subCategory: [{type: mongoose.SchemaTypes.ObjectId, ref:'GtSubCategory',autopopulate:false, index: true}],
    productGroup: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtProductGroup',autopopulate:false, index: true}],
    subSubCategoryImages: [String],
    subSubCategoryVideos: [String],
    subSubCategoryFlashSaleDiscountPercentage: Number,
    nonServiceablePincode: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtPincode',autopopulate:false, index: true}],
    subSubCategoryIsActive: Boolean,
    subSubCategoryLastUpdateBy: String,
},{
    timestamps: {
      createdAt: 'subSubCategoryCreatedDate', // Use `subSubCategoryCreatedDate` to store the created date
      updatedAt: 'subSubCategoryLastUpdateDate' // and `subSubCategoryLastUpdateDate` to store the last updated date
    }
});


gtSubSubCategorySchema.post('save', async function(doc, next) {
    // console.log(getCurrentLocalTime(), 'docID >> ', doc._id);
    
    try{
            console.log(getCurrentLocalTime(), "doc >> ", doc.subCategory);
            for(let i=0; i<(doc.subCategory.length); i++)
            {
                let scatSSCats = await GtSubCategory.findById({_id: doc.subCategory[i]}, {subSubCategory: 1});
                //console.log(getCurrentLocalTime(), "scatSSCatss >> ", scatSSCats); 
                console.log(getCurrentLocalTime(), await GtSubCategory.updateOne({_id: doc.subCategory[i]._id}, {$set: {subSubCategory:  [...scatSSCats.subSubCategory, doc._id]}}));
            }
    }
    catch(error)
    {
        console.error(getCurrentLocalTime(), ": ", "failed at creating back link to Products from SKU >> ", error.message);
    }
    next();
  });

// gtSubSubCategorySchema.post('insertMany', async function (docs) {
//     try {
//         const multipSubCatUpd = await Promise.all(docs.map(async doc =>{
//             const subCats = doc.subCategory;
//             await Promise.all(subCats.map( async subCat => {
//               const res = await GtSubCategory.updateOne({_id: subCat}, {$addToSet: { subSubCategory: doc._id}});
//             }));
//         }));
//         return true;
//     } catch (error) {
//         return false;        
//     }
// });

gtSubSubCategorySchema.plugin(require('mongoose-autopopulate'));
export const GtSubSubCategory = mongoose.model('GtSubSubCategory', gtSubSubCategorySchema);

