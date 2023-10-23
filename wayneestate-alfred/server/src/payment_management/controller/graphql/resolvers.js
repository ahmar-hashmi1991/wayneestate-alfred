export const resolvers = {
    Query: {
        getAllTransactions: async (_, __, { dataSources }) => {
           return dataSources.TransactionDB.getAllTransactions();
        },
        getTransactionById: async (_, {_id}, { dataSources }) => {
            return dataSources.TransactionDB.getTransactionById(_id);
        }
    },

    Mutation: {
        createTransaction: async (_, {input}, {dataSources}) => {
            return dataSources.TransactionDB.createTransaction({input});
        },

        createMultipleTransactions: async (_, {input}, {dataSources}) => {
            for (let i=0; i < input.length; i++) {
                let inp = {
                    transactionNumber: input[i].transactionNumber,
                    transactionAmount: input[i].transactionAmount,
                    transactionMode: input[i].transactionMode,
                    transactionProcessedDate: input[i].transactionProcessedDate
                };

                let resp = await dataSources.TransactionDB.createTransaction(inp);

                if (resp?.success) {
                    let respFromReturnDetail = await dataSources.ReturnDetailDB.updateTransactionIdAndStatusInReturnDetail(input[i].returnDetailID, resp?.transaction?._id);
                    
                    if (!respFromReturnDetail.success) {
                        return {
                            success: false,
                            message: "Updating transaction id in return detail failed."
                        }
                    }                
                } else {
                    return {
                        success: false,
                        message: "Create transaction failed."
                    }
                }  
            }
            return {
                success: true,
                message: "Multiple transactions created successfully with return detail updated."
            }
        },

        updateTransaction: async (_, {_id, input}, {dataSources}) => {
            return dataSources.TransactionDB.updateTransaction({_id, input});
        }
    },


}
