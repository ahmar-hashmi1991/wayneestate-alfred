import { gql} from 'apollo-server-express';

export const typeDefs = gql`
   
   extend type Query {
        "Get Banner details using bannerId"
        getBannerById(_id:ID!): Banner
        "Get all banners"
        getAllBanners: [Banner]
        "get all banners based on isActive boolean"        
        getBannerByIsActive(bannerIsActive:Boolean): [Banner]
        "get all banners based on isActive boolean"       
        getBannerByName(bannerName:String): Banner
        "Get Banner by placeholder tag"
        getBannerByPlaceholderTag(placeHolderTag: String, offset:Int, limit:Int): Banner
        "Get coupon details using couponId"                
        getCouponById(_id:ID!): Coupon
        "Get Coupon Detail using Coupon Code"
        getCouponByCouponCode(couponCode: String): Coupon
        "Get all coupons for a business owner using boDetailId"
        getCouponByBoId(_id:ID!) : [Coupon]
        "Get all coupons those are active and Non expired for Robin"
        getAllCoupons: [Coupon]
        "Get All coupons existing in Gotham"
        getAllExistingCoupons(offset: Int, limit: Int): [Coupon]
      
    }



  extend type Mutation {
        
        createBanner(input: BannerInput): BannerResponse
        createCoupon(input: CouponInput): CouponResponse
        createMultipleCoupons(input: [CouponInput]): CouponResponse
        updateBanner(_id:ID!,input: BannerInput): BannerResponse
        updateCoupon(_id:ID!,input: CouponInput): CouponResponse
      
        
    }


    input BannerInput {
        bannerIsActive: Boolean
        bannerDescription: String
        bannerName: String
        bannerImage: [String]
        bannerVideo: [String]
        bannerPlaceHolderTags: String
        sku: [ID!]
    }

    input CouponBoDetailInput {  
        isBoCoupon: Boolean 
        boDetail: ID 
    }

    # input CouponGroupAssociationInput {
    #     gaConstantCode: String
    #     sku: [ID]
    #     # tag: [ID]
    #     # product: [ID]
    #     # productGroup:[ID]
    #     # subSubCategory: [ID]
    #     # subCategory:[ID]
    #     # category: [ID]
    # }

    input CouponInput {
        couponCode: String
        couponTitle: String
        couponDescription: String
        couponImage: String 
        couponAmount: Float
        couponBoDetail: [CouponBoDetailInput]
        couponType: ID
        couponMinOrderValue: Int
        couponMaxDiscountAmount: Float
        couponMaxUsageOverall: Int
        couponMaxUsagePerUser: Int 
        # couponGroupAssociation: [CouponGroupAssociationInput]
        couponTermsAndConditions: String
        couponIsActive: Boolean 
        couponStartDate: String
        couponEndDate: String
        tag: ID
        hookTag: ID        
    }

    type BannerResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated banner after a successful mutation"
        banner: Banner
    }

    type CouponResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated coupon after a successful mutation"
        coupon: Coupon
    }


    type Banner {
         _id: ID
        "Flag to mark if a banner is active "
        bannerIsActive: Boolean
        "Description of a banner"
        bannerDescription: String
        "Name of a banner"
        bannerName: String
        "List of images for a banner"
        bannerImage: [String]
        "list of videos for a banner"
        bannerVideo: [String]
        "Placeholder tags associated with a banner"
        bannerPlaceHolderTags: String
        "List of SKUs in the banner"
        sku: [Sku]
    }

    type CouponBoDetail {
        "Flag to mark if a coupon is for a business owner "
        isBoCoupon: Boolean 
        "Reference to a business owner"
        boDetail: BoDetail 
      
         
    }

    # type CouponGroupAssociation {
    #     "Reference to group association type constant"
    #     gaConstantCode: String
    #     # tag: [TagTypeConstant]
    #     # product: [Product]
    #     # productGroup:[ProductGroup]
    #     # subSubCategory: [SubSubCategory]
    #     # subCategory:[SubCategory]
    #     # category: [Category]
    #     sku: [Sku]
    # }

    """
    This type refers to the Coupon Schema. 
    
    The attribute to take notice is - 
    coupon_group_association 
    {   
	    gac_id String - <Foreign Key> from Group Association Table

	    if above coupon type is = Product Tag level then        
        coupon_product_tags_id List [String] <Foreign Key - Tag table> - Any logical promotion for products for the tags mentioned, eg - "easily perishable", low shelf-life... etc
  	    
          if above coupon type is = Manual Product Gp level then
            product_id = List [String] <Foreign Key - Product table>
        
        if above coupon type is = Product Group level then
            product_group_id = List [String] <Foreign Key - Product Group table>
  	    
          if above coupon type is = SSCAT level then
            product_group_id = List [String] <Foreign Key - SSCAT table>
  	    
          if above coupon type is = SCAT level then
            product_group_id = List [String] <Foreign Key - SCAT table>
  	    
          if above coupon type is = CAT level then
            product_group_id = List [String] <Foreign Key - CAT table>
  	    
          if above coupon type is = Cart level then
            no list will be required here. The offer/discount will directly apply to the cart amount.
  	    
          if above coupon type is = Payment level then
            no list will be required here. The offer/discount will directly apply to the cart amount.
    }       
    """

    type Coupon {
         _id: ID!
        "Code for a coupon"
        couponCode: String!
        "Title for a coupon"
        couponTitle: String!
        "Description for a coupon"
        couponDescription: String !
        "Image for a coupon"
        couponImage: String 
        "Amount for a coupon"
        couponAmount: Float
        "Reference coupon bo detail"
        couponBoDetail: [CouponBoDetail]
        "Reference to coupon constant type"
        couponType: CouponTypeConstant
        "Minimum order value for the coupon to be valid"
        couponMinOrderValue: Int
        "Max discount that a user can avail for this coupon"
        couponMaxDiscountAmount: Float
        "Max usage for all customers"
        couponMaxUsageOverall: Int
        "Max usage per user"
        couponMaxUsagePerUser: Int 
        # "Reference to Coupon group association"
        # couponGroupAssociation: [CouponGroupAssociation]
        "Term and Condition of a Coupon"
        couponTermsAndConditions: String
        "Flag to mark if a coupon is active"
        couponIsActive: Boolean 
        "Date from which a coupon is valid"
        couponStartDate: String
        "Date from when a coupon will be invalid"
        couponEndDate: String 
        "Creation date for a coupon"
        couponCreatedDate: String

         
    }

`;
