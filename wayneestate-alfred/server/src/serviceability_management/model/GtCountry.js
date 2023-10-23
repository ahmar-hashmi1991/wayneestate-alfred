import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtCountrySchema = new Schema({
   countryName: { type: String, required: true, index: true },
   countryIsoCode: [{ type: String, required: true }],
   countryDialingCode: [{ type: Number, required: true }],
   countryRegionName: { type: String, required: true },
   countryCapitalCity: { type: String, required: true },
   countryCurrency: String,
   countryCurrencySymbol: String,
   countryPrimaryLanguage: String,
   countryIsServiceable: { type: Boolean, required: true }
});


export const GtCountry = mongoose.model('GtCountry', gtCountrySchema);