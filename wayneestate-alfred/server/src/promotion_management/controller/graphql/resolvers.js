export const resolvers = {
    Query: {
        getBannerById: async (_, {_id}, {dataSources}) => {
            return await dataSources.BannerDB.getBannerById({_id});
        },
        getAllBanners: async (_, __, {dataSources}) => {
            return await dataSources.BannerDB.getAllBanners();
        },
        getBannerByIsActive: async (_, {bannerIsActive}, {dataSources}) => {
            return await dataSources.BannerDB.getBannerByIsActive(bannerIsActive);
        },
        getBannerByName: async (_, {bannerName}, {dataSources}) => {
            return await dataSources.BannerDB.getBannerByName(bannerName);
        },
        getBannerByPlaceholderTag: async (_, {placeHolderTag, offset, limit}, {dataSources}) => {
            return await dataSources.BannerDB.getBannerByPlaceholderTag(placeHolderTag, offset, limit);
        },
        getCouponById: async (_, {_id}, {dataSources}) => {
            return await dataSources.CouponDB.getCouponById({_id});
        },
        getCouponByCouponCode: async (_, {couponCode}, {dataSources}) => {
            return await dataSources.CouponDB.getCouponByCouponCode(couponCode);
        },
        getAllCoupons: async (_, __, {dataSources}) => {
            return await dataSources.CouponDB.getAllCoupons();
        },
        getAllExistingCoupons: async (_, {offset,limit}, {dataSources}) => {
            return await dataSources.CouponDB.getAllExistingCoupons(offset,limit);
        },
        getCouponByBoId: async (_,{_id}, {dataSources}) => {
            return await dataSources.CouponDB.getCouponByBoId({_id});
        },
    },

    Mutation: {
    
        createCoupon: async (_, {input}, {dataSources}) => {
            try {
                let cpn = await dataSources.CouponDB.createCoupon({input});
                
                if (!cpn.success) {
                    throw "Coupon creation failed. Try again"
                }

                if (input.tag) {
                    let resp = await dataSources.TagTypeConstantDB.addCouponsToTag(input.tag, [cpn.coupon?._id]);
                    if (!resp.success) {
                        throw "Adding coupon to tag failed."
                    }
                } else if (input.hookTag) {
                    let resp = await dataSources.TagTypeConstantDB.addCouponsToHookTag(input.hookTag, [cpn.coupon?._id]);
                    if (!resp.success) {
                        throw "Adding coupon to hook tag failed."
                    }
                }
                
                return {
                    success: true,
                    message: "Coupon added successfully"
                }
            } catch(error) {
                return {
                success: false,
                message: error.message ? error.message : "Coupon creation failed."
                }
            }
        },
        createMultipleCoupons: async (_, {input}, {dataSources}) => {
            try {
                let tagToCouponIdMapping = new Object();
                let hookTagToCouponIdMapping = new Object();
                for (let i = 0; i < input.length; i++) {
                    let tagID = input[i].tag;
                    let hookTagID = input[i].hookTag;
                    let cpn = await dataSources.CouponDB.createCoupon({ input : input[i] });
                    if (!cpn.success) {
                        throw "Coupon creation failed. Try again"
                    }
                    let cpnID = cpn.coupon?._id;

                    if (tagID) {
                        if (tagToCouponIdMapping[tagID]) {
                            tagToCouponIdMapping[tagID].push(cpnID);
                        } else {
                            tagToCouponIdMapping[tagID] = [cpnID];
                        }                  
                    } else if (hookTagID) {
                        if (hookTagToCouponIdMapping[hookTagID]) {
                            hookTagToCouponIdMapping[hookTagID].push(cpnID);
                        } else {
                            hookTagToCouponIdMapping[hookTagID] = [cpnID];
                        }    
                    } else {
                        throw "TagID and HookTagID cannot simultaneously be null.";
                    }  
                }

                // add if-else to check condition for hooktag/tag
                for (const [key, value] of Object.entries(tagToCouponIdMapping)) {
                    let resp = await dataSources.TagTypeConstantDB.addCouponsToTag(key, value);
                    if (!resp.success) {
                        throw "Adding coupon to tag failed."
                    }
                }

                for (const [key, value] of Object.entries(hookTagToCouponIdMapping)) {
                    let resp = await dataSources.TagTypeConstantDB.addCouponsToHookTag(key, value);
                    if (!resp.success) {
                        throw "Adding coupon to hook tag failed."
                    }
                }                
                
                return {
                    success: true,
                    message: "All coupons added successfully"
                }

            } catch(error) {
                return {
                success: false,
                message: error.message ? error.message : "Multiple coupon creation failed."
                }
            }

        },
        createBanner: (_, {input}, {dataSources}) => {
            return dataSources.BannerDB.createBanner({input});
        },
        updateBanner: (_, {_id,input}, {dataSources}) => {
            return dataSources.BannerDB.updateBanner({_id,input});
        },
        updateCoupon: (_, {_id,input}, {dataSources}) => {
            return dataSources.CouponDB.updateCoupon({_id,input});
        }
        
    }
}

