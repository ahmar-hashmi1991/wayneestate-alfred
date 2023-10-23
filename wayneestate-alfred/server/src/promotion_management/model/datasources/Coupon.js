import { getCurrentLocalTime } from '../../../utility';
import Mongoose from 'mongoose';
import { notNullAndUndefinedCheck } from '../../../utility'
import { GtSku } from '../../../product_management/model/GtSku';
import { GtCoupon } from '../GtCoupon';

export class Coupon {
    //Removed all populations of coupon group association due to depreciation of that field . to add back use > .populate('couponGroupAssociation.sku')
    async getCouponById(_id) {
        let foundCoupon = await GtCoupon.findOne({_id}).populate('couponType');
        return foundCoupon;
    }

   async getAllCoupons(){
       let currDate = Date.now();
        let allCoupons = await GtCoupon.find({ $and: [{couponIsActive: true} , {couponEndDate: { $gte : currDate}}, {couponStartDate: { $lte : currDate}}]}).populate('couponType');
        return allCoupons;
    }

    async getAllExistingCoupons(offset,limit){
        
          //When frontend sends a request with both offset and limit we send a response with pagination.
          if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){
            
            return await GtCoupon.find().sort({couponCreatedDate: -1}).skip(offset).limit(limit)
            .populate('couponType');

          } else {
            //Response without pagination
            return await GtCoupon.find().sort({couponCreatedDate: -1})
            .populate('couponType');

     }
    
    }

    async getCouponByBoId(_id){
        let foundCoupon = await GtCoupon.findOne({ $and: [{couponIsActive: true} , {couponEndDate: { $gte : currDate}}, {couponBoDetail:{boDetail:_id}}]}).populate('couponType');
        console.log(getCurrentLocalTime(), foundCoupon);
        return foundCoupon;
    }

    async getCouponByCouponCode(couponCode){
        let foundCoupon = await GtCoupon.findOne({couponCode}).populate('couponType');
        return foundCoupon;
    }

    async createCoupon({input}){
        try{
            let newGtCoupon = new GtCoupon({...input});
            await newGtCoupon.save();
            
            //     let couponInsertInSKUPromise;
           
            //    // While creating a coupon >> the coupon IDs also need to persist inside SKUs. 
            //     if(input?.couponGroupAssociation && input?.couponGroupAssociation?.length && input.couponGroupAssociation[0].gaConstantCode === "SKU")
            //     {
            //         let couponSKUs = input.couponGroupAssociation[0].sku;
            //         couponInsertInSKUPromise =  await Promise.all(couponSKUs.map( async skuID => await GtSku.updateOne({_id: skuID}, {$addToSet: {"skuPrice.coupon": newGtCoupon._id}})))        
            //         .then(response => console.log(": couponInsertInSKUPromise  >> ", response))
            //         .catch( error => console.error(": ", error.message));
                    
            //     }

            return {
                success: true,
                message: "Coupon is created successfully.",
                coupon: newGtCoupon
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                coupon: null
              }
        }
    }

    async updateCoupon({_id, input}){
        try{

            // let couponDetails = await GtCoupon.findById({_id});
            // if(input?.couponGroupAssociation && input?.couponGroupAssociation?.length && input.couponGroupAssociation[0].gaConstantCode === "SKU")
            // {
            //     let passedSKUs = input.couponGroupAssociation[0].sku;
            //     // console.log(getCurrentLocalTime(), "passedSKU >> ", passedSKUs);

            //     let storedSKUs = couponDetails.couponGroupAssociation[0].sku.map(objectId => objectId.valueOf());
            //     // console.log(getCurrentLocalTime(), "storedSKU >> ", storedSKUs);
                
            //     if (input?.couponIsActive === true) {
            //         // mark passedSKU as 1(append), commonSKU as 0(no Ops), storedSKU as -1(delete)
            //         let skuMap = this.createSKUMapping(passedSKUs, storedSKUs);
            //         // console.log(getCurrentLocalTime(), "skuMap >> ", skuMap);

            //         for (let skuMapItem in skuMap)
            //         {
            //             // console.log(getCurrentLocalTime(), "print : ", skuMapItem);
            //             // console.log(getCurrentLocalTime(), "print 2 : ", skuMap[skuMapItem]);
            //             // console.log(getCurrentLocalTime(), "print 3 : ", Mongoose.Types.ObjectId(skuMapItem));

            //             if (skuMap[skuMapItem] === 1 || skuMap[skuMapItem] === 0) {
            //                 await GtSku.updateOne({_id: Mongoose.Types.ObjectId(skuMapItem)}, {$addToSet: {"skuPrice.coupon": _id}});
            //             }
            //             else if (skuMap[skuMapItem] === -1) {
            //                 // console.log(getCurrentLocalTime(), "SkuMapItem >> ", skuMapItem);
            //                 await GtSku.updateOne({_id: Mongoose.Types.ObjectId(skuMapItem)}, {$pull: {"skuPrice.coupon": _id}});
            //             }
            //         }
            //     } else {
            //         for (let i=0; i<passedSKUs.length; ++i)
            //         {
            //             await GtSku.updateOne({_id: Mongoose.Types.ObjectId(passedSKUs[i])}, {$pull: {"skuPrice.coupon": _id}});
            //         }

            //         for (let i=0; i<storedSKUs.length; ++i)
            //         {
            //             await GtSku.updateOne({_id: Mongoose.Types.ObjectId(storedSKUs[i])}, {$pull: {"skuPrice.coupon": _id}});
            //         }
            //     }
            // }
            let updatedCoupon = await GtCoupon.updateOne({_id},{$set: {...input}});
            
            return{
                code:200,
                success: true,
                message:"Coupon updated successfully",
                coupon: updatedCoupon
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                coupon: null
            }
        }
    }

    // mark passedSKU as 1(append), commonSKU as 0(no Ops), storedSKU as -1(delete)
    createSKUMapping(passedSKUs, storedSKUs)
    {
        let hashMap = new Object();
        for (let i=0; i<passedSKUs.length; i++)
        {
            hashMap[passedSKUs[i]] = 1;
        }

        for (let j=0; j<storedSKUs.length; j++)
        {
            if (hashMap[storedSKUs[j]])
            {
                hashMap[storedSKUs[j]] = 0;
            }
            else
            {
                hashMap[storedSKUs[j]] = -1;
            }
        }
        return hashMap;
    }

}

