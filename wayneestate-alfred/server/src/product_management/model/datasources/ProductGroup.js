import  { getCurrentLocalTime } from '../../../utility';
import { GtProductGroup } from '../GtProductGroup';

export class ProductGroup {
    
    async getProductGroupById(_id) {
        let foundProductGroup = await GtProductGroup.findOne({_id});
        return foundProductGroup;
        }
    
        async getAllProductGroups() {
            let foundProductGroups = await GtProductGroup.find()
            return foundProductGroups;
        }

        async getProductGroupCount() {
            return GtProductGroup.find().count();
        }

    async updateProductGroup({_id, input}){
        try{
            let updatedProductGroup = await GtProductGroup.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"ProductGroup updated successfully",
                productGroup: updatedProductGroup
            };
        }catch (error){
            return {                
                success: false,
                message: error.extensions.response.status,
                productGroup: null
            }
        }
    }

    async updateMultiplePGs(input){
        
        try{
            await Promise.all(input.map(async pg => {
                let updatePG = await GtProductGroup.updateOne({_id: pg._id},{$set: {...pg}});
                // console.log(getCurrentLocalTime(), "Update is successfull >> ", updatePG);
            }));
           
            return{
                success: true,
                message:"Product Group updated successfully",
            };
        }catch (error){
            console.log(getCurrentLocalTime(), error);
            return {
                success: false,
                message: error.message,
            }
        }
    }

    async createProductGroup({input}){
       
        try{
             await GtProduct.insertMany(input);
            return {
                
                success: true,
                message: "ProductGroup is created successfully.",
                productGroup: newGtProductGroup
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                productGroup: null
              }
        }
    }

    async createMultiplePGs({input})
    {   
        try{
            let response = await GtProductGroup.insertMany([...input]);
            // console.log(getCurrentLocalTime(), "response for createMultiplePGs >> ", response);

            return{
                success: true,
                message:"Product Groups created successfully",
            };
        }catch (error){
            console.log(getCurrentLocalTime(), error);
            return {
                success: false,
                message: error.message,
            }
        }
    }
}

