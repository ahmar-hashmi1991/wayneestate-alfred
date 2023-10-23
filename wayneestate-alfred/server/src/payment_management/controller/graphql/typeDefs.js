import { gql} from 'apollo-server-express';

export const typeDefs = gql`


   extend type Query {
        getAllTransactions: [Transaction]
        getTransactionById(_id: ID!): Transaction
    }


# Need to create resolvers for this
 extend type Mutation {
        createTransaction(input: TransactionInput): TransactionResponse
        updateTransaction(input: TransactionInput): TransactionResponse    
        createMultipleTransactions(input: [TransactionInput]): TransactionResponse    
    }

# Input 

    input TransactionInput {
        returnDetailID: ID!
        transactionNumber: String # UTR No
        transactionAmount: Float
        transactionMode: String # ENUM - CASH, UPI
        transactionProcessedDate: String
    }

    type TransactionResponse {
        success: Boolean!
        message: String!
        transaction: Transaction
    }

    type Transaction {
        transactionNumber: String # UTR No
        transactionAmount: Float
        transactionMode: String # ENUM - CASH, UPI
        transactionInitiatedDate: String
        transactionProcessedDate: String
    }
`; 
