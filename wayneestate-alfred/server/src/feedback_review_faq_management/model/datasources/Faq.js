
import { GtFaq } from '../GtFaq';

export class Faq {

   async getFaqById(_id) {
    let foundFaq = await GtFaq.findOne({_id})
        return foundFaq;
    }

    async getAllFaqs() {
        let foundFaqs = await GtFaq.find();
        return foundFaqs;
    }

    async updateFaq({_id, input}){
        try{
            let updatedFaq = await GtFaq.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"Faq updated successfully",
                faq: updatedFaq
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                faq: null
            }
        }
    }


    async createFaq({input}){
        try{
            let newFaq = new GtFaq({...input});
         
            await newFaq.save();
            return {
                
                success: true,
                message: "Faq is created successfully.",
                faq: newFaq
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                faq: null
              }
        }
    }
}

