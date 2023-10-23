import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtConsumerSchema = new Schema({
    consumerName: {type: String, required: true},
    consumerPhoneNumber: {type: String, unique: true, required: true, index: true},
    consumerBoLinked: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'GtBoDetail',
        required: true,
        autopopulate: false
    }],
    consumerIsAppInstalled: {type: Boolean, required: false},
},{
    timestamps: {
      createdAt: 'consumerCreatedDate', // Use `consumerCreatedDate` to store the created date
      updatedAt: 'consumerUpdatedDate' // and `consumerUpdatedDate` to store the last updated date
    }
});

gtConsumerSchema.plugin(require('mongoose-autopopulate'));


export const GtConsumer = mongoose.model('GtConsumer', gtConsumerSchema);