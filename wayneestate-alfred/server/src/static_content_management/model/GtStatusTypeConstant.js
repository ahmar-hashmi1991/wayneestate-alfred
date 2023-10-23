import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtStatusTypeConstantSchema = new Schema({
   statusType: {type: String, },
   statusCode: {type: String, },
   statusName: {type: String, },
   statusDescription: {type: String, },
   
});

export const GtStatusTypeConstant = mongoose.model('GtStatusTypeConstant', gtStatusTypeConstantSchema);

