import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gtPushNotificationTypeConstantSchema = new Schema({
   pushNotificationType: {type: String, required: true },
   pushNotificationTitle: {type: String, required: true },
   pushNotificationDescription: {type: String, required: true },
   pushNotificationImageUrl: String,
   pushNotificationPlaceholderTag: String,
   pushNotificationBannerName: String,
   pushNotificationSkuCode: String,
   pushNotificationBoFCMRegistrationToken: [String]    
}, 
{ 
   timestamps: {
   createdAt: 'pushNotificationCreatedDate', // Use `pushNotificationCreatedDate` to store the created date
   updatedAt: 'pushNotificationLastUpdateDate' // and `pushNotificationLastUpdateDate` to store the last updated date
   }
});

export const GtPushNotificationTypeConstant = mongoose.model('GtPushNotificationTypeConstant', gtPushNotificationTypeConstantSchema);

