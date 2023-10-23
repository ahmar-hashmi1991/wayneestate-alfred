
import { GtKycTypeConstant } from '../GtKycTypeConstant';

export class KycTypeConstant {

    async getAllKycTypeConstant() {
        let allKycTypeConstant = await GtKycTypeConstant.find();
        return allKycTypeConstant;
    }

    async createKycTypeConstant({input}){
        try{
            let newKycTypeConstant = new GtKycTypeConstant({...input});
         
            await newKycTypeConstant.save();
            return {
                
                success: true,
                message: "Kyc type constant is created successfully.",
                kycTypeConstant: newKycTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                kycTypeConstant: null
              }
        }
    }

    async updateKycTypeConstant({_id, input}){
        try{
            let updatedKycTypeConstant = await GtKycTypeConstant.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"KycTypeConstant updated successfully",
                kycTypeConstant: updatedKycTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                kycTypeConstant: null
            }
        }
    }



}

