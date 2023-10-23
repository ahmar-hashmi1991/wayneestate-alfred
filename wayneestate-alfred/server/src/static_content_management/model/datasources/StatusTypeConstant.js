import { GtStatusTypeConstant } from '../GtStatusTypeConstant';

export class StatusTypeConstant {

    async getAllStatusTypeConstant() {
        let getAllStatusType = await GtStatusTypeConstant.find();
        return getAllStatusType;
    }

    async createStatusTypeConstant({input}){
        try{
            let newStatusTypeConstant = new GtStatusTypeConstant({...input});
         
            await newStatusTypeConstant.save();
            return {
                
                success: true,
                message: "Status type constant is created successfully.",
                statusTypeConstant: newStatusTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                statusTypeConstant: null
              }
        }
    }


    async updateStatusTypeConstant({_id, input}){
        try{
            let updatedStatusTypeConstant = await GtStatusTypeConstant.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"StatusTypeConstant updated successfully",
                statusTypeConstant: updatedStatusTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                statusTypeConstant: null
            }
        }
    }
}

