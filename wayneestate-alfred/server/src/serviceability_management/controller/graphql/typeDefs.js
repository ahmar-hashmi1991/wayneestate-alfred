import { gql } from "apollo-server-express";

export const typeDefs = gql`

  extend type Query {
        
        "Get Country for a given id"
        getCountryById(id: ID!): Country!
        "Get State for a given id"        
        getStateById(id: ID!): State!
        "Get Pincode for a given id"
        getPincodeById(id: ID!): Pincode!


        "Get country details by country name"
        getCountryDetailByName(countryName: String!): Country
        "Get state details by state name"
        getStateDetailByName(stateName: String!) : State
        "Get all pincode detail by pincode"
        getPincodeDetailByPincode(pincode: Int!): Pincode
        
        
        "Get All serviceable countries"
        getAllServiceableCountries(countryIsServiceable: Boolean!): [Country!]
        "Get All serviceable states"
        getAllServiceableStates(stateIsServiceable: Boolean!): [State!]
        "Get all serviceable pincodes"
        getAllServiceablePincodes(pincodeIsServiceable: Boolean!): [Pincode]

        "Get All pincodes irrespective of serviceability"
        getAllPincodes(offset: Int, limit: Int): [Pincode]    
    }

        
    extend type Mutation {
        
        createCountry(input: CountryInput): CountryServiceabilityResponse
        createState(input: StateInput): StateServiceabilityResponse
        createPincode(input: PincodeInput): PincodeServiceabilityResponse

        updateCountry(countryName: String!, input: CountryUpdateInput!): CountryServiceabilityResponse   
        updateState(stateName: String!, input: StateUpdateInput!): StateServiceabilityResponse   
        updatePincode(pincode: Int!, input: PincodeUpdateInput): PincodeServiceabilityResponse   
        
        deletePincodeById(_id: ID!): PincodeServiceabilityResponse
    }

    "Input type to create a new Country document"
    input CountryInput {
        countryName: String!
        countryIsoCode: [String!]!
        countryDialingCode: [Int!]!
        countryRegionName: String!
        countryCapitalCity: String!
        countryCurrency: String
        countryCurrencySymbol: String
        countryPrimaryLanguage: String
        countryIsServiceable: Boolean!
    }

    "Input type to create a new State document"
    input StateInput {
        stateName: String!
        country: ID!
        stateGSTCode: String
        stateISO2Code: String!
        stateCapitalCity: String
        statePrimaryLanguage: String
        stateIsUT: Boolean
        stateIsServiceable: Boolean!
    }

    "Input type to create a new Pincode document"
    input PincodeInput {
        pincode: Int! 
        pincodeDistrict: String!
        pincodeRegion: String!
        state: ID!
        pincodeIsServiceable: Boolean!  
    }

    "Input type to update a new Country document"
    input CountryUpdateInput {
        countryName: String
        countryIsoCode: [String!]
        countryDialingCode: [Int!]
        countryRegionName: String
        countryCapitalCity: String
        countryCurrency: String
        countryCurrencySymbol: String
        countryPrimaryLanguage: String
        countryIsServiceable: Boolean
    }

    "Input type to update a new State document"
    input StateUpdateInput {
        stateName: String
        country: ID
        stateGSTCode: String
        stateISO2Code: String
        stateCapitalCity: String
        statePrimaryLanguage: String
        stateIsUT: Boolean
        stateIsServiceable: Boolean
    }

    "Input type to update a new Pincode document"
    input PincodeUpdateInput {
        pincode: Int
        pincodeDistrict: String
        pincodeRegion: String
        state: ID
        pincodeIsServiceable: Boolean  
        pincodeUpdatedDate: String
        pincodeCreatedDate: String
    }

    type CountryServiceabilityResponse {    
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated track after a successful mutation"
        country: Country
    }

    type StateServiceabilityResponse {
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated track after a successful mutation"
        state: State
    }

    type PincodeServiceabilityResponse {
        "Indicates whether the mutation was successful"
        message: String!
        "Human-readable message for the UI"
        success: Boolean!
        "Newly updated track after a successful mutation"
        pincode: Pincode
    }

    " A country is a place to look for all data specific to a country"
    type Country {
        "Primary Key"
        _id: ID!
        "Display name of the country, Choose to display simpler names like 'India' instead of 'Republic of India'"
        countryName: String!
        "A country might have more than one ISO code, hence the list"
        countryIsoCode: [String!]!
        "A country might have more than one Dialing Code, hence the list"
        countryDialingCode: [Int!]! 
        "Region name for a country, like Asia Pacific is for India"
        countryRegionName: String!
        "Capital city of a country"
        countryCapitalCity: String!
        "Main currency of a country "
        countryCurrency: String
        "Currency symbol for a countries currency"
        countryCurrencySymbol: String
        "Primary language for the country, this is relavent to the app language "
        countryPrimaryLanguage: String
        "Flag for marking serviceability in the country"
        countryIsServiceable: Boolean!
    }

    " A state is a place to look for all data specific to a state"
    type State {
        "Primary Key"
        _id: ID!
        "A reference to the country of a state"
        country: Country!
        "Name of the state"
        stateName: String!
        "Goods and service tax code for a state"
        stateGSTCode: String!
        "ISO2_Code for all states - Take up from Unicommerce"
        stateISO2Code: String!
        "Capital city of a state"
        stateCapitalCity: String!
        "Primary language of a state"
        statePrimaryLanguage: String
        "Indicates if a state is a union territory or not"
        stateIsUT: Boolean!
        "Flag for marking serviceability in this state"
        stateIsServiceable: Boolean!
    }

    " A pincode is a place to look for all data specific to a pincode"
    type Pincode {
        "Primary Key"
        _id: ID!
        "Pincode number"
        pincode: Int!
        "District of a pincode which can be a list"   
        pincodeDistrict: String!
        "Region of a pincode which can be a list"
        pincodeRegion: String!
        "Reference to the State that a pincode belongs to"
        state: State!
        "Flag for marking serviceability in this pincode"
        pincodeIsServiceable: Boolean!
        "Date at which Pincode was created"
        pincodeCreatedDate: String!
        "Date at which Pincode was updated"
        pincodeUpdatedDate: String!
    }
    `;
