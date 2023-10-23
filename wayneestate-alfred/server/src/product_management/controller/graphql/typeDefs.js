import { gql} from 'apollo-server-express';


export const typeDefs = gql`

    enum weightUnits {
        kg, #Default
    }

    enum skuAttributeKey {
        Badge
    }

    # Any value entered should have _ instead of space so that Frontend can resolve it
    enum skuAttributeValue {
        Bizztm_Exclusive
        Top_Seller
        _30_Days_Return
        Limited_Stock
        Bizztm_Guarantee
    }
    
   
   extend  type Query {
        
        "Get category details using categoryId"
        getCategoryById(_id:ID!): Category
        "Get all categories"
        getAllCategories: [Category]
        "Get subCategory details using subCategoryId"
        getSubCategoryById(_id:ID!, offset:Int, limit:Int): [Sku]
        "Get all subCategories"
        getAllSubCategories: [SubCategory]

        "get all sub sub categories which belong to a subCategory. "
        getSubSubCatForSubCat(subCategory:ID!):[SubSubCategory]#
        "Get SubSubCategory details using ID"
        getSubSubCategoryById(_id:ID!, offset:Int, limit:Int): [Sku]
        "Get all subSubCategories"
        getAllSubSubCategories: [SubSubCategory]
        "Get all Sub Sub Categories for all Sub categories"
        getAllSubSubCatForAllSubCats: [AllSubSubCatForAllSubCatsResponse!]
        
        "Get product group using ID"
        getProductGroupById(_id:ID!): ProductGroup      
        "Get all product Groups"
        getAllProductGroups: [ProductGroup]
       
        "Get product details using productId"
        getProductById(_id:ID!): Product
        
        "Get all products"
        getAllProducts: [Product]

        "get Sku details using skuId"
        getSkuById(_id:ID!): Sku
        "get All skus for old alfred page and search skus using sku code and sku name"
        getSkusForAlfredSkuPage(skuCode: String, skuName: String): [Sku]
        "Get Sku details using SKU Code"
        getSkuBySkuCode(skuCode: String!): Sku
        "Get Sku Inventory quantity using ID"
        getSkuQuantityById(_id: ID!): Int
        "Get List of SKUs for a given tag id"
        getAllSkusByTagID(tag: ID!, offset: Int, limit: Int): [Sku]
        "Get all Sku's"
        getAllSkus(offset: Int, limit: Int): [Sku]
        "Get all skus with hook tag"
        getAllSkusWithHookTag(offset: Int, limit: Int): [Sku]
        "Get All SKU Codes"
        getAllSkuCodes: [String]
        "Get All Active SKU Codes"
        getAllActiveSkuCodes: [String]

        "Search SKU with name/keywords"
        searchSku(keyword: String, offset: Int, limit: Int): [Sku]
        "AutoComplete SKU Name field"
        autocompleteSku(keyword: String): [Sku]
        "Update all skus created date"

        getDifferentProductCounts: ProductCountResponse
    }


   extend type Mutation {
        
        createCategory(input: CategoryInput): CategoryResponse
        createSubCategory(input: SubCategoryInput): SubCategoryResponse
        createSubSubCategory(input: SubSubCategoryInput): SubSubCategoryResponse
        createProductGroup(input: ProductGroupInput): ProductGroupResponse
        createProduct(input: ProductInput): ProductResponse
        createSku(input: SkuInput): SkuResponse
        
        createMultiplePGs(input: [ProductGroupInput]): ProductGroupResponse
        updateMultiplePGs(input: [ProductGroupInputForUpdateOnly]): ProductGroupResponse

        createMultipleProduct(input: [ProductInput]): ProductResponse
        updateMultipleProduct(input: [ProductInputForUpdateOnly]): ProductResponse

        createMultipleSKUs(input: [SkuInput]): SkuResponse
        updateMultipleSKUs(input: [SkuInputForUpdateOnly]): SkuResponse

        updateCategory(_id: ID!, input: CategoryInput): CategoryResponse
        updateSubCategory(_id: ID!, input: SubCategoryInput): SubCategoryResponse
        updateSubSubCategory(_id: ID!, input: SubSubCategoryInput): SubSubCategoryResponse
        updateProductGroup(_id: ID!, input: ProductGroupInput): ProductGroupResponse
        updateProduct(_id: ID!, input: ProductInput): ProductResponse
        updateSku(input: SkuInputForUpdateOnly): SkuResponse

        updateSkuQuantity(skuCode: String!, quantity: Int!): SkuResponse
        updateMultipleSKUsSpecialDiscountPercentage(input: [SkuSpecialDiscountInputForUpdateOnly]): SkuResponse
        updateMultipleSKUsWithCentralOfferPrice(input: [SkuCentralOfferPriceInputForUpdateOnly]): SkuResponse
        changeSkuInventory(_id: ID, quantity: Int!): SkuResponse
    
    }


#input types
input CategoryInput {
        categoryName: String!
        categoryCode: String!
        categoryDisplayName: String
        categoryDescription: String
        categoryImages: [String]
        categoryVideos: [String] 
        "This is not a mandatory field, add only when you want to add a pre-existing subCat to this category"
        subCategory: [ID]
        categoryFlashSaleDiscountPercentage: Float
        nonServiceablePincode: [ID]
        categoryIsActive: Boolean!
    }

    input SubCategoryInput {
        subCategoryName: String!
        subCategoryDisplayName: String
        subCategoryDescription: String
        category: [ID!]!
        "This is not a mandatory field, add only when you want to add a pre-existing subSubCat to this SCAT"
        subSubCategory: [ID]
        subCategoryImages: [String]
        subCategoryVideos: [String] 
        subCategoryFlashSaleDiscountPercentage: Float
        nonServiceablePincode: [ID]
        subCategoryIsActive: Boolean!
       
    }

    input SubSubCategoryInput {
        subSubCategoryName: String!
        subSubCategoryDisplayName: String
        subSubCategoryDescription: String
        subCategory: [ID!]!
        "This is not a mandatory field, add only when you want to add a pre-existing product Group to this SSCAT"
        productGroup: [ID]
        subSubCategoryImages: [String]
        subSubCategoryVideos: [String] 
        subSubCategoryFlashSaleDiscountPercentage: Float
        nonServiceablePincode:  [ID]
        subSubCategoryIsActive: Boolean!
    }

    input ProductGroupInput {
        productGroupName: String!
        productGroupDisplayName: String
        productGroupDescription: String
        subSubCategory: [ID!]!
        "This is not a mandatory field, add only when you want to add a pre-existing product to this productGrp"
        product: [ID]
        productGroupImages: [String]
        productGroupVideos: [String] 
        productGroupFlashSaleDiscountPercentage: Float
        nonServiceablePincode:  [ID]
        productGroupIsActive: Boolean!
    }

    input ProductGroupInputForUpdateOnly {
        _id: ID!
        productGroupName: String
        productGroupDisplayName: String
        productGroupDescription: String
        subSubCategory: [ID!]
        "This is not a mandatory field, add only when you want to add a pre-existing product to this productGrp"
        product: [ID]
        productGroupImages: [String]
        productGroupVideos: [String] 
        productGroupFlashSaleDiscountPercentage: Float
        nonServiceablePincode:  [ID]
        productGroupIsActive: Boolean
    }

    input ProductAttributeInput {
        key: String
        value: [String]
    }

    input ProductInput {
        productGroup: [ID!]!
        "This is not a mandatory field, add only when you want to add a pre-existing Sku to this Product"
        sku: [ID]
        productName: String!
        productShortDescription: String
        productLongDescription: String
        productBrand: String 
        productCompany: String 
        productRank: Int
        productAttributes: [ProductAttributeInput]
        productHsnCode: String! @constraint(pattern: "((^[0-9]{6}$)|(^[0-9]{8}$))")
        productCountryOrigin: String
        productFlashSaleDiscountPercentage: Float
        nonServiceablePincode: [ID]
        productDisplayName: String
        productModel: String 
        productIsReturnEligible: Boolean
        productReturnWithinDays: Int 
        productIsExchangeEligible: Boolean
        productExchangeWithinDays: Int
        productKeywords: [String]
        productImage: String
        productVideos: [String]
        productAverageRating: Float
        productBatchGroupCode: String
        productShelfLifeinDays: Int
        productExpirable: Boolean
        productIsActive: Boolean! 
    }

    input ProductInputForUpdateOnly {
        _id: ID!
        productGroup: [ID]
        "This is not a mandatory field, add only when you want to add a pre-existing Sku to this Product"
        sku: [ID]
        productName: String
        productShortDescription: String
        productLongDescription: String
        productBrand: String 
        productCompany: String 
        productRank: Int
        productAttributes: [ProductAttributeInput]
        productHsnCode: String @constraint(pattern: "((^[0-9]{6}$)|(^[0-9]{8}$))")
        productCountryOrigin: String
        productFlashSaleDiscountPercentage: Float
        nonServiceablePincode: [ID]
        productDisplayName: String
        productModel: String 
        productIsReturnEligible: Boolean
        productReturnWithinDays: Int 
        productIsExchangeEligible: Boolean
        productExchangeWithinDays: Int
        productKeywords: [String]
        productImage: String
        productVideos: [String]
        productAverageRating: Float
        productBatchGroupCode: String
        productShelfLifeinDays: Int
        productExpirable: Boolean
        productIsActive: Boolean 
    }

    input SkuReturnDetailsInput {
        skuIsReturnEligible: Boolean,
        skuReturnWithinDays: Float,
        skuIsExchangeEligible: Boolean,
        skuExchangeWithinDays: Int
    }


    input SkuInput {
        product: ID!
        "Category Code below is only used for the purpose of creation of SKU at Uniware and is not stored at Gotham"
        categoryCode: String!
        skuCode: String!
        skuName: String!
        skuImages: [String!]!
        skuTotalBought: Int! 
        skuDescriptions: [String!]!
        skuAttribute: [SkuAttributeInput]
        skuThresholdObject: SkuThresholdObjectInput
        skuPackOf: Int
        skuInventory: Int!
        skuKeywords: [String!]
        skuWeight: Float
        skuWeightUnit: weightUnits
        skuPrice: SkuPriceInput!
        supplier: [String]
        skuFeature: [String]
        skuBreadth: Float
        skuHeight: Float
        skuLength: Float
        skuDimensionUnit: String
        packagingBreadth: Float
        packagingHeight: Float
        packagingLength: Float
        packagingDimensionUnit: String
        packagingWeight: Float
        packagingWeightUnit: String
        "Tag type constant to add Group Tags to this product"
        tag: ID!
        skuIsActive: Boolean!
        "Flag to define if the sku is having GeoAvailability"
        skuIsAreaSpecific: Boolean!
        "Reference to availability pincodes of the sku"
        skuAvailability: SkuAvailabilityInput
        skuMinOrder: Int
        skuEAN: String
        skuScanIdentifier: String
        skuReturnDetails: SkuReturnDetailsInput!
    

    }

    input SkuInputForUpdateOnly {
        product: ID
        "Category Code below is only used for the purpose of creation of SKU at Uniware and is not stored at Gotham"
        categoryCode: String
        skuCode: String!
        skuName: String
        skuImages: [String]
        skuTotalBought: Int 
        skuDescriptions: [String]
        skuAttribute: [SkuAttributeInput]
        skuThresholdObject: SkuThresholdObjectInput
        skuPackOf: Int
        skuInventory: Int
        skuKeywords: [String!]
        skuWeight: Float
        skuWeightUnit: weightUnits
        skuPrice: SkuPriceInput
        supplier: [String]
        skuFeature: [String]
        skuBreadth: Float
        skuHeight: Float
        skuLength: Float
        skuDimensionUnit: String
        packagingBreadth: Float
        packagingHeight: Float
        packagingLength: Float
        packagingDimensionUnit: String
        packagingWeight: Float
        packagingWeightUnit: String
        "Tag type constant to add Group Tags to this product"
        tag: ID
        skuIsActive: Boolean
        "Flag to define if the sku is having GeoAvailability"
        skuIsAreaSpecific: Boolean
        "Reference to availability pincodes of the sku"
        skuAvailability: SkuAvailabilityInput
        skuMinOrder: Int
        skuEAN: String
        skuScanIdentifier: String
        skuReturnDetails: SkuReturnDetailsInput
        "Field only to be used for Sku update on Uniware mostly and on Gotham"
        productBrand: String
        "Field only to be used for Sku update on Uniware mostly and on Gotham"
        productHsnCode: String @constraint(pattern: "((^[0-9]{6}$)|(^[0-9]{8}$))")
        "Field only to be used  for Sku update on Uniware mostly and on Gotham"
        productShelfLifeinDays: Int
        "Field only to be used for Sku update on Uniware mostly and on Gotham"
        productExpirable: Boolean
    }

    input SkuSpecialDiscountInputForUpdateOnly {
        skuCode: String!
        skuSpecialDiscountPercentage: Float!
    }

    input SkuCentralOfferPriceInputForUpdateOnly {
        skuCode: String!
        skuCentralOfferPrice: Float!
    }

    input SkuAttributeInput {
        key: skuAttributeKey
        value: skuAttributeValue
    }

    input SkuPriceInput {
        costPrice: Float
        boPrice: Float
        msp: Float 
        skuFlashSaleDiscountPercentage: Float
        skuSpecialDiscountPercentage: Float
        gstPercent: Float
        pincodeLevelSellingPrice: [PincodeLevelSellingPriceInput]
        boLevelSellingPrice: [BoLevelSellingPriceInput]
    }

    input PincodeLevelSellingPriceInput {
        pincode: ID
        boPrice: Float,
        skuFlashSaleDiscountPercentage: Float!
    }

    input BoLevelSellingPriceInput {
        boDetail: ID
        boPrice: Float,
        skuFlashSaleDiscountPercentage: Float
    }

    input SkuAvailabilityInput{
        isTypeBlacklist: Boolean
        pincode: [ID!]
    }

    input SkuThresholdObjectInput {
        threshold: Int
        startTime: String
        endTime: String
        startDate: String
        endDate: String
    }

    type SkuThresholdObject {
        threshold: Int
        startTime: String
        endTime: String
        startDate: String
        endDate: String        
    }

    type CategoryResponse {
        "Indicates whether the mutation was successful in Gotham"
        message: String!
        "Message from Unicommerce"
        messageFromUnicommerce: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Success message from Unicommerce"
        successUnicommerce: Boolean!
        "Newly updated sku after a successful mutation"
        category: Category
    }

    type SubCategoryResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated sub category after a successful mutation"
        subCategory: SubCategory
    }

    type SubSubCategoryResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated sub sub category after a successful mutation"
        subSubCategory: SubSubCategory
    }

    type ProductGroupResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated product group after a successful mutation"
        productGroup: ProductGroup
    }

    type ProductResponse {
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated product after a successful mutation"
        product: Product
    }


    type SkuResponse {
        "Indicates whether the mutation was successful in Gotham"
        messageFromGotham: String!
        "Message from Unicommerce"
        messageFromUnicommerce: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Success message from Unicommerce"
        successUnicommerce: Boolean!
        "Newly updated sku after a successful mutation"
        sku: Sku
    }



    type Category {
        _id: ID
        "Name for a category"
        categoryName: String
        "Code for a category"
        categoryCode: String #only 2 characters
        "Display Name for a category"
        categoryDisplayName: String
        "Description for a category"
        categoryDescription: String
        "List of images for a category"
        categoryImages: [String]
        "List of videos for a category"
        categoryVideos: [String] 
        "Flash discount percentage that is applicable on all products of a category"
        categoryFlashSaleDiscountPercentage: Float
        "List of non serviceable pincodes"
        nonServiceablePincode: [Pincode]
        "Sub Category link under this Category"
        subCategory: [SubCategory!]
        "Flag to mark if a category is active"
        categoryIsActive: Boolean
        "Last updated Date for a category"
        categoryLastUpdateDate: String
        "User that last updated a category"
        categoryLastUpdateBy: String
        "Created Date for a category"
        categoryCreatedDate: String
    }

    #for Skus to be displayed on Robin Category's page
    type AllSubSubCatForAllSubCatsResponse {
        subCat: SubCategory
        subSubCategory: [SubSubCategory]
    }

    type SubCategory {
        _id:ID
        "Name for a subCategory"
        subCategoryName: String!
        "Display Name for a sub category"
        subCategoryDisplayName: String
        "Description for a sub category"
        subCategoryDescription: String
        "Reference to the category that a sub category belongs to "
        category: [Category!]!
        "Sub Sub Categories under this Sub Category"
        subSubCategory: [SubSubCategory!]
        "List of images for a sub category"
        subCategoryImages: [String]!
        "List of videos for a sub category"
        subCategoryVideos: [String] 
        "Flash discount percentage that is applicable on all products of a sub category"
        subCategoryFlashSaleDiscountPercentage: Float
        "List of non serviceable pincodes"
        nonServiceablePincode: [Pincode]
        "Flag to mark if a sub category is active"
        subCategoryIsActive: Boolean!
        "Last updated Date for a sub category"
        subCategoryLastUpdateDate: String
        "User that last updated a sub category"
        subCategoryLastUpdateBy: String
        "Created Date for a sub category"
        subCategoryCreatedDate: String
         
         
    }



    type SubSubCategory {
        _id:ID
        "Name for a sub sub Category"
        subSubCategoryName: String!
        "Display Name for a sub sub category"
        subSubCategoryDisplayName: String
        "Description for a sub sub category"
        subSubCategoryDescription: String
        "Reference to the sub category that a sub sub category belongs to "
        subCategory: [SubCategory!]!
        "Reference to the product groups that belongs to this sub sub category "
        productGroup: [ProductGroup!]
        "List of images for a sub sub category"
        subSubCategoryImages: [String!]
        "List of videos for a sub sub category"
        subSubCategoryVideos: [String] 
        "Flash discount percentage that is applicable on all products of a sub sub category"
        subSubCategoryFlashSaleDiscountPercentage: Float
        "List of non serviceable pincodes"
        nonServiceablePincode: [Pincode]
        "Flag to mark if a sub sub category is active"
        subSubCategoryIsActive: Boolean!
        "Last updated Date for a sub sub category"
        subSubCategoryLastUpdateDate: String
        "User that last updated a sub sub category"
        subSubCategoryLastUpdateBy: String
        "Created Date for a sub sub category"
        subSubCategoryCreatedDate: String
         
         
    
    }

    type ProductGroup {
        _id:ID
        "Name for a product group"
        productGroupName: String!
        "Display Name for a product group"
        productGroupDisplayName: String
        "Description for a product group"
        productGroupDescription: String
        "Reference to the sub sub category that a product group belongs to"
        subSubCategory: [SubSubCategory!]!
        "Reference to the products that belongs to this sub sub category "
        product: [Product!]
        "List of Images for a product group"
        productGroupImages: [String!]
        "List of videos for a product group"
        productGroupVideos: [String] 
        "Flash discount percentage that is applicable on all products of a product group"
        productGroupFlashSaleDiscountPercentage: Float
        "List of non serviceable picodes for a product group"
        nonServiceablePincode:  [Pincode]
        "Flag to mark if a product group is active"
        productGroupIsActive: Boolean!
        "Last updated Date for a product group"
        productGroupLastUpdateDate: String
        "User that last updated a product group"
        productGroupLastUpdateBy: String
        "Created Date for a product group"
        productGroupCreatedDate: String
         
         

    }

    type ProductAttribute {
        "Key for a product attribute"
        key: String
        "Value for a product attribute"
        value: [String]    
    }

    type Product {
        _id:ID
        "Name of a product"
        productName: String!
        "Short description for a product"
        productShortDescription: String
        "Long description for a product"
        productLongDescription: String
        "Brand of the product"
        productBrand: String 
        "Company of a product"
        productCompany: String 
        "Ranking for a product"
        productRank: Int
        "Reference to the product attributes"
        productAttributes: [ProductAttribute]
        "HSN code for a product"
        productHsnCode: String @constraint(pattern: "((^[0-9]{6}$)|(^[0-9]{8}$))")
        "Country of Origin of product"
        productCountryOrigin: String
        "Flash discount percentage that is applicable on a product "
        productFlashSaleDiscountPercentage: Float
        "List of non serviceable pincodes"
        nonServiceablePincode: [Pincode]
        "Reference to the product groups that a product can belong to"
        productGroup: [ProductGroup!]!
        "Reference to the skus that belongs to this sub sub category "
        sku: [Sku!]
        "Display name for a product"
        productDisplayName: String
        "Model of a product"
        productModel: String 
        "Flag to mark if a product is eligible for return"
        productIsReturnEligible: Boolean
        "Number of days after delivery that a product is eligible for return"
        productReturnWithinDays: Int 
        "Flag to mark if product is exchange eligible"
        productIsExchangeEligible: Boolean
        "Number of days after delivery that a product is eligible for exchange"
        productExchangeWithinDays: Int
        "Flag to mark if a product is active"
        productIsActive: Boolean! 
        "List of keywords for a product"
        productKeywords: [String]
        "Default Image of a product"
        productImage: String! 
        "List of videos for a product"
        productVideos: [String]
        "Average Rating for a product"
        productAverageRating: Float
        "Last updated date for a product"
        productLastUpdateDate: String
        "User that last updated the product"
        productLastUpdateBy: String
        "Created date for a product"
        productCreatedDate: String
        productBatchGroupCode: String
        productShelfLifeinDays: Int
        productExpirable: Boolean
         
    }

    "Stock keeping unit , that contains all variations of a product"
    type Sku {
        _id:ID
        "Reference to a product that a sku belongs to"
        product: Product!
        "unique identifier for skus"
        skuCode: String
        "Name of the sku"
        skuName: String
        "Total number of skus bought"
        skuTotalBought: Int
        "List of images for an SKU"
        skuImages: [String!]
        "List of Detail Description at SKU level"
        skuDescriptions: [String]
        "Reference to the attributes of an sku"
        skuAttribute: [SkuAttribute]
        "Denotes number of units in this SKU"
        skuPackOf: Int
        "Inventory available of particular SKU with BizzTM"
        skuInventory: Int!
        "Keywords for the SKU Name to help users find the word"
        skuKeywords: [String!]
        "Denotes weight of the SKU items"
        skuWeight: Float
        "SKU weight unit (kilogram)"
        skuWeightUnit: weightUnits
        "Minimum order quantity required to place an order for this sku"
        skuMinOrder: Int
        skuEAN: String
        skuScanIdentifier: String
        "Reference to Sku price type for a sku"
        skuPrice: SkuPrice
        "List of suppliers that a sku has"
        supplier: [String]
        "Feature of SKU"
        skuFeature: [String]
        "SKU Breadth"
        skuBreadth: Float
        "SKU Height"
        skuHeight: Float
        "SKU Length"
        skuLength: Float
        "SKU H_B_W unit"
        skuDimensionUnit: String
        "Packaging Breadth"
        packagingBreadth: Float
        "Packaging Height"
        packagingHeight: Float
        "Packaging Length"
        packagingLength: Float
        "Packaging H_B_W unit"
        packagingDimensionUnit: String
        "Denotes weight of the packaging box"
        packagingWeight: Float
        "Packaging weight unit (gram or kilogram)"
        packagingWeightUnit: String
        "Flag to define if the sku is having GeoAvailability"
        skuIsAreaSpecific: Boolean!
        "Reference to availability pincodes of the sku"
        skuAvailability: SkuAvailability
        "Flag to mark if an sku is active"
        skuIsActive: Boolean!
        "Tag type constant to add Group Tags to this product"
        tag: TagTypeConstant
        "Return details related to the sku"
        skuReturnDetails: SkuReturnDetails
        "Threshold object of sku related to sku Capping"
        skuThresholdObject: SkuThresholdObject
        "Last updated date for a sku"
        skuLastUpdateDate: String
        "User that last updated a sku"
        skuLastUpdateBy: String
        "Creation date for a sku"
        skuCreatedDate: String
         
         
    }

    type SkuReturnDetails {
        skuIsReturnEligible: Boolean,
        skuReturnWithinDays: Float,
        skuIsExchangeEligible: Boolean,
        skuExchangeWithinDays: Int
    }

    type SkuAttribute {
        "Key for a sku attribute"
        key: skuAttributeKey
        "value for a sku attribute"
        value: skuAttributeValue
    }

    type SkuPrice {
        "Cost price of a sku"
        costPrice: Float!
        "Base selling price for a sku"
        boPrice: Float!
        "Label price for a sku"
        msp: Float 
        "Tax Amount payable for a sku"
        gstPercent: Float
        "Deal/Flash Sale Percentage for a SKU"
        skuFlashSaleDiscountPercentage: Float
        "Special Discount Percentage"
        skuSpecialDiscountPercentage: Float
        "Referemce to the Pincode level selling price for a sku"
        pincodeLevelSellingPrice: [PincodeLevelSellingPrice]
        "Reference to bo level selling price for a sku"
        boLevelSellingPrice: [BoLevelSellingPrice]
    }

    type PincodeLevelSellingPrice {
        "Reference to a pincode"
        pincode: Pincode!
        "Selling price associated with a pincode"
        boPrice: Float!,
        skuFlashSaleDiscountPercentage: Float!
         
    }


    type BoLevelSellingPrice {
        "Reference to a businesss owner"
        boDetail: BoDetail!
        "Selling price for a business owner"
        boPrice: Float!,
        skuFlashSaleDiscountPercentage: Float!
         
         
    }

    type SkuAvailability{
        isTypeBlacklist: Boolean!
        pincode: [ID!]
    }

    type ProductCountResponse {
        categoryCount: Int
        productCount: Int
        productGroupCount: Int
        skuCount: Int
        subCategoryCount: Int
        subSubCategoryCount: Int    
    }

`;
