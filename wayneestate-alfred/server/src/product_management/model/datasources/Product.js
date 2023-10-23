import  { getCurrentLocalTime } from '../../../utility';
import { GtProduct } from '../GtProduct';

export class Product {

  async getProductById(_id) {
    let foundProduct = await GtProduct.findOne({_id});
    return foundProduct;
    }

    async getAllProducts() {
        let foundProducts = await GtProduct.find()
        return foundProducts;
    }
    
    async getProductCount() {
        return GtProduct.find().count();
    }
    
    async updateProduct({_id, input}){
        try{
            let updatedProduct = await GtProduct.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"Product updated successfully",
                product: updatedProduct
            };
        }catch (error){
            return {
                success: false,
                message: error.extensions.response.status,
                product: null
            }
        }
    }

    async updateMultipleProduct(input){
        
        try{
            await Promise.all(input.map(async product => {
                let updateProduct = await GtProduct.updateOne({_id: product._id},{$set: {...product}});
                // console.log(getCurrentLocalTime(), "Update is successfull >> ", updatedSku);
            }));
           
            return{
                success: true,
                message:"Products updated successfully",
            };
        }catch (error){
            console.log(getCurrentLocalTime(), error);
            return {
                success: false,
                message: error.message,
            }
        }
    }

    async createProduct({input})
    {
        let newGtProduct = new GtProduct({...input});
        try{
            await newGtProduct.save();
            return {
                
                success: true,
                message: "Product is created successfully.",
                product: newGtProduct
            };
        }
        catch (error){
            return {
                success: false,
                message: error?.message,
                product: null
            }
        }
    }

    async createMultipleProduct({input}){
        try{
            let response = await GtProduct.insertMany([...input]);
            // console.log(getCurrentLocalTime(), "response for createMultipleProduct >> ", response);
            return{
                success: true,
                message:"Products created successfully",
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

