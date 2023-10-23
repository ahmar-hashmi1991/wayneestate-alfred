import { typeDefs as serviceabilityTypeDefs} from './serviceability_management/controller/graphql/typeDefs';
import { resolvers  as serviceabilityResolvers} from './serviceability_management/controller/graphql/resolvers';

//user management schema 
import { typeDefs as userTypeDefs} from './user_management/bo_management/controller/graphql/typeDefs';
import { resolvers  as userResolvers} from './user_management/bo_management/controller/graphql/resolvers';
import { typeDefs as consumerTypeDefs } from './user_management/consumer_management/controller/graphql/typeDefs';
import { resolvers as consumerResolvers } from './user_management/consumer_management/controller/graphql/resolvers';

//promotions schema 
import { typeDefs as promotionTypeDefs} from './promotion_management/controller/graphql/typeDefs';
import { resolvers  as promotionResolvers} from './promotion_management/controller/graphql/resolvers';

//reward management schema
import { typeDefs as rewardTypeDefs} from './reward_management/controller/graphql/typeDefs';
import { resolvers as rewardResolvers } from './reward_management/controller/graphql/resolvers';

//static content schema 

import { typeDefs as staticContentTypeDefs} from './static_content_management/controller/graphql/typeDefs';
import { resolvers  as staticContentResolvers} from './static_content_management/controller/graphql/resolvers';

//product schema

import { typeDefs as productTypeDefs} from './product_management/controller/graphql/typeDefs';
import { resolvers  as productResolvers} from './product_management/controller/graphql/resolvers';

//order schema 

import { typeDefs as orderTypeDefs} from './order_management/controller/graphql/typeDefs';
import { resolvers  as orderResolvers} from './order_management/controller/graphql/resolvers';

//feedback schema 

import { typeDefs as feedbackTypeDefs} from './feedback_review_faq_management/controller/graphql/typeDefs';
import { resolvers  as feedbackResolvers} from './feedback_review_faq_management/controller/graphql/resolvers';

//cartWishlist schema 

import { typeDefs as cartWishlistTypeDefs} from './cart_wishlist_management/controller/graphql/typeDefs';
import { resolvers  as cartWishlistResolvers} from './cart_wishlist_management/controller/graphql/resolvers';


//inventory schema 
import { typeDefs as inventoryTypeDefs} from './inventory_management/controller/graphql/typeDefs';
import { resolvers  as inventoryResolvers} from './inventory_management/controller/graphql/resolvers';

//return schema 

import { typeDefs as returnTypeDefs} from './return_management/controller/graphql/typeDefs';
import { resolvers  as returnResolvers} from './return_management/controller/graphql/resolvers';

//payment schema 

import { typeDefs as paymentTypeDefs} from './payment_management/controller/graphql/typeDefs';
import { resolvers  as paymentResolvers} from './payment_management/controller/graphql/resolvers';

//recommendation schema
import { typeDefs as recommendationTypeDefs } from './recommendation_management/controller/graphql/typeDefs';
import { resolvers as recommendationResolvers } from './recommendation_management/controller/graphql/resolvers';

import { gql } from 'apollo-server-express';
import { merge } from 'lodash';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive';

import  { GraphQLScalarType, Kind } from  'graphql';

import { Country } from './serviceability_management/model/datasources/Country';
import { Pincode } from './serviceability_management/model/datasources/Pincode';
import { State } from './serviceability_management/model/datasources/State';
import { Banner } from './promotion_management/model/datasources/Banner';
import { Coupon } from './promotion_management/model/datasources/Coupon';
import { CouponTypeConstant } from './static_content_management/model/datasources/CouponTypeConstant';
import { GroupAssociationConstant } from './static_content_management/model/datasources/GroupAssociationConstant';
import { KycTypeConstant } from './static_content_management/model/datasources/KycTypeConstant';
import { LanguageTypeConstant } from './static_content_management/model/datasources/LanguageTypeConstant';
import { PushNotificationTypeConstant } from './static_content_management/model/datasources/PushNotificationTypeConstant';
import { StatusTypeConstant } from './static_content_management/model/datasources/StatusTypeConstant';
import { TagTypeConstant } from './static_content_management/model/datasources/TagTypeConstant';
import { Faq } from './feedback_review_faq_management/model/datasources/Faq';
import { ReturnReasonTypeConstant } from './static_content_management/model/datasources/ReturnReasonTypeConstant';

import { CartWishlist } from './cart_wishlist_management/model/datasources/CartWishlist';

import { Bizzcoin } from './reward_management/model/datasources/Bizzcoin';

import { Category } from './product_management/model/datasources/Category';
import { SubCategory } from './product_management/model/datasources/SubCategory';
import { SubSubCategory } from './product_management/model/datasources/SubSubCategory';
import { ProductGroup } from './product_management/model/datasources/ProductGroup';
import { Product } from './product_management/model/datasources/Product';
import { Sku } from './product_management/model/datasources/Sku';
import { UnicomAPI as UnicomProductAPI} from './product_management/model/datasources/UnicomAPI';


import { BoDetail } from './user_management/bo_management/model/datasources/BoDetail';
import { UnicomAPI as UnicomBoAPI} from './user_management/bo_management/model/datasources/UnicomAPI';
import { GstAPI } from './user_management/bo_management/model/datasources/GstAPI';

