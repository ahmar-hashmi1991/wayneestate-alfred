import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtSearchPreferenceSchema = new Schema({
        boDetail: {type:mongoose.SchemaTypes.ObjectId, ref:'GtBoDetail', autopopulate:false, index: true, unique: true},
        keywords: [String],
        skus: [{
            _id: false,
            frequency: Number,
            sku: {type:mongoose.SchemaTypes.ObjectId, ref:'GtSku', autopopulate:false, index: true},
            skuLastUpdatedAt: Date            
        }],
        lastNSearchedSkus: [{ type:mongoose.SchemaTypes.ObjectId, ref:'GtSku', autopopulate:false, index: true }]
    },{
        timestamps: {
        createdAt: 'searchPreferenceCreatedDate', // Use `searchPreferenceCreatedDate` to store the created date
        updatedAt: 'searchPreferenceLastUpdateDate' // and `searchPreferenceLastUpdateDate` to store the last updated date
        }
    });

gtSearchPreferenceSchema.plugin(require('mongoose-autopopulate'));

export const GtSearchPreference = mongoose.model('GtSearchPreference', gtSearchPreferenceSchema);

