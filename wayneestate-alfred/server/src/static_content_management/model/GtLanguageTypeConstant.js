import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtLanguageTypeConstantSchema = new Schema({
   languageCode: {type: String, },
   languageName: {type: String, },
    
});

export const GtLanguageTypeConstant = mongoose.model('GtLanguageTypeConstant', gtLanguageTypeConstantSchema);