import { UnicomAPI as UnicomOrderAPI} from './order_management/model/datasources/UnicomAPI';
import { Order } from './order_management/model/datasources/Order';

import { Consumer } from './user_management/consumer_management/model/datasources/Consumer';


import { ReturnInitiated } from './return_management/model/datasources/ReturnInitiated';
import { ReturnItem } from './return_management/model/datasources/ReturnItem';
import { ReturnDetail } from './return_management/model/datasources/ReturnDetail';
import { UnicomAPI as UnicomReturnAPI} from './return_management/model/datasources/UnicomAPI';

import {UnicomAPI as UnicomInventoryAPI } from './inventory_management/model/datasources/UnicomAPI';

import { Singleton } from './resources';

import { Transaction } from './payment_management/model/datasources/Transaction';

import { SearchPreference } from './recommendation_management/model/datasources/SearchPreference';
import { OrderPreference } from './recommendation_management/model/datasources/OrderPreference';
import { getCurrentLocalTime } from './utility';

export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  }
});

const QueryMutation = gql`

    "All Queries for can be found in here"
    type Query {
        "A type cannot be empty hence this root 'param', we can ignore this for real-world usecases"
        zRoot: String
    }


    # Need to create resolvers for this
    type Mutation {
        "A type cannot be empty hence this root 'param', we can ignore this for real-world usecases"
         zRoot: String
    }
`

export const schema = makeExecutableSchema({
    typeDefs: [constraintDirectiveTypeDefs, QueryMutation, serviceabilityTypeDefs, userTypeDefs, promotionTypeDefs, staticContentTypeDefs, orderTypeDefs ,productTypeDefs, feedbackTypeDefs, cartWishlistTypeDefs,consumerTypeDefs , rewardTypeDefs, inventoryTypeDefs, returnTypeDefs, paymentTypeDefs, recommendationTypeDefs ],
    resolvers: merge(serviceabilityResolvers,userResolvers, promotionResolvers, staticContentResolvers, orderResolvers, productResolvers, feedbackResolvers, cartWishlistResolvers, consumerResolvers , rewardResolvers, inventoryResolvers, returnResolvers, paymentResolvers, recommendationResolvers),
});

export const context = async ({req}) => 
{
    //You can fetch the request from here as well, since we are not using, hence commented.
    //console.log(getCurrentLocalTime(), "Request Express JS >> ", req);
    let authToken;
    let firebaseAdmin;
      try{
          authToken = await Singleton.getResources();
          firebaseAdmin = await Singleton.getFirebaseAdmin();
          //console.log(getCurrentLocalTime(), authToken);
      }
      catch(error)
      {
        console.error(getCurrentLocalTime(), ": ", getCurrentLocalTime(), " : ", error.message);
      }  
      return {authToken: authToken, firebaseAdmin: firebaseAdmin};
};
export const dataSources = () =>  {
  return {
    //User Management
    BoDetailDB: new BoDetail(),
    UnicomBoAPI: new UnicomBoAPI(),
    ConsumerDB: new Consumer(),
    GstAPI: new GstAPI(),

    //Serviceability Management
    CountryDB: new Country(),
    PincodeDB: new Pincode(),
    StateDB: new State(),
    
    //Promotions Management
    BannerDB: new Banner(),
    CouponDB: new Coupon(),
    
    //Static Constant Management
    CouponTypeConstantDB: new CouponTypeConstant(),
    GroupAssociationConstantDB: new GroupAssociationConstant(), 
    KycTypeConstantDB: new KycTypeConstant(),
    LanguageTypeConstantDB: new LanguageTypeConstant(), 
    PushNotificationTypeConstantDB: new PushNotificationTypeConstant(), 
    StatusTypeConstantDB: new StatusTypeConstant(),
    TagTypeConstantDB: new TagTypeConstant(),
    FaqDB: new Faq(),
    ReturnReasonTypeConstantDB: new ReturnReasonTypeConstant(),
    
    //Order Management
    OrderDB: new Order(),
    UnicomOrderAPI: new UnicomOrderAPI(),
    
    //Cart Wishlist Management
    CartWishlistDB: new CartWishlist(),
    
    //Product Management
    CategoryDB: new Category(),
    SubCategoryDB: new SubCategory(),
    SubSubCategoryDB: new SubSubCategory(),
    ProductGroupDB: new ProductGroup(),
    ProductDB: new Product(),
    SkuDB: new Sku(),
    UnicomProductAPI: new UnicomProductAPI(),
    
    //Reward Management 
    BizzcoinDB: new Bizzcoin(),

    //Inventory Management
    UnicomInventoryAPI: new UnicomInventoryAPI(),

    //Return Management
    ReturnInitiatedDB: new ReturnInitiated(),
    ReturnItemDB: new ReturnItem(),
    ReturnDetailDB: new ReturnDetail(),
    UnicomReturnAPI: new UnicomReturnAPI(),

    //Payment Management
    TransactionDB: new Transaction(),

    //Recommendation Management
    SearchPreferenceDB: new SearchPreference(),
    OrderPreferenceDB: new OrderPreference()
  }
}




