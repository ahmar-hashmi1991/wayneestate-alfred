import { gql} from "apollo-server-express";

export const typeDefs = gql`


extend type Query {
    "Get Consumer details of a with id"
    getConsumerByID(_id: ID!): Consumer! 
    "get all consumers"
    getAllConsumers: [Consumer] 
}

extend type Mutation {
    createConsumer(input: ConsumerInput) : ConsumerResponse
    updateConsumer(_id: ID!, input: ConsumerInput): ConsumerResponse
    createOrUpdateConsumer(input: ConsumerInput) : ConsumerResponse
 }



 input ConsumerInput {
    consumerName: String
    consumerPhoneNumber: String
    consumerBoLinked: [ID]
    consumerIsAppInstalled: Boolean    
}

 type ConsumerResponse {
       
        
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated business owner after a successful mutation"
        consumer: Consumer
    }


type Consumer {
    _id: ID!
    "Name of the consumer"
    consumerName: String
    "Phone number of the consumer"
    consumerPhoneNumber: String
    "Id of the business owner that this consumer is linked to"
    consumerBoLinked: [BoDetail]
    "Flag to mark if a consumer has installed the app"
    consumerIsAppInstalled: Boolean
    "cretion date of this consumer"
    consumerCreatedDate: String
    "Last updated date of this consumer"
    consumerUpdatedDate: String
}


`;