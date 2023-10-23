import { gql} from 'apollo-server-express';

export const typeDefs = gql`

    enum tagType {
        GENERIC,
        HOOK_TAG
    }

   enum couponType{
       PRODUCT
       PROMOTION
   }

   enum tagColorCode {
        COLOR_EDB659
        COLOR_63D6E5
        COLOR_FB413A
        COLOR_005678
        COLOR_EA436F
        COLOR_00FF3A
   }

   enum notificationType {
    FULLSCREEN
    NORMAL
   }

   extend type Query {
        "Get all coupon type constants"
        getAllCouponTypeConstant: [CouponTypeConstant!]
        "Get all notification type constants"
        getAllPushNotificationTypeConstant: [PushNotificationTypeConstant!]
        "Get all status type constants"
        getAllStatusTypeConstant: [StatusTypeConstant!]
        "Get all tag type constants"
        getAllTagTypeConstant(offset: Int, limit: Int): [TagTypeConstant!]
        "Get tag type constant by id"
        getTagTypeConstantById(_id: ID!): TagTypeConstant!
        "Get all group association type constants"
        getAllGroupAssociationConstant: [GroupAssociationConstant!]
        "Get all kyc type constants"
        getAllKycTypeConstant: [KycTypeConstant!]
        "Get all language type constants"
        getAllLanguageTypeConstant: [LanguageTypeConstant!]
        "Get all return reason type constants"
        getAllReturnReasonTypeConstant: [ReturnReasonTypeConstant!]
        "Get reason type description from Object Id"
        getReturnReasonTypeConstantFromId(_id:ID!): ReturnReasonTypeConstant
    }


    # Need to create resolvers for this
 extend type Mutation {
        
        createCouponTypeConstant(input:CouponTypeConstantInput): CouponTypeConstantResponse
        createPushNotificationTypeConstant(input: PushNotificationTypeConstantInput): PushNotificationTypeConstantResponse
        createStatusTypeConstant(input:StatusTypeConstantInput): StatusTypeConstantResponse
        createTagTypeConstant(input:TagTypeConstantInput): TagTypeConstantResponse
        createHookTagTypeConstant(input:TagTypeConstantInput): TagTypeConstantResponse
        createGroupAssociationConstant(input:GroupAssociationConstantInput): GroupAssociationConstantResponse
        createKycTypeConstant(input:KycTypeConstantInput): KycTypeConstantResponse
        createLanguageTypeConstant(input:LanguageTypeConstantInput): LanguageTypeConstantResponse
        createReturnReasonTypeConstant(input: ReturnReasonTypeConstantInput): ReturnReasonTypeConstantResponse

        updateCouponTypeConstant(_id:ID!,input:CouponTypeConstantInput): CouponTypeConstantResponse
        updatePushNotificationTypeConstant(_id:ID!, input: PushNotificationTypeConstantInput): PushNotificationTypeConstantResponse
        updateStatusTypeConstant(_id:ID!, input: StatusTypeConstantInput): StatusTypeConstantResponse
        updateTagTypeConstant(_id:ID!, input:TagTypeConstantInput ): TagTypeConstantResponse
        updateGroupAssociationConstant(_id:ID!,input: GroupAssociationConstantInput): GroupAssociationConstantResponse
        updateKycTypeConstant(_id:ID!, input: KycTypeConstantInput): KycTypeConstantResponse
        updateLanguageTypeConstant(_id:ID!, input: LanguageTypeConstantInput): LanguageTypeConstantResponse
        updateReturnReasonTypeConstant(_id:ID!, input: ReturnReasonTypeConstantInput): ReturnReasonTypeConstantResponse

        
    }
# input
    input CouponTypeConstantInput {
        couponTypeCategory: String
        couponTypeCode: couponType
        couponTypeName: String
        couponTypeDescription: String
        couponTypeIsActive: Boolean!
        
    }

    input PushNotificationTypeConstantInput {
        pushNotificationType: notificationType
        
        pushNotificationTitle: String!
        
        pushNotificationDescription: String!

        pushNotificationImageUrl: String

        pushNotificationPlaceholderTag: String

        pushNotificationBannerName: String

        pushNotificationSkuCode: String

        pushNotificationBoFCMRegistrationToken: [String!]
        }

    input StatusTypeConstantInput {
    
        statusType: String
        
        statusCode: String
       
        statusName: String
       
        statusDescription: String
       
         
    }
    
   
    input TagTypeConstantInput {
           
        tagCode: String
   
        tagName: String
   
        tagDescription: String  

        tagColorCode: tagColorCode
   
    }


    input GroupAssociationConstantInput {

  
        gaConstantCode: String

        gaConstantName: String

        gaConstantDomainType: String
   
        gaConstantDescription: String
 
         

    }


    input KycTypeConstantInput {
        kycDocName: String
        kycDocDescription: String
        boDocumentNumber: Boolean
        kycDocImageFront: Boolean
        kycDocumentImageBack: Boolean
        kycDocumentExpiryDate: Boolean

    }

    input LanguageTypeConstantInput {

        languageCode: String
     
        languageName: String
    }

    input ReturnReasonTypeConstantInput {
        reasonName: String
        reasonDescription: String
    }

    type CouponTypeConstantResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated coupon type after a successful mutation"
        couponTypeConstant: CouponTypeConstant
    }

    type PushNotificationTypeConstantResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated notification type after a successful mutation"
        pushNotificationTypeConstant: PushNotificationTypeConstant
        
    }

    type StatusTypeConstantResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated status type after a successful mutation"
        statusTypeConstant: StatusTypeConstant

    }

    type TagTypeConstantResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated tag after a successful mutation"
        tagTypeConstant: TagTypeConstant
    }

    type GroupAssociationConstantResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated group association after a successful mutation"
        groupAssociationConstant: GroupAssociationConstant
    }


    type KycTypeConstantResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated kyc type after a successful mutation"
        kycTypeConstant: KycTypeConstant
    }

    type LanguageTypeConstantResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated language type after a successful mutation"
        languageTypeConstant: LanguageTypeConstant
    }

    type ReturnReasonTypeConstantResponse {
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated language type after a successful mutation"
        returnReasonTypeConstant: ReturnReasonTypeConstant
    }
    #end inputs

   
    """
    Different types of coupons possible
    Discount - amount
    Cashback - percentage
    Discount - percentage 
    Cashback - amount
    Shipfree - 0 shipping fee at cart
    PaymentMethod - percentage
    PaymentMethod - amount 


    Coupon Type will refer to data mostly like below - 

    {
    "coupon_type_id" : "CT01"
    "coupon_type_category" : "DISCOUNT" 
    "coupon_type_code" : "PERCENTAGE"
    "coupon_type_name" : "Discount - Percentage Off" 
    "coupon_type_description" : "Some percentage off would be applicable on some items on applying this Discount Code" 
    }
    """
    type CouponTypeConstant {
        _id: ID
        "Category of a coupon "
        couponTypeCategory: String
        "Code of a coupon type"
        couponTypeCode: String
        "Name of a coupon type"
        couponTypeName: String
        "Description of a coupon type"
        couponTypeDescription: String
        "Coupon Type Is Active Or Not Flag"
        couponTypeIsActive: Boolean!
    }

    type PushNotificationTypeConstant {
        _id:ID
        "Type of notification"
        pushNotificationType: String
        "Title of a notification"
        pushNotificationTitle: String
        "Descripiton of a notification"
        pushNotificationDescription: String
        "Image url of notification"
        pushNotificationImageUrl: String
        "Placeholder tag for notification"
        pushNotificationPlaceholderTag: String
        "Banner name for notification"
        pushNotificationBannerName: String
        "SkuCode for notification"
        pushNotificationSkuCode: String
        "List of registration tokens to send the push notification to"
        pushNotificationBoFCMRegistrationToken: [String!]         
    }

    type StatusTypeConstant {
        _id:ID
        "Type of status"
        statusType: String
        "Code for status type"
        statusCode: String
        "Name for a Status type"
        statusName: String
        "Descripiton of a Status type"
        statusDescription: String
        
         
    }
    
    """
    These tags will be used to tag products with common characteristics and can be used for any purpose. 
    Products will be grouped with these tags. But in order to add a tag to a product you need to again select 
    it from drop down that will be populated from this table itself.
    Example  'Perishable Items', 'Starving products', 'Clay products', 'Small shelf life' etc.
    """
    type TagTypeConstant {
        _id:ID
        "Type of a tag constant"
        tagType: tagType
        "Code for a tag type"
        tagCode: String
        "Name of a tag type "
        tagName: String
        "Description of a tag type"
        tagDescription: String
        "Color of this tag"
        tagColorCode: tagColorCode
        "coupons belonging to this tag type"
        coupon: [Coupon]
        "hook tag coupons belonging to this tag type"
        hookTagCoupon: [Coupon]
        "created date"
        tagCreatedDate: String
        "last updated date"
        tagLastUpdatedDate:String
        "last updated by"
        tagLastUpdatedBy: Int
        
         
    }

    """
    This table will be used to autofill drop down selects while creating products/scat/sscat/gp, coupons, discounts. and all other promotions. 
    Again every discount is a coupon while  the vice-versa is not true.
    When gac_domain_type = "Product" - it means the particular association is majorly to standardize at product level. 
    These are all the pre-defined level of hireacrichy a SKU follow. While  when gac_domain_type = "PROMOTION", it means the group is created majorly to link a promotion to it.
    """
    type GroupAssociationConstant {
        _id:ID
        "Code for a ga constant"
        gaConstantCode: String
        "Name of a ga constant"
        gaConstantName: String
        "Domain type of a ga constant"
        gaConstantDomainType: String
        "Description of a ga constant"
        gaConstantDescription: String
        
         

    }


    type KycTypeConstant {
        _id:ID
        "Name of a kyc document"
        kycDocName: String
        "Description of a KYC document"
        kycDocDescription: String
        "Flag to mark if document has a number"
        boDocumentNumber: Boolean
        "Flag to mark if document requires a front image"
        kycDocImageFront: Boolean
        "Flag to mark if document requires a back image"
        kycDocumentImageBack: Boolean
        "Flag to mark if a document can expire"
        kycDocumentExpiryDate: Boolean
                
    }

    type LanguageTypeConstant {
        _id:ID
        "Code for a language"
        languageCode: String
        "Name of a language"
        languageName: String
        
         
    }

    type ReturnReasonTypeConstant {
        _id: ID
        reasonName: String
        reasonDescription: String
    }
`;

//why is pincode destrict,pincode region  a list?
//remove placeholder string for all types that have not been created 
//product>tag
//kycDocumentConstantId: String!
//supplier

//Checklist
//check pluralisation 

//number and int replace

//Bo banck account number is string?

//coupongroup association not clear on how to structure it 
