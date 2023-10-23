export const resolvers = {
    Query: {
        getAllSearchKeywordsByBoID: async (_, {boDetail}, {dataSources}) => {
            return await dataSources.SearchPreferenceDB.getAllSearchKeywordsByBoID(boDetail);
        },

        getAllSearchSkusByBoID: async (_, {boDetail}, {dataSources}) => {
            return await dataSources.SearchPreferenceDB.getAllSearchSkusByBoID(boDetail);
        },

        getLastNSearchedSkusByBoID: async (_, {boDetail}, {dataSources}) => {
            return await dataSources.SearchPreferenceDB.getLastNSearchedSkusByBoID({boDetail});
        },

        getAllOrderPreferenceSkusByBoID: async (_, {boDetail}, {dataSources}) => {
            return await dataSources.OrderPreferenceDB.getAllOrderPreferenceSkusByBoID(boDetail);
        }
    },

    Mutation: {
        createOrUpdateSearchPreference: async (_, {input}, {dataSources}) => {
            let isBOPresent = await dataSources.SearchPreferenceDB.isBOPresent({input});

            if (!isBOPresent) {
                return await dataSources.SearchPreferenceDB.createSearchPreference({input});
            } else {
                return await dataSources.SearchPreferenceDB.updateSearchPreference({input});
            }
        },
        createOrUpdateOrderPreference: async (_, {input}, {dataSources}) => {
            let isBOPresent = await dataSources.OrderPreferenceDB.isBOPresent({input});

            if (!isBOPresent) {
                return await dataSources.OrderPreferenceDB.createOrderPreference({input});
            } else {
                return await dataSources.OrderPreferenceDB.updateOrderPreference({input});
            }
        }
    }
}

