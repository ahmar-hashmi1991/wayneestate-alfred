import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reqString = { type: String, required: true };

const gtBoDetailSchema = new Schema({

    boFullName: {type: String, required: true},
    boEmail: {type: String, index: { unique: true }},
    boMobileNumber: {type: String, required: true, index: { unique: true }},
    boFCMRegistrationToken: String,
    boGender: String,
    boDateOfBirth: Date,
    boOccupation: String,
    boPreferredLanguage: reqString,
    boRating:{
        _id: false,
        boRatingByBizztm: Number,
        boRatingByConsumers: Number,
    },
    boProfilePic: String, //Key from S3
    boShippingAddress:
        [{
            _id: false,
            boAddressName: String,
            boAddressLine1: String,
            boAddressLine2: String,
            pincode: { 
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'GtPincode',
                autopopulate: false, 
            },
            boMapLocation: String
        }],
    boReferDetail: {
        _id: false,
        boReferCode: String,
        boReferredBy:  { 
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'GtBoDetail',
            autopopulate: false, 
        },
        boReferCounts: Number
    },
    boReward: {
        _id: false,
        boBizzCoin: Number,
        boBizzWallet: Number
    },
    boDeviceDetail: [{
        _id: false,
        boDeviceType: String,
        boOperatingSystem: String,
        boBrand: String,
        boModel: String
    }],
    boBusinessDetail: {
        _id: false,
        boLegalBusinessName: String,
        boBankAccountNumber: {type: String, index: true},
        boBankAccountHolderName: String,
        boBankIfscCode: String,
        boUpiId: [String],
        boIsKycVerified: Boolean,
        boKycLastSubmittedDate: Date,
        boKycApproveDate: Date,
        boKycRejectDate: Date,
        boKycRejectReason: String,
        boKYCDocumentDetail: [{
            _id: false,
            kycDocumentConstant: { type: mongoose.SchemaTypes.ObjectId, ref: 'GtKycTypeConstant', autopopulate: false},
            boDocumentNumber: String,
            boDocumentExpiryDate: String,
            boDocumentImageFront: String, //S3 image
            boDocumentImageBack: String,
            boDocumentVerifyStatus: String,
        }],
        boBillingAddress: [{    
                 _id: false,           
                boGSTNumber: {type: String, index: true},
                boAddressName: String,
                boAddressLine1: String,
                boAddressLine2: String,

                pincode: { type: mongoose.SchemaTypes.ObjectId, ref: 'GtPincode', autopopulate: false},
                boMapLocation: String
            }]        
    },
    boVirtualShopDetail: {
        _id: false,
        boShopName: String,
        boDisplayShopName: String,
        boShopImages: [String], // S3 images
        boShopTagLine: String,
        boShopPrefCategories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'GtCategory', autopopulate: false}],
        boShopAddress: {
            _id: false,
            boAddresLine1: String,
            boAddresLine2: String,
            boAddresLine3: String,
            pincode: { type: mongoose.SchemaTypes.ObjectId, ref: 'GtPincode', autopopulate: false},
            boMapLocation: String
        }

    },
    boPreferredCategories: [{type: mongoose.SchemaTypes.ObjectId, ref: 'GtCategory', autopopulate:false}], //[{ type: mongoose.SchemaTypes.ObjectId, ref: 'GtCategory', autopopulate: false}],
    boIsActive: Boolean,
    boCreatedBy: String,
    boLastUpdateBy: String,
}, {timestamps: {createdAt: "boCreatedDate", updatedAt: "boLastUpdateDate"}});


gtBoDetailSchema.pre('save', function (next) {
    this.boCreatedBy = "-1";
    this.boIsActive = true;
    next();
})

gtBoDetailSchema.pre('insertMany', function (next) {
    this.boCreatedBy = "-1";
    this.boIsActive = true;
    // console.log(getCurrentLocalTime(), "Hello from insertMany");
    next();
    }
)

gtBoDetailSchema.pre('insertOne', function (next) {
    this.boCreatedBy = "-1";
    this.boIsActive = true;
    next();
    }
)


gtBoDetailSchema.plugin(require('mongoose-autopopulate'));

export const GtBoDetail = mongoose.model('GtBoDetail', gtBoDetailSchema);

