import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtStateSchema = new Schema({
    country: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'GtCountry',
        required: true,
        autopopulate: false
    },
    stateName: {type: String, required: true, index: true},
    stateGSTCode: {type: String, required: true},
    stateISO2Code: {type: String, required: true},
    stateCapitalCity: {type: String, required: true},
    statePrimaryLanguage: String,
    stateIsUT: {type: Boolean, required: true},
    stateIsServiceable: {type: Boolean, required: true}
});

gtStateSchema.plugin(require('mongoose-autopopulate'));

export const GtState = mongoose.model('GtState', gtStateSchema);

