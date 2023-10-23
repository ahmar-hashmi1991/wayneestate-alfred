import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtTransaction = new Schema({
        transactionNumber: String, // UTR No
        transactionAmount: Number,
        transactionMode: String, // ENUM - CASH, UPI
        transactionProcessedDate: Date,
    }, {
        timestamps: {
          createdAt: 'transactionInitiatedDate', // Use `created_at` to store the created date
          updatedAt: 'transactionLastUpdateDate' // Use `updated_at` to store the last updated date
        }
    });


// gtTransaction.pre('updateOne', function (next) {
//     this.transactionInitiatedDate =  new Date();
//     next();
//     }
// )


gtTransaction.plugin(require('mongoose-autopopulate'));
export const GtTransaction = mongoose.model('GtTransaction', gtTransaction);
