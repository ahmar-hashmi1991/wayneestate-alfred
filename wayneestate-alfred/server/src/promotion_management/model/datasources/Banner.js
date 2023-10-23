import { GtCouponTypeConstant } from '../../../static_content_management/model/GtCouponTypeConstant';
import { couponTypeDiscountCategory, couponTypePercentageCode, notNullAndUndefinedCheck } from '../../../utility';
import { GtBanner } from '../GtBanner';

export class Banner {

    async getBannerById(_id) {
        let bannerFound = await GtBanner.findOne({_id})
        return bannerFound;
    }

    async getBannerByIsActive(bannerIsActive) {
        let bannerFound = await GtBanner.find({bannerIsActive})
        return bannerFound;
    }

    async getBannerByName(bannerName) {
        let bannerFound = await GtBanner.findOne({bannerName})
        return bannerFound;
    }

    async getAllBanners() {
        let allBanners = await GtBanner.find();
        return allBanners;
    }

    async getBannerByPlaceholderTag(placeHolderTag, offset, limit) {

        let currDate = Date.now();
        let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});
        let allBannerSKUs;

       //When frontend sends a request with offset and limit we send a response with pagination.
       if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){

        allBannerSKUs = GtBanner.findOne({bannerPlaceHolderTags: placeHolderTag}).populate({
            path: 'sku',
            // Removing isActive Filter since this shuffles the order of SKUs which is not required by FC team.
            // match: {'skuIsActive': true}, 
            options: {                    
                skip: offset,
                limit: limit
            },
            populate: ({
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
        });        
    } else {
        allBannerSKUs = GtBanner.findOne({bannerPlaceHolderTags: placeHolderTag}).populate({
            path: 'sku',
            match: {'skuIsActive': true},        
            populate: ({
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
        });   

    }        
        return allBannerSKUs;

    }

    async createBanner({input}){
        let newGtBanner = new GtBanner({...input});
        try{
            await newGtBanner.save();
            return {
                
                success: true,
                message: "Banner is created successfully.",
                banner: newGtBanner
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                banner: null
              }
        }
    }

    async updateBanner({_id, input}){
        try{
            let updatedBanner = await GtBanner.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"Banner updated successfully",
                banner: updatedBanner
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                banner: null
            }
        }
    }
}

