import { GtTagTypeConstant } from '../GtTagTypeConstant';
import { COUPON_TAGCODE_HOOK_TAG, notNullAndUndefinedCheck } from '../../../utility'

export class TagTypeConstant {

    async getAllTagTypeConstant(offset,limit) {
           
            //When frontend sends a request with both offset and limit we send a response with pagination.
          if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){
    
            return await GtTagTypeConstant.find().skip(offset).limit(limit)
            .populate('coupon');

          } else {
            //Response without pagination
            return await GtTagTypeConstant.find()
            .populate('coupon');
            
     }
   
   
    }

    async getTagTypeConstantById({_id}) {
        return await GtTagTypeConstant.findById({_id}).populate('coupon').populate('hookTagCoupon');
    }

    async getAllCouponsOfGivenTagTypeAndTagCode(tagType, tagCode) {
        return await GtTagTypeConstant.findOne({ tagType: tagType, tagCode: tagCode }, {coupon: 1});
    }

    async getAllTagIDsWithHookTagCoupons() {
        return await GtTagTypeConstant.find({"hookTagCoupon.0": {$exists : true}, "tagType": COUPON_TAGCODE_HOOK_TAG}, {"_id": 1});
    }

    async createTagTypeConstant({input}){
        try{
            let newTagTypeConstant = new GtTagTypeConstant({...input});
         
            await newTagTypeConstant.save();
            return {
                
                success: true,
                message: "Tag type constant is created successfully.",
                tagTypeConstant: newTagTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
    
                message: error?.message,
                tagTypeConstant: null
              }
        }
    }
    async updateTagTypeConstant({_id, input}){
        try{
            let updatedTagTypeConstant = await GtTagTypeConstant.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"TagTypeConstant updated successfully",
                tagTypeConstant: updatedTagTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                tagTypeConstant: null
            }
        }
    }

    async addCouponsToTag(_id, couponIds) {
        try {
            let resp = null;
            if (couponIds.length === 1) {
                resp = await GtTagTypeConstant.updateOne({_id}, {$addToSet: {coupon: couponIds[0]}});
            } else {
                resp = await GtTagTypeConstant.updateOne({_id}, {$set: {coupon: couponIds}});
            }

            return {
                success: true,
                message: "Coupon addition to given tag successful.",
                tagTypeConstant: resp
            }
        } catch (error) {
            return {
                success: false,
                message: error.extensions.response.status
            }
        }
    }

    async addCouponsToHookTag(_id, couponIds) {
        try {
            let resp = null;
            if (couponIds.length === 1) {
                resp = await GtTagTypeConstant.updateOne({_id}, {$addToSet: {hookTagCoupon: couponIds[0]}});
            } else {
                resp = await GtTagTypeConstant.updateOne({_id}, {$set: {hookTagCoupon: couponIds}});
            }

            return {
                success: true,
                message: "Coupon addition to given hooktag successful.",
                tagTypeConstant: resp
            }
        } catch (error) {
            return {
                success: false,
                message: error.extensions.response.status
            }
        }
    }
}

