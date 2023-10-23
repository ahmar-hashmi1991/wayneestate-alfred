import { getCurrentLocalTime } from '../../../utility';
import { GtPushNotificationTypeConstant } from '../GtPushNotificationTypeConstant';

export class PushNotificationTypeConstant {

    async getAllPushNotificationTypeConstant() {
        let allPushNotificationType = await GtPushNotificationTypeConstant.find();
        return allPushNotificationType;
    }

    async createPushNotificationTypeConstant({input}, firebaseAdmin){
        try{
            let newPushNotificationTypeConstant = new GtPushNotificationTypeConstant({...input});
            let registrationTokens = newPushNotificationTypeConstant.pushNotificationBoFCMRegistrationToken;
            let skuCodeInp = newPushNotificationTypeConstant.pushNotificationSkuCode;
            let placeHolderTagInp = newPushNotificationTypeConstant.pushNotificationPlaceholderTag;
            let bannerNameInp = newPushNotificationTypeConstant.pushNotificationBannerName;

            let payload = { data: {}};

            if(skuCodeInp && skuCodeInp!== "")
            {
                payload.data.skuCode = skuCodeInp;
            }
            else if (placeHolderTagInp && placeHolderTagInp !== "" && bannerNameInp && bannerNameInp !== "")
            {
                payload.data.placeholderTag = placeHolderTagInp;
                payload.data.bannerName = bannerNameInp;
            } else {
                // no operation
            }


            payload.data.title = newPushNotificationTypeConstant.pushNotificationTitle;
            payload.data.message = newPushNotificationTypeConstant.pushNotificationDescription;
            payload.data.imageUrl = newPushNotificationTypeConstant.pushNotificationImageUrl;
            if(newPushNotificationTypeConstant.pushNotificationType === "FULLSCREEN")
                payload.data.fullScreen = "YES";

            var options = {
                priority: "high",
                // dryRun: true,
                timeToLive: 60 * 60 * 24
            };


            console.log("payload . data >> ", payload.data);
           //console.log(getCurrentLocalTime(), "registration Tokens >> ", registrationTokens.length)

            let batchOfRegTokens = [], size = 999;
    
            for (let i = 0; i < registrationTokens.length; i += size)
                batchOfRegTokens.push(registrationTokens.slice(i, i + size));

            // console.log(batchOfRegTokens);

            batchOfRegTokens.forEach( async  regTokenArr => {
                 let resp = await firebaseAdmin.messaging().sendToDevice(regTokenArr, payload, options);
                 console.log(getCurrentLocalTime(), " : resp >> ", regTokenArr.length);
                if (!resp) {
                    throw { message : "Something went wrong, please check with Admin"}
                }
                // console.log(getCurrentLocalTime(), " : Successfully sent message:", resp);

            })

            await newPushNotificationTypeConstant.save();
            return {
                success: true,
                message: "Notification is created successfully.",
                pushNotificationTypeConstant: newPushNotificationTypeConstant
            };

        } catch (error){
            return {
                success: false,
                message: error?.message ? error.message : "Notification creation failed.",
                pushNotificationTypeConstant: null
              }
        }
    }

    async updatePushNotificationTypeConstant({_id, input}){
        try{
            let updatedPushNotificationTypeConstant = await GtPushNotificationTypeConstant.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"Notification updation successfully",
                pushNotificationTypeConstant: updatedPushNotificationTypeConstant
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                pushNotificationTypeConstant: null
            }
        }
    }

}

