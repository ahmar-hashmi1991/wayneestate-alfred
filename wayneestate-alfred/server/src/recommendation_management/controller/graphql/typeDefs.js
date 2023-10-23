import { gql} from 'apollo-server-express';

export const typeDefs = gql`
   
   extend type Query {
        "Get All search keywords for given BoId"
        getAllSearchKeywordsByBoID(boDetail:ID!): [String]
        "Get all search skus for given BoId"
        getAllSearchSkusByBoID(boDetail:ID!): [SearchSku]
        getAllOrderPreferenceSkusByBoID(boDetail:ID!): [ID]
        getLastNSearchedSkusByBoID(boDetail:ID!): [Sku]
    }

  extend type Mutation {
    "Create Search Preference"
    createOrUpdateSearchPreference(input: SearchPreferenceInput): SearchPreferenceResponse
    createOrUpdateOrderPreference(input: OrderPreferenceInput): OrderPreferenceResponse
  }

  input SearchPreferenceInput {
    boDetail: ID!
    keyword: String
    sku: ID!
  }

  input OrderPreferenceInput {
    boDetail: ID!
    sku: ID!
  }

  type SearchPreference {
    boDetail: ID!
    keywords: [String]
    skus: [SearchSku]
  }

  type OrderPreference {
    boDetail: ID!
    skus: [Sku!]!
  }

  type SearchSku {
    frequency: Int!
    sku: Sku!
    skuLastUpdatedAt: String!
  }

  type SearchPreferenceResponse {
    success: Boolean!
    message: String!
    searchPreference: SearchPreference
  }

  type OrderPreferenceResponse {
    success: Boolean!
    message: String!
    orderPreference: OrderPreference
  }
`;
