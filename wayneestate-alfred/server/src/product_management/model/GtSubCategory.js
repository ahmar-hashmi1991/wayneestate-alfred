import  { getCurrentLocalTime } from '../../utility';
import mongoose from "mongoose";
import { GtCategory } from "./GtCategory";

const Schema = mongoose.Schema;

const gtSubCategorySchema = new Schema({
    
    subCategoryName: String, 
    subCategoryDisplayName: String,
    subCategoryDescription: String,
    category: [{type: mongoose.SchemaTypes.ObjectId, ref:'GtCategory',autopopulate:false, index: true}],
    subSubCategory: [{type: mongoose.SchemaTypes.ObjectId, ref:'GtSubSubCategory',autopopulate:false, index: true}],
    subCategoryImages: [String],
    subCategoryVideos: [String],
    subCategoryFlashSaleDiscountPercentage: Number,
    nonServiceablePincode: [{type: mongoose.SchemaTypes.ObjectId, ref:'GtPincode',autopopulate:false, index: true}],
    subCategoryIsActive: Boolean,
    subCategoryLastUpdateBy: String,    

},{
    timestamps: {
      createdAt: 'subCategoryCreatedDate', // Use `subCategoryCreatedDate` to store the created date
      updatedAt: 'subCategoryLastUpdateDate' // and `subCategoryLastUpdateDate` to store the last updated date
    }
});


gtSubCategorySchema.post('save', async function(doc, next) {
    // console.log(getCurrentLocalTime(), 'docID >> ', doc._id);
    
    try{
            console.log(getCurrentLocalTime(), "doc >> ", doc.category);
            for(let i=0; i<(doc.category.length); i++)
            {
                let catScats = await GtCategory.findById({_id: doc.category[i]}, {subCategory: 1});
                //console.log(getCurrentLocalTime(), "catScatss >> ", catScats); 
                console.log(getCurrentLocalTime(), await GtCategory.updateOne({_id: doc.category[i]._id}, {$set: {subCategory:  [...catScats.subCategory, doc._id]}}));
            }
    }
    catch(error)
    {
        console.error(getCurrentLocalTime(), ": ", "failed at creating back link to Products from SKU >> ", error.message);
    }
    next();
  });

// gtSubCategorySchema.post('insertMany', async function (docs) {
//     try {
//         const multipCatUpd = await Promise.all(docs.map(async doc =>{
//             const cats = doc.Category;
//             await Promise.all(cats.map( async cat => {
//               const res = await GtCategory.updateOne({_id: cat}, {$addToSet: { subCategory: doc._id}});
//             }));
//         }));
//         return true;
//     } catch (error) {
//         return false;        
//     }
// });

gtSubCategorySchema.plugin(require('mongoose-autopopulate'));

export const GtSubCategory = mongoose.model('GtSubCategory', gtSubCategorySchema);

