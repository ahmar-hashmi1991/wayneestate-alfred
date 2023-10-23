import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gtFaqSchema = new Schema({
    faqs: 
    [{
        _id: false,
        faqIndex: Number,
        faqCategory: String,
        faqQuestion: String,
        faqAnswer: String,
        faqIsActive: Boolean,
        
    }],
});

export const GtFaq = mongoose.model('GtFaq', gtFaqSchema);

