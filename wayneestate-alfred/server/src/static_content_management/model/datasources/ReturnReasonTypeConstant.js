
import { GtReturnReasonTypeConstant } from '../GtReturnReasonTypeConstant';

export class ReturnReasonTypeConstant {

    async getAllReturnReasonTypeConstant() {
        let allReturnReasonTypeConstant = await GtReturnReasonTypeConstant.find();
        return allReturnReasonTypeConstant;
    }

    async getReturnReasonTypeConstantFromId({_id}) {
        return await GtReturnReasonTypeConstant.findById({_id});
    }

    async createReturnReasonTypeConstant({input}){
        let newGtReturnReasonTypeConstant = new GtReturnReasonTypeConstant({...input});
        try{
            await newGtReturnReasonTypeConstant.save();
            return {
                
                success: true,
                message: "Return reason type constant is created successfully.",
                returnReasonTypeConstant: newGtReturnReasonTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                returnReasonTypeConstant: null
              }
        }
    }


    async updateReturnReasonTypeConstant({_id, input}){
        try{
            let updatedReturnReasonTypeConstant = await GtReturnReasonTypeConstant.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"ReturnReasonTypeConstant updated successfully",
                returnReasonTypeConstant: updatedReturnReasonTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                returnReasonTypeConstant: null
            }
        }
    }
}

