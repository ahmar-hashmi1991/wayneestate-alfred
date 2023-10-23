import { getCurrentLocalTime } from "../../../utility";

export const resolvers = {
    Query: {
        getCountryDetailByName: (_, {countryName}, {dataSources}) => {
            return dataSources.CountryDB.getCountry(countryName);
        },
        getStateDetailByName: (_, {stateName}, {dataSources}) => {
            return dataSources.StateDB.getState(stateName);
        },
        getPincodeDetailByPincode: (_, {pincode}, {dataSources}) => {
            return dataSources.PincodeDB.getPincode(pincode);
        },

        getAllServiceableCountries: (_, {countryIsServiceable}, {dataSources}) => {
            return dataSources.CountryDB.getAllServiceableCountries(countryIsServiceable)
        },
        getAllServiceableStates: (_, {stateIsServiceable}, {dataSources}) => {
            return dataSources.StateDB.getAllServiceableStates(stateIsServiceable)
        },
        getAllServiceablePincodes: (_, {pincodeIsServiceable}, {dataSources}) => {
            return dataSources.PincodeDB.getAllServiceablePincodes(pincodeIsServiceable);
        },
        getAllPincodes: async(_, {offset,limit}, {dataSources}) => {
            return await dataSources.PincodeDB.getAllPincodes(offset,limit);
        }

    },
    Mutation: {
        // create and update queries in MongoDB do not go through datasource right now, hence we are not using MongoDataSource subclass
        createCountry: (_, {input}, {dataSources}) => {
            console.log(getCurrentLocalTime(), 'Inside resolver createCountry ', dataSources.CountryDB);
            return dataSources.CountryDB.createCountry({input});   
        },
        updateCountry: (_, {countryName, input}, {dataSources}) => {
            return dataSources.CountryDB.updateCountry({countryName, input})
        },

        createState: (_, {input}, {dataSources}) => {
            return dataSources.StateDB.createState({input});
        },
        updateState:(_, {stateName, input}, {dataSources}) => {
            return dataSources.StateDB.updateState({stateName, input})
        },

        createPincode: (_, {input}, {dataSources}) => {
            return dataSources.PincodeDB.createPincode({input});
        },
        updatePincode: (_, {pincode, input}, {dataSources}) => {
            return dataSources.PincodeDB.updatePincode({pincode, input});
        },
        deletePincodeById: (_, {_id}, {dataSources}) => {
            return dataSources.PincodeDB.deletePincodeById({_id});
        }

    }
}

