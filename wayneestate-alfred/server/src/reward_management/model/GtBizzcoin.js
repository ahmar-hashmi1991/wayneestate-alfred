import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtBizzcoinSchema = new Schema({
    
    bizzcoinAmount: {type: Number, required: true},
    bizzcoinType: {type: String, required: true},
    boDetail: {type:mongoose.SchemaTypes.ObjectId, ref:'GtBoDetail', required: true, index: true},
    orderId: {type:mongoose.SchemaTypes.ObjectId, ref:'GtOrder', required: false, index: true},
    bizzcoinParticulars: {type: String, required: true},
     
},{
    timestamps: {
      createdAt: 'bizzcoinCreatedDate', // Use `bizzcoinCreatedDate` to store the created date
      updatedAt: 'bizzcoinLastUpdateDate', // Use `bizzcoinCreatedDate` to store the created date
    }
});

gtBizzcoinSchema.plugin(require('mongoose-autopopulate'));

export const GtBizzcoin = mongoose.model('GtBizzcoin', gtBizzcoinSchema);

