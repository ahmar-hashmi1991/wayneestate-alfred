
export const resolvers = {
    Query: {
       
        // Checks and Updates Gotham for the given SKU from Uniware
        getInventorySnapshot:  (_, {skuCodes, updatedSinceInMinutes, facility }, {authToken, dataSources}) => {
            return  dataSources.UnicomInventoryAPI.getInventorySnapshot(skuCodes, updatedSinceInMinutes, facility, authToken);
        },

        // Only Checks for the SKU inventory on Uniware
        checkInventoryforSKU:  (_, {skuCodes, updatedSinceInMinutes, facility }, {authToken, dataSources}) => {
            return  dataSources.UnicomInventoryAPI.checkInventoryforSKU(skuCodes, updatedSinceInMinutes, facility, authToken);
        }
        
    },

    Mutation: {

        adjustSingleInventory:  (_, {input, facility}, {authToken, dataSources}) => {
            return  dataSources.UnicomInventoryAPI.adjustSingleInventory(input, facility, authToken);
        },

        adjustMultipleInventory:  (_, {input, facility}, {authToken, dataSources}) => {
            return  dataSources.UnicomInventoryAPI.adjustMultipleInventory(input, facility, authToken);
        }
        
    }
}

