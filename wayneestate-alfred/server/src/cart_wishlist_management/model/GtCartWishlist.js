import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtCartWishlistSchema = new Schema({
    boDetail: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtBoDetail',autopopulate:false, index: true},
    cwWishlistItems:
    [{
        _id: false,
        sku: {type: mongoose.SchemaTypes.ObjectId, ref:'GtSku',autopopulate:false, index: true},
    }],
    cwCartItems:
    [{
        _id: false,
        sku:{type:mongoose.SchemaTypes.ObjectId, ref:'GtSku',autopopulate:false, index: true},
        quantity: Number,
        
    }],
    cwNotifyMeItems:
    [{
        _id: false, 
        sku:{type:mongoose.SchemaTypes.ObjectId, ref:'GtSku',autopopulate:false, index: true},
        quantity: Number,

    }],
    cwCreatedDate: Date,
    cwLastUpdateDate: Date

},{
    timestamps: {
      createdAt: 'cwCreatedDate', // Use `created_at` to store the created date
      updatedAt: 'cwLastUpdateDate' // Use `updated_at` to store the last updated date
    }
});


gtCartWishlistSchema.plugin(require('mongoose-autopopulate'));



export const GtCartWishlist = mongoose.model('GtCartWishlist', gtCartWishlistSchema);

