import { gql} from 'apollo-server-express';


export const typeDefs = gql`
   
enum TransactionType {
    DEBIT
    CREDIT
}

enum Particular {
    HOME 
    LOGIN
    SIGNUP
    ORDER_PLACED
    NAVRATRI_OFFER
    FESTIVE_BONANZA
}

   extend type Query {
    
        "Get BizzCoin details using BizzCoinId"                
        getBizzcoinById(_id:ID!): Bizzcoin
        "Get all BizzCoins for a business owner using boDetailId"
        getBizzcoinByBoId(_id:ID!) : [Bizzcoin]
        "Get all BizzCoins"
        getAllBizzcoins: [Bizzcoin]
      
    }


  extend type Mutation {
        
        createBizzcoin(input: BizzcoinInput): BizzcoinResponse

        createMultipleBizzcoin(input: [BizzcoinBoMobileNumberInput]): BizzcoinResponse
        
        updateBizzcoin(_id:ID!,input: BizzcoinInput): BizzcoinResponse
        
    }

    input BizzcoinBoMobileNumberInput {
        boMobileNumber: String
        noOfCoins: Int
    }

    input BizzcoinInput {
        bizzcoinAmount: Float
        bizzcoinType: TransactionType 
        boDetail: ID
        orderId: ID
        bizzcoinParticulars: Particular
        
    }


    type BizzcoinResponse {
       
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated banner after a successful mutation"
        bizzcoin: Bizzcoin
    }


    type Bizzcoin {
         _id: ID!
        "Bizzcoins amount debited or credited for a transaction"
        bizzcoinAmount: Float 
        "Debit or Credit"
        bizzcoinType: String 
        "Reference to the user that this transaction belongs to"
        boDetail: ID
        "Reference to a order that bizzcoins were used for"
        orderId: ID
        "Details regarding the transaction, what action caused the transaction to occur"
        bizzcoinParticulars: String
        "Creation date for a entry in the ledger"
        bizzcoinCreatedDate: String

    }

`;
