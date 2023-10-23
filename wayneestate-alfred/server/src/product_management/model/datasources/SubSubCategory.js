
import { GtSubSubCategory } from '../GtSubSubCategory';
import { GtSubCategory } from '../GtSubCategory';
import { couponTypeDiscountCategory, couponTypePercentageCode, notNullAndUndefinedCheck } from '../../../utility';
import { GtCouponTypeConstant } from '../../../static_content_management/model/GtCouponTypeConstant';
import { GtSku } from '../GtSku';


export class SubSubCategory {

    async getSubSubCategoryById(_id, offset, limit) {

        let currDate = Date.now();
        let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});

        let foundSubSubCategory;
        let finalSkus;


         
        foundSubSubCategory = await GtSubSubCategory.findOne({_id}).populate({
            path: 'productGroup',
            select: ['productGroupName', 'productGroupDisplayName', 'product'],
            match: {productGroupIsActive: true},
            populate: {
                path: 'product',                 
                select: ['sku', 'productName'],
                // populate: {
                //     path: 'sku',                        
                //     populate: ({
                //         path: 'tag',
                //         select: ['_id'],
                //         populate: ({
                //             path: 'coupon',
                //             match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                //             options: {sort: {couponAmount: -1}},
                //             populate: ({
                //                 path: 'couponType',
                //                 select: 'couponTypeCode'
                //                      })
                //                  })
                //              }),
                //              match: {'skuIsActive': true}
                //             },
                   
                }
                });
                
            let skuIds = []
            foundSubSubCategory.productGroup.forEach(pg =>{                           
                pg.product.forEach(product => {                    
                skuIds.push(...product.sku);                                            
            })
        })
        

        //When frontend sends a request with offset and limit we send a response with pagination.
        if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){                               
                    finalSkus = await GtSku.find({_id: {$in:[...skuIds]}, skuIsActive: true}).skip(offset).limit(limit).populate({                        
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
    
        async getAllSubSubCategories() {

            let currDate = Date.now();
            let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});

            
            let foundSubSubCategories = await GtSubSubCategory.find().populate({
                    path: 'productGroup',
                    select: ['productGroupName', 'productGroupDisplayName', 'product'],
                    match: {productGroupIsActive: true},
                    populate: {
                        path: 'product',
                        select: ['sku', 'productName'],
                        populate: {
                            path: 'sku',
                            populate: ({
                                path: 'tag',
                                populate: ({
                                    path: 'coupon',                                
                                match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                                options: {sort: {couponAmount: -1}}
                            })
                        })
                        },
                        match: {'skuIsActive': true}
                    }
            });

            return foundSubSubCategories;
        }

        async getSubSubCatForSubCat(subCat){
            let foundSubSubCategories = await GtSubSubCategory.find({subCat})
            return foundSubSubCategories;
        }

        async getSubSubCategoryCount() {
            return GtSubSubCategory.find().count();
        }

        async getAllSubSubCatForAllSubCats(){
            let foundSCats = (await GtSubCategory.find({subCategoryIsActive:true}));
            // console.log(getCurrentLocalTime(), "scat IDS =>>",foundSCats);

            let foundSSCats = await Promise.all((foundSCats.map(async scat => {
                let arrayOfSSCats = await GtSubSubCategory.find({subCategory: {$elemMatch: {$eq: scat}}});
                // console.log(getCurrentLocalTime(), "arrayOfSSCats >> ", arrayOfSSCats);
                return {
                    subSubCategory: arrayOfSSCats,
                    subCat: scat
                    }
                }
            )));

            // console.log(getCurrentLocalTime(), "foundSSCats for given scats >> ", foundSSCats);

            return foundSSCats;
        }

        async createSubSubCategory({input}){
        let newGtSubSubCategory = new GtSubSubCategory({...input});
        try{
            await newGtSubSubCategory.save();
            return {
                success: true,
                message: "SubSubCategory is created successfully.",
                subSubCategory: newGtSubSubCategory
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                subSubCategory: null
              }
        }
    }


    async updateSubSubCategory({_id, input}){
        try{
            let updatedSubSubCategory = await GtSubSubCategory.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"SubSubCategory updated successfully",
                subSubCategory: updatedSubSubCategory
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                subSubCategory: null
            }
        }
    }
}

