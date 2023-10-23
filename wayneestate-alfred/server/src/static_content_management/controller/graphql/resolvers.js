import { COUPON_TAGCODE_GENERIC, COUPON_TAGCODE_HOOK_TAG } from "../../../utility";

// import GtCouponTypeConstant from "./models/GtCouponTypeConstant.model";
export const resolvers = {
    Query: {
        getAllCouponTypeConstant: (_, __, { dataSources }) => {
           return dataSources.CouponTypeConstantDB.getAllCouponTypeConstant();
        },
        getAllGroupAssociationConstant: (_, __, { dataSources }) => {
           return dataSources.GroupAssociationConstantDB.getAllGroupAssociationConstant();
        },
        getAllKycTypeConstant: (_, __, { dataSources }) => {
            return dataSources.KycTypeConstantDB.getAllKycTypeConstant();
        },
        getAllLanguageTypeConstant: (_, __, { dataSources }) => {
            return dataSources.LanguageTypeConstantDB.getAllLanguageTypeConstant();
        },
        getAllPushNotificationTypeConstant: (_, __, { dataSources }) => {
            return dataSources.NotificationTypeConstantDB.getAllPushNotificationTypeConstant();
        },
        getAllStatusTypeConstant: (_, __, { dataSources }) => {
            return dataSources.StatusTypeConstantDB.getAllStatusTypeConstant();
        },
        getAllTagTypeConstant: async (_, {offset,limit}, { dataSources }) => {
            return await dataSources.TagTypeConstantDB.getAllTagTypeConstant(offset,limit);
        },
        getTagTypeConstantById: (_, {_id}, {dataSources}) => {
            return dataSources.TagTypeConstantDB.getTagTypeConstantById({_id});
        },
        getAllReturnReasonTypeConstant: (_, __, { dataSources }) => {
            return dataSources.ReturnReasonTypeConstantDB.getAllReturnReasonTypeConstant();
        },
        getReturnReasonTypeConstantFromId: (_, {_id}, {dataSources}) => {
            return dataSources.ReturnReasonTypeConstantDB.getReturnReasonTypeConstantFromId({_id});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
        }
    },

    Mutation: {
        // create and update queries in MongoDB do not go through datasource right now
        createCouponTypeConstant: (_, {input}, {dataSources}) => {
            return dataSources.CouponTypeConstantDB.createCouponTypeConstant({input});
        },
        createGroupAssociationConstant: (_, {input}, {dataSources}) => {
            return dataSources.GroupAssociationConstantDB.createGroupAssociationConstant({input});
        },
        createKycTypeConstant: (_, {input}, {dataSources}) => {
            return dataSources.KycTypeConstantDB.createKycTypeConstant({input});
        },
        createLanguageTypeConstant: (_, {input}, {dataSources}) => {
            return dataSources.LanguageTypeConstantDB.createLanguageTypeConstant({input});
        },
        createPushNotificationTypeConstant: async (_, {input}, {firebaseAdmin, dataSources}) => {
            // if no registration tokens are passed, it means this is a broadcast message to be sent to all BOs with a valid token.
            // hence, aggregating all the registration tokens from BoDetail.
            if (!input.pushNotificationBoFCMRegistrationToken)
            {
                input.pushNotificationBoFCMRegistrationToken = await dataSources.BoDetailDB.getAllFcmRegistrationTokens();
            }
            return dataSources.PushNotificationTypeConstantDB.createPushNotificationTypeConstant({input},firebaseAdmin);
        },
        createStatusTypeConstant: (_, {input}, {dataSources}) => {
            return dataSources.StatusTypeConstantDB.createStatusTypeConstant({input});
        },
        createTagTypeConstant: async (_, {input}, {dataSources}) => {

            input.tagType = COUPON_TAGCODE_GENERIC;
            return await dataSources.TagTypeConstantDB.createTagTypeConstant({input});
            /*if (resp.success && resp.tagTypeConstant) {
                for (let i=0; i<skus?.length; i++) {
                    await dataSources.SkuDB.updateTagInSku({skuCode: skus[i], tag: resp.tagTypeConstant._id}); 
                }
            }
            return resp;*/
        },
        // createHookTagtypeconstant --> fetch and insert coupons of GENERIC and tagcode = HK/HF/etc, dont take tagtype
        // as input, have it equal to HOOK TAG
        createHookTagTypeConstant: async (_, {input}, {dataSources}) => {
            input.tagType = COUPON_TAGCODE_HOOK_TAG;

            let cpns = await dataSources.TagTypeConstantDB.getAllCouponsOfGivenTagTypeAndTagCode(COUPON_TAGCODE_GENERIC, input.tagCode);            
            input.coupon = cpns.coupon;
            
            return await dataSources.TagTypeConstantDB.createTagTypeConstant({input});
        },
        createReturnReasonTypeConstant: (_, {input}, {dataSources}) => {
            return dataSources.ReturnReasonTypeConstantDB.createReturnReasonTypeConstant({input});
        },

        //update 
        updateCouponTypeConstant: (_, {_id,input}, {dataSources}) => {
            return dataSources.CouponTypeConstantDB.updateCouponTypeConstant({_id,input});
        },
        updateGroupAssociationConstant: (_, {_id,input}, {dataSources}) => {
            return dataSources.GroupAssociationConstantDB.updateGroupAssociationConstant({_id,input});
        },
        updateKycTypeConstant: (_, {_id,input}, {dataSources}) => {
            return dataSources.KycTypeConstantDB.updateKycTypeConstant({_id,input});
        },
        updateLanguageTypeConstant: (_, {_id,input}, {dataSources}) => {
            return dataSources.LanguageTypeConstantDB.updateLanguageTypeConstant({_id,input});
        },
        updatePushNotificationTypeConstant: (_, {_id,input}, {dataSources}) => {
            return dataSources.PushNotificationTypeConstantDB.updatePushNotificationTypeConstant({_id,input});
        },
        updateStatusTypeConstant: (_, {_id,input}, {dataSources}) => {
            return dataSources.StatusTypeConstantDB.updateStatusTypeConstant({_id,input});
        },
        updateTagTypeConstant: async (_, {_id,input}, {dataSources}) => {    
            return await dataSources.TagTypeConstantDB.updateTagTypeConstant({_id,input});
        },
        updateReturnReasonTypeConstant: (_, {_id, input}, {dataSources}) => {
            return dataSources.ReturnReasonTypeConstantDB.updateReturnReasonTypeConstant({_id, input});
        }



    },


}
