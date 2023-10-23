import { gql} from "apollo-server-express";

export const typeDefs = gql`

enum kycStatus {
        PENDING, #Default
        UNDER_VERIFICATION,
        APPROVED,
        REJECTED,
    }

extend type Query {
    "Get User details of a business owner with id"
    getBoByID(_id: ID!): BoDetailResponse!
    "Get User details by phone number"
    getBoByMobileNo(boMobileNumber:String!): BoDetailResponse!
    "get all count of business owners"
    countAllBo: Int!
    "Get All BOs"
    getAllBOs( boMobileNumber:String, boFullName:String ): [BoDetail!]
    "Get All BOs for new React Alfred Panel"
    getAllBOsForNewAlfred(offset: Int, limit: Int ): [BoDetail!],
    "Get All FCM Registration Tokens for users"
    getAllFcmRegistrationTokens: [String]
    "Get GST Details"
    getGSTDetails(gstNumber: String!): GstDetailResponse!
}

type Mutation {
    createBoDetail(input: BoDetailInput): BoDetailResponse
    updateBoDetail(_id: ID!, input: BoDetailInput): BoDetailResponse
    updateMultipleBoDetail(input: [MultipleBoDetailInput]): BoDetailResponse
    updateMultipleBusinessDetailInBoDetail(input: [MultipleBoBusinessDetailInput]): BoDetailResponse
    giftBizzCoin(_id: ID!, noOfCoins: Int): Boolean
    deductBizzCoin(_id: ID!, noOfCoins: Int): Boolean
    createMultipleBO(input: [BoDetailInput]): BoDetailResponse
 }

 input BoDetailInput {
    boFullName: String
    boEmail: String
    boMobileNumber: String
    boFCMRegistrationToken: String
    boGender: String
    boDateOfBirth: String
    boOccupation: String
    boPreferredLanguage: String
    boProfilePic: String 
    boShippingAddress: [InpBoShippingAddress]
    boReferDetail: InpBoReferDetail
    boRating: InpBoRating
    boReward: InpBoReward
    boDeviceDetail: [InpBoDeviceDetail]
    boBusinessDetail: InpBoBusinessDetail
    boVirtualShopDetail: InpBoVirtualShopDetail
    boPreferredCategories: [ID]
    boIsActive: Boolean
 }

 input MultipleBoDetailInput {
    boID: ID!
    boDetail: BoDetailInput!
 }

 input MultipleBoBusinessDetailInput {
    boID: ID!
    boLegalBusinessName: String
    boGSTNumber: String
    boAddressName: String
    boAddressLine1: String
    boAddressLine2: String
    pincode: Int
    boMapLocation: String
 }


 input InpBoReferDetail {
    boReferCode: String
    boReferredBy: ID
    boReferCounts: Int

}

input InpBoRating {
    boRatingByBizztm: Int
    boRatingByConsumers: Int 

}

input InpBoReward {
    boBizzCoin: Int
    boBizzWallet: Int
}

input InpBoDeviceDetail {
    boDeviceType: String
    boOperatingSystem: String
    boModel: String
    boBrand: String
}

input InpBoKYCDocumentDetail {
        kycDocumentConstant: ID
        boDocumentNumber: String
        boDocumentExpiryDate: String
        boDocumentImageFront: String
        boDocumentImageBack: String
        boDocumentVerifyStatus: kycStatus
      
}

input InpBoBillingAddress {
        boGSTNumber: String
        boAddressName: String
        boAddressLine1: String
        boAddressLine2: String
        pincode: String #String
        boMapLocation: String
}



input InpBoBusinessDetail {
    boLegalBusinessName: String
    boBankAccountNumber: String
    boBankAccountHolderName: String
    boBankIfscCode: String
    boUpiId: [String]
    boIsKycVerified: Boolean 
    boKycLastSubmittedDate: String,
    boKycApproveDate: String,
    boKycRejectDate: String,
    boKycRejectReason: String
    boKYCDocumentDetail: [InpBoKYCDocumentDetail]
    boBillingAddress: [InpBoBillingAddress]
}

input InpBoVirtualShopDetail {
    boShopName: String
    boShopImages: [String] 
    boShopTagLine: String
    boShopPrefCategories: [ID!]  
    boDisplayShopName: String
    boShopAddress: InpBoShopAddress
}

input InpBoShopAddress {
    boAddresLine1: String
    boAddresLine2: String
    boAddresLine3: String
    pincode: String
    boMapLocation: String
}

 input InpBoShippingAddress	{
    boAddressName: String 
    boAddressLine1: String
    boAddressLine2: String
    pincode: String
    boMapLocation: String
     
}

 type BoDetailResponse {
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated business owner after a successful mutation"
        boDetail: BoDetail
    }

"Type structure containing the shipping address of a BO"
type BoShippingAddress	{
    "Shipping Address Name"
    boAddressName: String!
    "Line 1 of a business owner "
    boAddressLine1: String!
    "Line 2 of a business owners address"
    boAddressLine2: String
    "pincode of business oweers address"
    pincode: Pincode!
    "Exact map location of a business owner"
    boMapLocation: String
    
     
}

type BoReferDetail {
    "Referral code for a user"
    boReferCode: String!
    "Business owner that made the referral"
    boReferredBy: BoDetail
    "number of refferals that a user has made"
    boReferCounts: Int!
    
     
}

type BoRating {
    "Rating of a business owner given by BizzTm"
    boRatingByBizztm: Int
    "Rating of a business owner given by a consumer"
    boRatingByConsumers: Int 
    
     
}


type BoReward {

    "Total number of bizzcoins"
    boBizzCoin: Int
    "Total wallet amount of business owner"
    boBizzWallet: Int
    
     
    
}

type BoDeviceDetail {
    "Type of device that the user is using"
    boDeviceType: String
    "Operating system of the users device"
    boOperatingSystem: String
    "Model of the users device"
    boModel: String
    "Brand of the users device"
    boBrand: String
    
     

}

type BoKYCDocumentDetail {
        "Type of Kyc document"
        kycDocumentConstant: KycTypeConstant!
        "Document number of the kyc submission"
        boDocumentNumber: String!
        "Expiry date of the document, can be null as some documents do not expire"
        boDocumentExpiryDate: String
        "Front side image of the submitted document"
        boDocumentImageFront: String
        "Back side image of the submitted doucment"
        boDocumentImageBack: String
        "Status of the kyc document submission"
        boDocumentVerifyStatus: kycStatus!
        

}

type BoBillingAddress {

        "Gst number of the business owner"
        boGSTNumber: String!
        "Name associated with the billing address"
        boAddressName: String!
        "Line 1 of the billing address"
        boAddressLine1: String!
        "Line 2 of the billing address"
        boAddressLine2: String
        "pincode of the billing address"
        pincode: Pincode!
        "Exact map location of the billing address"
        boMapLocation: String
        
         
}



type BoBusinessDetail {
    "Legal name of the business that was registered"
    boLegalBusinessName: String
    "Bank Account number associated with the business"
    boBankAccountNumber: String
    "Bank account holder name"
    boBankAccountHolderName: String
    "IFSC code of the users bank account"
    boBankIfscCode: String
    "Upi id of the user"
    boUpiId: [String]
    "Flag for marking if a business owners kyc is verified"    
    boIsKycVerified: Boolean 
    "Most recent date of submission of KYC Document"
    boKycLastSubmittedDate: String,
    "Date of KYC Approval"
    boKycApproveDate: String,
    "Date of KYC Reject"
    boKycRejectDate: String,
    "KYC Document Reject reason"
    boKycRejectReason: String
    "Reference to the users KYC details"
    boKYCDocumentDetail: [BoKYCDocumentDetail]
    "Reference to the users billing details"
    boBillingAddress: [BoBillingAddress]
}

type BoVirtualShopDetail {
    "Shop name of the virtual shop"
    boShopName: String
    "Shop images of the virtual shop"
    boShopImages: [String] 
    "Images of the virtual shop"
    boShopTagLine: String
    "Preffered categories"
    boShopPrefCategories: [Category!]  
    boDisplayShopName: String,
    boShopAddress: BoShopAddress,
     
}

type BoShopAddress {
        boAddresLine1: String
        boAddresLine2: String
        boAddresLine3: String
        pincode: ID
        boMapLocation: String
}

type BoDetail {
    _id: ID!
    "Combination of first and last name of a business owner"
    boFullName: String!
    "Email address of a business owner"
    boEmail: String
    "List of one or more Mobile Numbers of a business owner"
    boMobileNumber: String!
    "FCM Registration Token of a business owner(used in firebase)"
    boFCMRegistrationToken: String
    "Gender of a business owner"
    boGender: String
    "date of birth of a business owner"
    boDateOfBirth: String
    "Occupation for the BO"
    boOccupation: String
    "Preferred language of a business owner"
    boPreferredLanguage: String
    "Profile picture of a business owner"
    boProfilePic: String 
    "Reference to the shipping address of a business owner"
    boShippingAddress: [BoShippingAddress]
    "Reference to the referral details of a business owner"
    boReferDetail: BoReferDetail
    "Reference to ratings of a business owner"
    boRating: BoRating
    "Reference to a business owners coins and wallet"
    boReward: BoReward
    "Reference to the users device details"
    boDeviceDetail: [BoDeviceDetail]
    "Reference to the business owners business details "
    boBusinessDetail: BoBusinessDetail
    "Reference to the virtual shop of a business owner"
    boVirtualShopDetail: BoVirtualShopDetail
    "Preffered categories of a business owner "
    boPreferredCategories: [Category!]
    "Flag to mark if a business owner is active"
    boIsActive: Boolean
    "User that created this business owner"
    boCreatedBy: String
    "cretion date of this business owner"
    boCreatedDate: String
    "Last updated date of this business owner"
    boLastUpdateDate: String
    "User that updated this business owner"
    boLastUpdateBy: String
}

type GstDetail {
    "Gst Number"
    gstin: String
    "tradeName like BIZZTM TECHNOLOGY PRIVATE LIMITED",
    tradeName: String
    "legalName like BIZZTM TECHNOLOGY PRIVATE LIMITED",
    legalName: String
    "Billing Address Line 1"
    address1: String,
    "Billing Address Line 2"
    address2: String,
    "Billing Address StateCode"
    stateCode: Int
    "Billing Address Pincode"
    pinCode: Int
    "Billing Address TxpType"
    txpType: String
    "Place"
    place: String
    "Status of GSTIN"
    status: String
    blkStatus: String,
    state_id: String,
    is_blocked: Boolean,
    transin: String
}

type GstDetailResponse {
        "Indicates whether the query was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated business owner after a successful mutation"
        gstDetail: GstDetail
    }
`;