import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtGroupAssociationConstantSchema = new Schema({
   gaConstantCode: {type: String, },
   gaConstantName: {type: String, },
   gaConstantDomainType: {type: String, },
   gaConstantDescription: {type: String, },

});

export const GtGroupAssociationConstant = mongoose.model('GtGroupAssociationConstant', gtGroupAssociationConstantSchema);

