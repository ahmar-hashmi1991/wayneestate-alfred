import { gql} from 'apollo-server-express';

export const typeDefs = gql`

    
   extend type Query {

        "Query to get cart wishlist of by id"
        getCartWishlistById(_id: ID!): CartWishlist!
        "Get cart wishilist by business owner id"
        getCartWishlistByBo(_id: ID!): CartWishlist
        "Get All cart wishlist"
        getAllCartWishlist: [CartWishlist!]
    }


    # Need to create resolvers for this
    extend type Mutation {
        createCartWishlist(input: CartWishlistInput): CartWishlistResponse
        updateCartWishlistByBoID(boID: ID!, input: CartWishlistInput): CartWishlistResponse
        emptyCartWishlist(boID: ID!): CartWishlistResponse
        addCwCartItemByBoID(boID: ID!, input: CartItemInput): CartWishlistResponse
        addCwWishlistItemByBoID(boID: ID!, input: WishlistItemInput): CartWishlistResponse
        addCwNotifyMeItemByBoID(boID: ID!, input: NotifyMeItemInput): CartWishlistResponse
        "Remove One Item from Cart"
        deleteSkuFromCart(boID: ID!, skuID: ID!): CartWishlistResponse
        "Remove One Item from WishList"
        deleteSkuFromWishlist(boID: ID!, skuID: ID!): CartWishlistResponse
        "Remove One Item from Notify me"
        deleteSkuFromNotifyMe(boID: ID!, skuID: ID!): CartWishlistResponse
    }

    #Inputs


    input CartWishlistInput {
        boDetail: ID
        cwWishlistItems : [WishlistItemInput]
        cwCartItems: [CartItemInput]
        cwNotifyMeItems : [NotifyMeItemInput]
    }

    
    input WishlistItemInput {
        sku: ID
        
    }


    input CartItemInput {
        sku: ID
        quantity: Int
        
    }

    input NotifyMeItemInput {
        sku: ID
        quantity: Int
    }

    type CartWishlistResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated track after a successful mutation"
        cartWishlist: CartWishlist
    }    

    "Cart is used to store products that a user wants to purchase. Wishlist items are also stored in the same type, but the products here have lesser buying intent that cart items and can be purchased some time in the future"
    type CartWishlist {
        _id: ID!
        "Reference to the business owner that this cartWishlist belongs to"
        boDetail:  BoDetail!
        "List of wishlist items"
        cwWishlistItems : [WishlistItem!]
        "List of cart items that a user has added"
        cwCartItems: [CartItem!]
        "List of items that are out of stock and the user wants to be notified when the sku comes back in stock"
        cwNotifyMeItems : [NotifyMeItem!]
        "Created Date for a cartWishlist"
        cwCreatedDate: String
        "Last Date when any field was modified for a cartWishlist"
        cwLastUpdateDate: String
        

    }

    "Wishlist items store specific data regarding each item that a user wants to purchase in the future "
    type WishlistItem {

        "Reference to a sku"
        sku: Sku!
         
         

    }

    "Individual items of a cart that contais specific data regarding each item"
    type CartItem {
    
        "Reference to a sku"
        sku: Sku!
        quantity: Int
        remaining: Int
        
        
         
    }

    "Items that are out of stock and the user/bo wants to be notified when the sku comes back in stock"
    type NotifyMeItem {
 
        "Reference to a sku"
        sku: Sku!
        "Quantity that a user wants to buy and be notified about"
        quantity: Int!
         
         

    }


`;

