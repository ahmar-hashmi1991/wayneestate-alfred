import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtTagTypeConstantSchema = new Schema({
   tagType: String,
   tagCode: {type: String, index: true, unique: true} ,
   tagName: String,
   tagDescription: String, 
   tagColorCode: String,
   tagLastUpdatedBy: Number,
   coupon:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtCoupon',autopopulate:false, index: true}],  
   hookTagCoupon:[{type: mongoose.SchemaTypes.ObjectId, ref: 'GtCoupon',autopopulate:false, index: true}]  
},{
   timestamps: {
     createdAt: 'tagCreatedDate', // Use `tagCreatedDate` to store the created date
     updatedAt: 'tagLastUpdatedDate' // and `tagLastUpdatedDate` to store the last updated date
   }
});

gtTagTypeConstantSchema.pre('save', function (next) {
   this.tagLastUpdatedBy =  -1;
   next();
});



export const GtTagTypeConstant = mongoose.model('GtTagTypeConstant', gtTagTypeConstantSchema);
