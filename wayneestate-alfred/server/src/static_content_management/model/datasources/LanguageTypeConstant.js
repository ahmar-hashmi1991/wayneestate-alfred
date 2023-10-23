import { GtLanguageTypeConstant } from '../GtLanguageTypeConstant';

export class LanguageTypeConstant {

  async  getAllLanguageTypeConstant() {
      let allLanguageType = await GtLanguageTypeConstant.find();
        return allLanguageType;
    }

    async createLanguageTypeConstant({input}){
        try{
            let newLanguageTypeConstant = new GtLanguageTypeConstant({...input});
         
            await newLanguageTypeConstant.save();
            return {
                
                success: true,
                message: "Language type constant is created successfully.",
                languageTypeConstant: newLanguageTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                languageTypeConstant: null
              }
        }
    }

    async updateLanguageTypeConstant({_id, input}){
        try{
            let updatedLanguageTypeConstant = await GtLanguageTypeConstant.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"LanguageTypeConstant updated successfully",
                languageTypeConstant: updatedLanguageTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                languageTypeConstant: null
            }
        }
    }


}

