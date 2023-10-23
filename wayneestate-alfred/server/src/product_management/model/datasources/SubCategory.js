
import { GtCouponTypeConstant } from '../../../static_content_management/model/GtCouponTypeConstant';
import { couponTypeDiscountCategory, couponTypePercentageCode, notNullAndUndefinedCheck } from '../../../utility';
import { GtSubCategory } from '../GtSubCategory';
import { GtSku } from '../GtSku';

export class SubCategory {

    async getSubCategoryById(_id,offset,limit) {

        let currDate = Date.now();
        let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});
        let foundSubCategory; 
        let finalSkus;

                foundSubCategory = await GtSubCategory.findOne({_id}).populate({
                    path: 'subSubCategory',
                    populate: {
                        path: 'productGroup',                     
                        populate: {
                            path: 'product',
                            select: ['sku', 'productName'],
                        //     populate: ({
                        //         path: 'sku',
                        //         select: ['_id'],
                        //         populate: ({
                        //             path: 'tag',
                        //             populate: ({
                        //                 path: 'coupon',
                        //                 match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                        //                 options: {sort: {couponAmount: -1}},
                        //                 populate: ({
                        //                     path: 'couponType',
                        //                     select: 'couponTypeCode'
                        //                 })
                        //             })
                        //         }),                                
                        //     match: {'skuIsActive': true}
                        //     })
                        },
                    },
                });
                
               
                
        let skuIds = []
        foundSubCategory.subSubCategory.forEach(sscat=>{
                        sscat.productGroup.forEach(pg =>{                           
                                    pg.product.forEach(product => {                              
                                    skuIds.push(...product.sku);                                             
                                })
                            })
                         })

                         
    //When frontend sends a request with offset and limit we send a response with pagination.
    if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){                               
                finalSkus = await GtSku.find({_id: {$in:[...skuIds]},skuIsActive: true}).skip(offset).limit(limit).populate({                        
                    path: 'tag',                                
                    populate: ({
                        path: 'coupon',
                        match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                        options: {sort: {couponAmount: -1}},
                        populate: ({
                            path: 'couponType',
                            select: 'couponTypeCode'
                                })
                            }) 
                         })
                    } else {
                        finalSkus = await GtSku.find({_id: {$in:[...skuIds]},skuIsActive: true}).populate({                        
                            path: 'tag',                                               
                            populate: ({
                                path: 'coupon',
                                match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                                options: {sort: {couponAmount: -1}},
                                populate: ({
                                    path: 'couponType',
                                    select: 'couponTypeCode'
                                        })
                                    }) 
                          })
                }

            
                return finalSkus;    
    
    
    }
    
        async getAllSubCategories() {

            let currDate = Date.now();
            let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});

            let foundSubCategories = await GtSubCategory.find().populate({
                    path: 'subSubCategory',
                    select: ['subSubCategoryName','subSubCategoryDisplayName','subSubCategoryImages','subSubCategoryIsActive','productGroup'],
                    match: {subSubCategoryIsActive: true},
                    // populate: {
                    //     path: 'productGroup',
                    //     select: ['productGroupName', 'productGroupDisplayName', 'product'],
                    //     match: {productGroupIsActive: true},
                    //     populate: {
                    //         path: 'product',
                    //         select: ['sku', 'productName'],
                    //         populate: {
                    //             path: 'sku',
                    //             populate: ({
                    //                 path: 'skuPrice.coupon',
                    //                 select: ['couponAmount', 'couponCode', 'couponMinOrderValue'],
                    //                 match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                    //                 options: {sort: {couponAmount: -1}}
                    //             })
                    //         }
                    //     }
                    // }
                });

            return foundSubCategories;
        }

        async getSubCategoryCount() {
            return GtSubCategory.find().count();
        }
    

    async createSubCategory({input}){
        let newGtSubCategory = new GtSubCategory({...input});
        try{
            await newGtSubCategory.save();
            return {
                
                success: true,
                message: "SubCategory is created successfully.",
                subCategory: newGtSubCategory
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                subCategory: null
              }
        }
    }


    async updateSubCategory({_id, input}){
        try{
            let updatedSubCategory = await GtSubCategory.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"SubCategory updated successfully",
                subCategory: updatedSubCategory
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                subCategory: null
            }
        }
    }
}

