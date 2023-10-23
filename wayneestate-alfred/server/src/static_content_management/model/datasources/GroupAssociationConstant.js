import { getCurrentLocalTime } from '../../../utility';
import { GtGroupAssociationConstant } from '../GtGroupAssociationConstant';


export class GroupAssociationConstant {

  async getAllGroupAssociationConstant() {
    let getAllGAConstants = await GtGroupAssociationConstant.find(); 
    console.log(getCurrentLocalTime(), "Group assoc constant requested", getAllGAConstants);    
    return getAllGAConstants;
    }

    async createGroupAssociationConstant({input}){
        try{
            let newGtGroupAssociationConstant = new GtGroupAssociationConstant({...input});
         
            await newGtGroupAssociationConstant.save();
            return {
                
                success: true,
                message: "G A type constant is created successfully.",
                groupAssociationConstant: newGtGroupAssociationConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                groupAssociationConstant: null
              }
        }
    }

    async updateGroupAssociationConstant({_id, input}){
        try{
            let updatedGroupAssociationConstant = await GtGroupAssociationConstant.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"GroupAssociationConstant updated successfully",
                groupAssociationConstant: updatedGroupAssociationConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                groupAssociationConstant: null
            }
        }
    }

}

