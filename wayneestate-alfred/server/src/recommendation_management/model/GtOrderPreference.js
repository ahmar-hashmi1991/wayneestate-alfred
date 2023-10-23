import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtOrderPreferenceSchema = new Schema({
        boDetail: {type:mongoose.SchemaTypes.ObjectId, ref:'GtBoDetail', autopopulate:false, index: true},
        skus: [{ type:mongoose.SchemaTypes.ObjectId, ref:'GtSku', autopopulate:false, index: true }]
        // This will contain all the unique skus that the BO has ordered in the past
    },{
        timestamps: {
            createdAt: 'orderPreferenceCreatedDate', // Use `orderPreferenceCreatedDate` to store the created date
            updatedAt: 'orderPreferenceLastUpdateDate' // and `orderPreferenceLastUpdateDate` to store the last updated date
        }
    });

gtOrderPreferenceSchema.plugin(require('mongoose-autopopulate'));

export const GtOrderPreference = mongoose.model('gtOrderPreference', gtOrderPreferenceSchema);