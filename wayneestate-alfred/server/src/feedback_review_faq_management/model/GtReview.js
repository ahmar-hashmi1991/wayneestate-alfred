import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtReviewSchema = new Schema({
    product: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtProduct',autopopulate:false, index: true},
    boDetail: {type: mongoose.SchemaTypes.ObjectId, ref: 'GtBoDetail',autopopulate:false, index: true},
    reviewFullName: String,
    reviewTitle: String,
    review: String,
    reviewImages: [String],
    reviewVideos: [String],
    reviewRating: Number,
    },
    {
        timestamps: {
          createdAt: 'reviewCreatedDate', // Use `created_at` to store the created date
          updatedAt: 'reviewLastUpdateDate' // and `reviewLastUpdateDate` to store the last updated date
        }
    });

gtReviewSchema.plugin(require('mongoose-autopopulate'));
export const GtReview = mongoose.model('GtReview', gtReviewSchema);

