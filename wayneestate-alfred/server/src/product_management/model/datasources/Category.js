
import { GtCategory } from '../GtCategory';

export class Category {

    async  getCategoryById({_id}) {
    let foundCategory = await GtCategory.findOne({_id}).populate({
        path: 'subCategory',
        populate: ({
            path: 'subSubCategory',
            populate: ({
                path: 'productGroup',
                populate: ({
                    path: 'product',
                    populate: ({
                        path: 'sku'
                    })
                })
            })
        })
    })
    return foundCategory;
    }

    async  getAllCategories() {
    let allCategories = await GtCategory.find().populate({
        path: 'subCategory',
        populate: ({
            path: 'subSubCategory',
            populate: ({
                path: 'productGroup',
                populate: ({
                    path: 'product',
                    populate: ({
                        path: 'sku'
                    })
                })
            })
        })
    });
    return allCategories;
    }

    async getCategoryCount() {
        return GtCategory.find().count();
    }

    async createCategory(input){

        let newGtCategory = new GtCategory({...input});

        try{
            await newGtCategory.save();
            return {
                
                success: true,
                message: "Category is created successfully.",
                category: newGtCategory
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                category: null
              }
        }
    }


    async updateCategory(_id, input, userInput){
        let catRes = await GtCategory.findOne({_id})
        userInput.categoryCode = (input.categoryCode) ? (input.categoryCode) : (catRes.categoryCode);
        userInput.name = (input.name) ? (input.name) : (catRes.name);
        
        try{
            let updatedCategory = await GtCategory.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"Category updated successfully",
                category: updatedCategory
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                category: null
            }
        }
    }

}

