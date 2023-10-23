import { getCurrentLocalTime, PARTICULARS_FESTIVE_BONANZA, TRANSACTION_TYPE_CREDIT } from "../../../utility";

export const resolvers = {
    Query: {
       
        getBizzcoinById: (_, {_id}, {dataSources}) => {
            return dataSources.BizzcoinDB.getBizzcoinById({_id})
        },
        getAllBizzcoins: (_, __, {dataSources}) => {
            return dataSources.BizzcoinDB.getAllBizzcoins()
        },
        getBizzcoinByBoId: (_,{_id}, {dataSources}) => {
            return dataSources.BizzcoinDB.getBizzcoinByBoId({_id})
        },
        
    },

    Mutation: {

        createBizzcoin: async (_, {input}, {dataSources}) => {
            return await dataSources.BizzcoinDB.createBizzcoin({input});
            // if (resp.success) {
            //     if (input.bizzcoinType === TRANSACTION_TYPE_DEBIT) {
            //         const _ = await dataSources.BoDetailDB.deductBizzCoin(input.boDetail, input.bizzcoinAmount);
            //     } else if (input.bizzcoinType === TRANSACTION_TYPE_CREDIT) {
            //         const _ = await dataSources.BoDetailDB.giftBizzCoin(input.boDetail, input.bizzcoinAmount);
            //     }
            // }

            // return resp;
        },

        createMultipleBizzcoin: async(_, {input}, {dataSources}) => {
            try {
                for (let i=0; i<input?.length; ++i) {
                    const resp = await dataSources.BoDetailDB.getBoByMobileNo({ boMobileNumber: input[i].boMobileNumber });
                    if (resp.success) {
                        let inp = {
                            bizzcoinAmount: input[i].noOfCoins,
                            bizzcoinType: TRANSACTION_TYPE_CREDIT,
                            boDetail: resp.boDetail?._id,
                            bizzcoinParticulars: PARTICULARS_FESTIVE_BONANZA
                        };
                        // console.log("inp >> ", inp);
                        const resp2 = await dataSources.BizzcoinDB.createBizzcoin({input: inp});
                        if (resp2.success === false) {
                            console.log("Bizzcoin creation failed for BO with mobile number " + input[i].boMobileNumber);
                            // return {
                            //     success: false,
                            //     message: "Bizzcoin creation failed for BO with mobile number " + input[i].boMobileNumber
                            // }
                        }
                    } else {
                        console.log("No BO found with mobile number " + input[i].boMobileNumber);
                        // return {
                        //     success: false,
                        //     message: "No BO found with mobile number " + input[i].boMobileNumber
                        // };
                    }                
                }
                return {
                    success: true,
                    message: "All Bizzcoins created successfully."
                };                
            } catch (error) {
                console.error(getCurrentLocalTime(), ": ", error.message);
                return {
                    success: false,
                    message: error.message
                }                                
            }
        },
        updateBizzcoin: (_, {_id,input}, {dataSources}) => {
            return dataSources.BizzcoinDB.updateBizzcoin({_id,input});
        }
        
    }
}

