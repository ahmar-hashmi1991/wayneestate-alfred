
import { GtCouponTypeConstant } from '../GtCouponTypeConstant';

export class CouponTypeConstant {

    async getAllCouponTypeConstant() {
        let allCouponTypeConstant = await GtCouponTypeConstant.find();
        return allCouponTypeConstant
    }

    async createCouponTypeConstant({input}){
        let newGtCouponTypeConstant = new GtCouponTypeConstant({...input});
        try{
            await newGtCouponTypeConstant.save();
            return {
                
                success: true,
                message: "Coupon type constant is created successfully.",
                couponTypeConstant: newGtCouponTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                couponTypeConstant: null
              }
        }
    }


    async updateCouponTypeConstant({_id, input}){
        try{
            let updatedCouponTypeConstant = await GtCouponTypeConstant.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"CouponTypeConstant updated successfully",
                couponTypeConstant: updatedCouponTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                couponTypeConstant: null
            }
        }
    }
}

