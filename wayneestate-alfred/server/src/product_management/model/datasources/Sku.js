import { GtCouponTypeConstant } from '../../../static_content_management/model/GtCouponTypeConstant';
import { couponTypeDiscountCategory, couponTypePercentageCode, getCurrentLocalTime, notNullAndUndefinedCheck } from '../../../utility';
import { GtProduct } from '../GtProduct';
import { GtProductGroup } from '../GtProductGroup';
import { GtSku } from '../GtSku';
import { GtSubSubCategory } from '../GtSubSubCategory';


export class Sku {

        async getSkuById(_id) {

            let currDate = Date.now();
            let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});

             // Active true is still checked, just as a double defence here. Ideally other checks should suffice.
             // let coupon = await GtCoupon.findOne
             // ({ $and: [{_id: couponID}, {couponType: discountCouponTypeID}, {couponIsActive: true}, {couponEndDate: { $gte : currDate}}, {couponStartDate: { $lte : currDate}}]});

            let foundSku = await GtSku.findOne({_id}).populate({
                path: 'product',
                populate: ({
                    path: 'productGroup',
                    populate: ({
                        path: 'subSubCategory',
                        populate: ({
                            path: 'subCategory',
                            populate: ({
                                path: 'category'
                            })
                        })
                    })
                })
            }).populate({
                path: 'tag',
                populate: {
                    path: 'coupon',
                    // select: ['couponAmount', 'couponCode', 'couponMinOrderValue'],
                    match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                    options: {sort: {couponAmount: -1}}
                }
            });

            //console.log(getCurrentLocalTime(), foundSku);

            return foundSku;
        }

        async getSkuCount() {
            return GtSku.find().count();
        }
    
        async getAllSkus(offset, limit) {
            let foundSkus;
           
            //When frontend sends a request with offset and limit we send a response with pagination.
            if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){
            
                 foundSkus = await GtSku.find({}).sort({skuCreatedDate: -1}).skip(offset).limit(limit)
                .populate({
                    path: 'product',
                    select: ['productName','productHsnCode', 'productBrand', 'productCompany'],
                    populate: ({
                        path: 'productGroup',
                        select: 'productGroupName',
                        populate: ({
                            path: 'subSubCategory',
                            select: 'subSubCategoryName',
                            populate: ({
                                path: 'subCategory',
                                select: 'subCategoryName',
                                populate: ({
                                    path: 'category',
                                    select: 'categoryName',
                                })
                            })
                        })
                    })
                });  

            } else {
             //Response without pagination
                foundSkus = await GtSku.find({}).sort({skuCreatedDate: -1})
                .populate({
                    path: 'product',
                    select: ['productName','productHsnCode'],
                    populate: ({
                        path: 'productGroup',
                        select: 'productGroupName',
                        populate: ({
                            path: 'subSubCategory',
                            select: 'subSubCategoryName',
                            populate: ({
                                path: 'subCategory',
                                select: 'subCategoryName',
                                populate: ({
                                    path: 'category',
                                    select: 'categoryName',
                                })
                            })
                        })
                    })
                });
          }

            return foundSkus;
        }

        async getSkuBySkuCode(skuCode) {
            // console.log(getCurrentLocalTime(), "input >> ", skuCode);
            
             // Active true is still checked, just as a double defence here. Ideally other checks should suffice.
             // let coupon = await GtCoupon.findOne
             // ({ $and: [{_id: couponID}, {couponType: discountCouponTypeID}, {couponIsActive: true}, {couponEndDate: { $gte : currDate}}, {couponStartDate: { $lte : currDate}}]});
             let currDate = Date.now();
             let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});
             

            let foundSku = await GtSku.findOne({skuCode: skuCode}).populate({
                path: 'product',
                select: ['productName']
            }).populate({
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

           // console.log(getCurrentLocalTime(), " output : ", foundSku.skuPrice.pincodeLevelSellingPrice);

            return foundSku;
        }

        async getSkuQuantityById(_id) {
           
            let foundSkuQuantity = await GtSku.findOne({_id}, {skuInventory: 1})
            return foundSkuQuantity;
        }

        async getThresholdObject(_id) {
            let sku = await GtSku.findOne({_id});
            let thresholdObj = sku.skuThresholdObject;
            return thresholdObj;
        }

        async getAllSkusByTagID(tagID, offset, limit) {

            let currDate = Date.now();
            let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});
            let foundSkuList;

            //When frontend sends a request with offset and limit we send a response with pagination.
           
                foundSkuList = await GtSku.find({tag: tagID}).skip(offset).limit(limit)
                .populate({
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
                });        
    
            
            return foundSkuList;
        }

        async getAllSkusWithHookTag(offset, limit, tagIDs) {
            let currDate = Date.now();
            let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});

            let foundSkus;
            
            //When frontend sends a request with offset and limit we send a response with pagination.
            if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){                
                foundSkus = await GtSku.find({
                    "tag": {$in: tagIDs}, 
                    "skuInventory": { $gt: 0},
                    "skuIsActive": true
                }).sort({skuCreatedDate: -1}).skip(offset).limit(limit).populate({
                    path: 'skuPrice.pincodeLevelSellingPrice.pincode',
                    select: ['pincode'],
                    match: {pincodeIsActive: true},
                  }).populate({
                    path: 'tag',
                    populate: [{
                        path: 'coupon',
                        select: ['couponAmount', 'couponCode', 'couponMinOrderValue', 'couponMaxDiscountAmount'],
                        match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                        options: {sort: {couponAmount: -1}},
                        populate: ({
                            path: 'couponType',
                            select: 'couponTypeCode'
                        })
                    },
                    {
                        path: 'hookTagCoupon',
                        select: ['couponAmount', 'couponCode', 'couponMinOrderValue', 'couponMaxDiscountAmount'],
                        match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                        options: {sort: {couponAmount: -1}},
                        populate: ({
                            path: 'couponType',
                            select: 'couponTypeCode'
                        })
                    }]
                });
            } else {
                //Response without pagination
                foundSkus = await GtSku.find({
                    "tag": {$in: tagIDs}, 
                    "skuInventory": { $gt: 0},
                    "skuIsActive": true
                    }).sort({skuCreatedDate: -1}).populate({
                    path: 'skuPrice.pincodeLevelSellingPrice.pincode',
                    select: ['pincode'],
                    match: {pincodeIsActive: true},
                  }).populate({
                    path: 'tag',
                    populate: [{
                        path: 'coupon',
                        select: ['couponAmount', 'couponCode', 'couponMinOrderValue', 'couponMaxDiscountAmount'],
                        match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                        options: {sort: {couponAmount: -1}},
                        populate: ({
                            path: 'couponType',
                            select: 'couponTypeCode'
                        })
                    },
                    {
                        path: 'hookTagCoupon',
                        select: ['couponAmount', 'couponCode', 'couponMinOrderValue', 'couponMaxDiscountAmount'],
                        match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                        options: {sort: {couponAmount: -1}},
                        populate: ({
                            path: 'couponType',
                            select: 'couponTypeCode'
                        })
                    }]
                });
            }

            return foundSkus;
        }

        async getSkusForAlfredSkuPage(skuCode,skuName){

            if(skuName)        
                return await GtSku.find({skuName: skuName}).sort({skuCreatedDate: -1})
                .populate({
                    path: 'product',
                    select: ['productName','productHsnCode','productBrand','productExpirable','productShelfLifeinDays'],
                    populate: ({
                        path: 'productGroup',
                        select: 'productGroupName',
                        populate: ({
                            path: 'subSubCategory',
                            select: 'subSubCategoryName',
                            populate: ({
                                path: 'subCategory',
                                select: 'subCategoryName',
                                populate: ({
                                    path: 'category',
                                    select: 'categoryName',
                                })
                            })
                        })
                    })
                });  
            

        if(skuCode)
            return await GtSku.find({skuCode: skuCode}).sort({skuCreatedDate: -1})
            .populate({
                path: 'product',
                select: ['productName','productHsnCode','productBrand','productExpirable','productShelfLifeinDays'],
                populate: ({
                    path: 'productGroup',
                    select: 'productGroupName',
                    populate: ({
                        path: 'subSubCategory',
                        select: 'subSubCategoryName',
                        populate: ({
                            path: 'subCategory',
                            select: 'subCategoryName',
                            populate: ({
                                path: 'category',
                                select: 'categoryName',
                            })
                        })
                    })
                })
            });  

        
            return await GtSku.find({}).sort({skuLastUpdateDate: -1}).limit(50)
            .populate({
                path: 'product',
                select: ['productName','productHsnCode','productBrand','productExpirable','productShelfLifeinDays'],
                populate: ({
                    path: 'productGroup',
                    select: 'productGroupName',
                    populate: ({
                        path: 'subSubCategory',
                        select: 'subSubCategoryName',
                        populate: ({
                            path: 'subCategory',
                            select: 'subCategoryName',
                            populate: ({
                                path: 'category',
                                select: 'categoryName',
                            })
                        })
                    })
                })
            });  

        }

        async getAllSkuCodes() {
            let foundSkus = await GtSku.find({},{skuCode: 1})
            let value = foundSkus.map(sku => sku.skuCode);
            //console.log(getCurrentLocalTime(), "Value = ", value);
            return value;
        }

        async getAllActiveSkuCodes() {
            let foundSkus = await GtSku.find({skuIsActive: true},{skuCode: 1})
            let value = foundSkus.map(sku => sku.skuCode);
            //console.log(getCurrentLocalTime(), "Value = ", value);
            return value;
        }

        
    async updateTagInSku(input) {
        try{
            let updatedSku = await GtSku.updateOne({skuCode: input.skuCode}, { tag: input.tag });

            return{
                success: true,
                messageFromGotham:"Sku updated successfully",
            };
        }catch (error){
            return {
                
                success: false,
                messageFromGotham: error.message,
                sku: null
            }
        }
    }

    async updateMultipleSKUsWithCentralOfferPrice(input) {
        try{
            let resp = await Promise.all(input.map( async sku => {
                /*
                boPrice - FSD/100 * boPrice = COP

                boPrice(1 - FSD/100) = COP

                1 - FSD/100 = COP / boPrice

                FSD/100 = 1 - COP / boPrice

                FSD = 100(1 - COP / boPrice)
                */

                let skuRes = await GtSku.findOne({skuCode: sku.skuCode});
                await GtSku.updateOne({ skuCode: sku.skuCode }, 
                    {$set: {"skuPrice.skuFlashSaleDiscountPercentage": 
                     100 * (1 - (sku.skuCentralOfferPrice / skuRes.skuPrice.boPrice)) }})

                     console.log(resp);

                console.log(getCurrentLocalTime(), "Update SKU Flash Sale Discount Percentage is successfull for skuCode>>", sku.skuCode, "to central offer price - ", sku.skuCentralOfferPrice);
            }));
            return {
                success: true,
                messageFromGotham:"Sku updated successfully",
            };
        } catch (error)
        {
            return {
            success: false,
            messageFromGotham: error?.message,
            sku: null
            }
        }        
    }

    async updateSku(input){
        
        // console.log(getCurrentLocalTime(), "input at updateSKU >> ", input);
        let skuRes = await GtSku.findOne({skuCode: input.skuCode});
        let productRes = await GtProduct.findOne({_id:skuRes?.product});
       
        // console.log(getCurrentLocalTime(), "productHsnCode >>", input.productHsnCode);
        // console.log(getCurrentLocalTime(), "Hello product ID >>", productRes);
        // console.log(getCurrentLocalTime(), "Hello input ID >>", input.skuPrice.msp); 

        if( input.productHsnCode || input.productShelfLifeinDays || input.productExpirable || input.productBrand )
        {
            let productInput = {
                productHsnCode: (input['productHsnCode']) ? input['productHsnCode'] : productRes?.productHsnCode,
                productShelfLifeinDays: (input['productShelfLifeinDays']) ? (input['productShelfLifeinDays']) : productRes?.productShelfLifeinDays,
                productExpirable: (input['productExpirable']) ? (input['productExpirable']) : productRes?.productExpirable ,
                productBrand: (input['productBrand']) ? (input['productBrand']) : productRes?.productBrand
            }
            await GtProduct.updateOne({_id: skuRes.product}, {$set: {...productInput}});
        }

        if( input.skuPrice?.costPrice || input.skuPrice?.boPrice || input.skuPrice?.msp || input.skuPrice?.gstPercent || input.skuPrice?.skuFlashSaleDiscountPercentage)
        {
            input.skuPrice.costPrice = (input.skuPrice?.costPrice) ? input.skuPrice?.costPrice : skuRes.skuPrice.costPrice;
            input.skuPrice.boPrice = (input.skuPrice?.boPrice) ? input.skuPrice?.boPrice : skuRes.skuPrice.boPrice;
            input.skuPrice.msp = (input.skuPrice?.msp) ? input.skuPrice?.msp : skuRes.skuPrice.msp;
            input.skuPrice.gstPercent = (input.skuPrice?.gstPercent) ? input.skuPrice?.gstPercent : skuRes.skuPrice.gstPercent;
            input.skuPrice.skuFlashSaleDiscountPercentage = (input.skuPrice?.skuFlashSaleDiscountPercentage) ? input.skuPrice?.skuFlashSaleDiscountPercentage : skuRes.skuPrice.skuFlashSaleDiscountPercentage;
        }

        if (input.skuPrice?.boLevelSellingPrice) {
            input.skuPrice.boLevelSellingPrice = notNullAndUndefinedCheck(input.skuPrice?.boLevelSellingPrice) ? input.skuPrice?.boLevelSellingPrice : null;
        }

        if (input.skuPrice?.pincodeLevelSellingPrice) {
            input.skuPrice.pincodeLevelSellingPrice = notNullAndUndefinedCheck(input.skuPrice?.pincodeLevelSellingPrice) ? input.skuPrice?.pincodeLevelSellingPrice : null;
        }

        if (input.skuPrice?.skuSpecialDiscountPercentage) {
            input.skuPrice.skuSpecialDiscountPercentage = notNullAndUndefinedCheck(input.skuPrice?.skuSpecialDiscountPercentage) ? input.skuPrice?.skuSpecialDiscountPercentage : 0;
        }

        try{

            let updatedSku = await GtSku.updateOne({skuCode: input.skuCode},{$set: {...input}})
            console.log(getCurrentLocalTime(), ": Update is successfull >> ");

            return{
                success: true,
                messageFromGotham:"Sku updated successfully",
            };
        }catch (error){
            return {
                
                success: false,
                messageFromGotham: error.message,
                sku: null
            }
        }
    }


    async updateMultipleSKUs(input){
        
        try{

            await Promise.all(input.map(async sku => {

                let skuRes = await GtSku.findOne({skuCode: sku.skuCode});
                
                let productRes = await GtProduct.findOne({_id:skuRes?.product});
               

                // console.log(getCurrentLocalTime(), "Hello sku ID >>", skuRes);
                // console.log(getCurrentLocalTime(), "Hello product ID >>", productRes);
                // console.log(getCurrentLocalTime(), "Hello sku ID >>", sku.skuPrice.msp); 
                
                if( sku.productHsnCode || sku.productShelfLifeinDays || sku.productExpirable || sku.productBrand )
                {
                    let productInput = {
                        productHsnCode: (sku['productHsnCode']) ? sku['productHsnCode'] : productRes?.productHsnCode,
                        productShelfLifeinDays: (sku['productShelfLifeinDays']) ? (sku['productShelfLifeinDays']) : productRes?.productShelfLifeinDays,
                        productExpirable: (sku['productExpirable']) ? (sku['productExpirable']) : productRes?.productExpirable ,
                        productBrand: (sku['productBrand']) ? (sku['productBrand']) : productRes?.productBrand
                    }
                    await GtProduct.updateOne({_id: skuRes.product}, {$set: {...productInput}});
                }
        
                if( sku.skuPrice?.costPrice || sku.skuPrice?.boPrice || sku.skuPrice?.msp || sku.skuPrice?.gstPercent || sku.skuPrice?.skuFlashSaleDiscountPercentage)
                {
                    sku.skuPrice.costPrice = notNullAndUndefinedCheck(sku.skuPrice?.costPrice) ? sku.skuPrice?.costPrice : skuRes.skuPrice.costPrice;
                    sku.skuPrice.boPrice = notNullAndUndefinedCheck(sku.skuPrice?.boPrice) ? sku.skuPrice?.boPrice : skuRes.skuPrice.boPrice;
                    sku.skuPrice.msp = notNullAndUndefinedCheck(sku.skuPrice?.msp) ? sku.skuPrice?.msp : skuRes.skuPrice.msp;
                    sku.skuPrice.gstPercent = notNullAndUndefinedCheck(sku.skuPrice?.gstPercent) ? sku.skuPrice?.gstPercent : skuRes.skuPrice.gstPercent;
                    sku.skuPrice.skuFlashSaleDiscountPercentage = notNullAndUndefinedCheck(sku.skuPrice?.skuFlashSaleDiscountPercentage) ? sku.skuPrice?.skuFlashSaleDiscountPercentage : skuRes.skuPrice.skuFlashSaleDiscountPercentage;
                }
                
                if (sku.skuPrice?.boLevelSellingPrice) {
                    sku.skuPrice.boLevelSellingPrice = notNullAndUndefinedCheck(sku.skuPrice?.boLevelSellingPrice) ? sku.skuPrice?.boLevelSellingPrice : null;
                }

                if (sku.skuPrice?.pincodeLevelSellingPrice) {
                    sku.skuPrice.pincodeLevelSellingPrice = notNullAndUndefinedCheck(sku.skuPrice?.pincodeLevelSellingPrice) ? sku.skuPrice?.pincodeLevelSellingPrice : null;
                }

                if (sku.skuPrice?.skuSpecialDiscountPercentage) {
                    sku.skuPrice.skuSpecialDiscountPercentage = notNullAndUndefinedCheck(sku.skuPrice?.skuSpecialDiscountPercentage) ? sku.skuPrice?.skuSpecialDiscountPercentage : 0;
                }
        
                    let updatedSku = await GtSku.updateOne({skuCode: sku.skuCode},{$set: {...sku}});
                    // console.log(getCurrentLocalTime(), "Update is successfull >> ", updatedSku);
            }));
           

            return{
                success: true,
                messageFromGotham:"SKUs updated successfully",
            };
        }catch (error){
            console.log(getCurrentLocalTime(), error);
            return {
                
                success: false,
                messageFromGotham: error.message,
                sku: null
            }
        }
        

    }

    
    async createSku(input,userInput){
        let product = input.product ;
        let productRes = await GtProduct.findOne({_id:product});

        userInput.productHsnCode = productRes?.productHsnCode ;
        userInput.productShelfLifeinDays = productRes?.productShelfLifeinDays ;
        userInput.productExpirable = productRes?.productExpirable ;
        userInput.productBrand = productRes?.productBrand ;
  
        //console.log(getCurrentLocalTime(), 'user input value', userInput) ;

        let newGtSku = new GtSku({...input});
                
        try{
            await newGtSku.save();
            return {
                success: true,
                messageFromGotham: "Sku is created successfully.",
                sku: newGtSku
            };
        }catch (error){
            return {
                success: false,
                messageFromGotham: error.message,
                sku: null
              }
        }
    }

    async createMultipleSKUs(input,userInput){
          
        try{
            await GtSku.insertMany(input);
            
            const multipleSKUForUnicom = await Promise.all(userInput.map(async sku => {

                let product = sku.product ;
                let productRes = await GtProduct.findOne({_id:product});

                sku.productHsnCode = productRes?.productHsnCode ;
                sku.productShelfLifeinDays = productRes?.productShelfLifeinDays ;
                sku.productExpirable = productRes?.productExpirable ;
                sku.productBrand = productRes?.productBrand ;
               return sku;
        }));

            console.log(getCurrentLocalTime(), "multipleSKUForUnicom >> ", multipleSKUForUnicom);
        
            return {
                success: true,
                messageFromGotham: "Skus are created successfully on Gotham",
            };
        }catch (error){
            return {
                success: false,
                messageFromGotham: error.message
              }
        }
    }


    async updateSkuQuantity(skuCode, quantity){
      
        try{
                let updatedSku = await GtSku.updateOne({skuCode}, {$set: {skuInventory: quantity}});
                console.log(getCurrentLocalTime(), "Update SKU Quantity is successfull for skuCode>>", skuCode, "by quantity", quantity);
                return{
                    success: true,
                    messageFromGotham:"Sku updated successfully",
                };
            }catch (error)
            {
                        return {
                        success: false,
                        messageFromGotham: error?.message,
                        sku: null
             }
        }
    }

    async updateMultipleSKUsSpecialDiscountPercentage(input){
      
        try{
            let resp = await Promise.all(input.map( async sku => {
                let updatedSku = await GtSku.updateOne({skuCode: sku.skuCode}, {$set: {"skuPrice.skuSpecialDiscountPercentage": sku.skuSpecialDiscountPercentage}});
                console.log(getCurrentLocalTime(), "Update SKU Special Discount Percentage is successfull for skuCode>>", sku.skuCode, "by percentage", sku.skuSpecialDiscountPercentage);
            }));
            return {
                success: true,
                messageFromGotham:"Sku updated successfully",
            };
        } catch (error)
        {
            return {
            success: false,
            messageFromGotham: error?.message,
            sku: null
            }
        }
    }

    async incrementSkuQuantity(skuCode, quantity){
       
        try{
                let updatedSku = await GtSku.updateOne({skuCode}, {$inc: {skuInventory: quantity}});
                console.log(getCurrentLocalTime(), "Increment is successfull for skuCode>>", skuCode, "by quantity", quantity);
                return{
                    success: true,
                    messageFromGotham:"Sku updated successfully",
                };
            }catch (error)
            {
                    return {
                    success: false,
                    messageFromGotham: error?.message,
                    sku: null
             }
        }
    }

    async changeSkuInventory(_id, quantity){
        let updatedSku = await GtSku.updateOne({_id}, {$inc: {skuInventory: quantity}});
        try{
                return{
                    success: true,
                    messageFromGotham:"Sku Inventory Updated successfully",
                   
                };
            }catch (error)
            {
                 return {
                     success: false,
                     messageFromGotham: error?.message,
                     sku: null
             }
        }
    }

    async searchSku(keyword, offset, limit) {

        let currDate = Date.now();
        let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});

        let scoreResultWithFuzzySearchAndBoostScores;
        console.log(getCurrentLocalTime(), "Input Keyword >> ", keyword);

        //When frontend sends a request with offset and limit we send a response with pagination.
        if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){
        scoreResultWithFuzzySearchAndBoostScores = await GtSku.aggregate([
            {
            $search: {
             index: 'skuSearch',
             compound: {
                should: [
                    {
                    text: {
                        query: keyword,
                        path: ['skuName','skuKeywords'],
                        fuzzy: {
                         maxEdits: 2,
                        },
                       }
                    },
                    {
                        text: {
                            query: keyword,
                            path: ['skuName','skuKeywords'],
                            score: { boost: {value: 2}}
                        }
                }
                ]
             }
            }
           },
           {
            $match: { skuIsActive: true}
           },
           {
            $skip: offset
           },
           {
            $limit: limit
           },            
           {
            $project: {
             _id: 1,
             skuName: 1, 
             skuCode: 1,
             skuImages: 1,
             skuTotalBought: 1,
             skuInventory: 1,
             skuMinOrder: 1,
             skuAttribute: 1,
             skuFeature: 1,
             skuReturnDetails: 1,
             skuDescriptions: 1,
             skuIsActive: 1,
             skuWeight: 1,
             skuWeightUnit: 1,
             skuThresholdObject: 1,
             skuPrice: 1,
             tag: 1,
             score: {
              $meta: 'searchScore'
             }
            }
           },

        ]);
    } else {
        //Response without pagination
        scoreResultWithFuzzySearchAndBoostScores = await GtSku.aggregate([
            {
            $search: {
             index: 'skuSearch',
             compound: {
                should: [
                    {
                    text: {
                        query: keyword,
                        path: ['skuName','skuKeywords'],
                        fuzzy: {
                         maxEdits: 2,
                        },
                       }
                    },
                    {
                        text: {
                            query: keyword,
                            path: ['skuName','skuKeywords'],
                            score: { boost: {value: 2}}
                        }
                }
                ]
             }
            }
           },
           {
            $match: { skuIsActive: true}
           },
           {
                $limit: 250
           }, 
           {
            $project: {
             _id: 1,
             skuName: 1, 
             skuCode: 1,
             skuImages: 1,
             skuTotalBought: 1,
             skuInventory: 1,
             skuMinOrder: 1,
             skuAttribute: 1,
             skuFeature: 1,
             skuReturnDetails: 1,
             skuDescriptions: 1,
             skuIsActive: 1,
             skuWeight: 1,
             skuWeightUnit: 1,
             skuThresholdObject: 1,
             skuPrice: 1,
             tag: 1,
             score: {
              $meta: 'searchScore'
             }
            }
           }
        ]);

    }


        let skusWithCoupon = await GtSku.populate(scoreResultWithFuzzySearchAndBoostScores, {
            path: 'tag',
            populate: [{
                path: 'coupon',
                select: ['couponAmount', 'couponCode', 'couponMinOrderValue', 'couponMaxDiscountAmount'],
                match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                options: {sort: {couponAmount: -1}},
                populate: ({
                    path: 'couponType',
                    select: 'couponTypeCode'
                })
            },
            {
                path: 'hookTagCoupon',
                select: ['couponAmount', 'couponCode', 'couponMinOrderValue', 'couponMaxDiscountAmount'],
                match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                options: {sort: {couponAmount: -1}},
                populate: ({
                    path: 'couponType',
                    select: 'couponTypeCode'
                })
            }]
        })

       // console.log(getCurrentLocalTime(), skusWithCoupon);

        return await GtSku.populate(skusWithCoupon, {
                path: 'skuPrice.pincodeLevelSellingPrice.pincode',
                select: ['pincode'],
                match: {pincodeIsActive: true},
              });
           // return scoreResultWithFuzzySearchAndBoostScores;

    }

    async autocompleteSku(keyword) {
        const resultWithSearch = await GtSku.find({autocomplete: keyword}); //aggregation is used
        // console.log(getCurrentLocalTime(), "result with search >> ", resultWithSearch);
        return resultWithSearch;
}
}

