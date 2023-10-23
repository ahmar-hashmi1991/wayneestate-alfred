import { getCurrentLocalTime } from "../../../../utility";

export const resolvers = {
    Query: {
        getBoByID: (_, {_id}, { dataSources}) => {
           return dataSources.BoDetailDB.getBoByID({_id});
        },
        getBoByMobileNo: (_, {boMobileNumber}, {dataSources}) => {
            return dataSources.BoDetailDB.getBoByMobileNo({boMobileNumber})
        },
        countAllBo: (_, __, {dataSources}) => {
            return dataSources.BoDetailDB.countAllBo();
        },
        getAllBOs: async (_,{boMobileNumber,boFullName}, {dataSources}) => {
            return await dataSources.BoDetailDB.getAllBOs(boMobileNumber,boFullName);
        },
        getAllBOsForNewAlfred: async (_,{offset,limit}, {dataSources}) => {
            return await dataSources.BoDetailDB.getAllBOsForNewAlfred(offset,limit);
        },
        getAllFcmRegistrationTokens: async (_,__, {dataSources}) => {
            return await dataSources.BoDetailDB.getAllFcmRegistrationTokens();
        },
        getGSTDetails: async (_,{gstNumber}, {dataSources}) => {
            console.log("GST num input >> ", gstNumber);
            return await dataSources.GstAPI.getGSTDetails(gstNumber);
        },

    },
    Mutation: {
        createBoDetail: async (_, {input}, {authToken, dataSources}) => {
            
            // Since we change the input to store ID for Pincode and fetch State, Country Code  inside BoDetailDB, 
            // hence creating a deep copy in userInput.
            // let userInput = JSON.parse(JSON.stringify(input));
            // We found out - there's actually no need to send our Customer data on Uniware, hence avoiding this call.
            // let resultFromUnicom =  await dataSources.UnicomBoAPI.createBoDetail(userInput, authToken);
            //console.log(getCurrentLocalTime(), "resultFromUnicom >>", resultFromUnicom);

            let resultFromDB = await dataSources.BoDetailDB.createBoDetail(input);
            return resultFromDB;
        },
        createMultipleBO: async (_, {input}, {dataSources}) => {
            let resultFromDB = await dataSources.BoDetailDB.createMultipleBO(input);
            return resultFromDB;
        },
        updateBoDetail: async (_, {_id, input}, {authToken, dataSources}) => {

            let resultFromDB = await dataSources.BoDetailDB.updateBoDetail(_id, input)
            // Since we change the input to store ID for Pincode and fetch State, Country Code  inside BoDetailDB, 
            // hence creating a deep copy in userInput.
            // let userInput = JSON.parse(JSON.stringify(input));
            
            // If isUnicomUpdateRequired = true, we need to update it on unicom too.
            // We found out - there's actually no need to send our Customer data on Uniware, hence avoiding this call.
            // if(resultFromDB.isUnicomUpdateRequired)
            //     dataSources.UnicomBoAPI.updateBoDetail(_id, resultFromDB.userInput, resultFromDB?.initialBoDetail, authToken);
            
            // We do not wait for customer to get created pn Unicommerce (This isn't our priority). 
            return resultFromDB;
        },

        updateMultipleBoDetail: async (_, {input}, {dataSources}) => {
            let resultFromDB = await dataSources.BoDetailDB.updateMultipleBoDetail(input);
            return resultFromDB;
        },
        
        updateMultipleBusinessDetailInBoDetail: async (_, {input}, {dataSources}) => {
            let resultFromDB = await dataSources.BoDetailDB.updateMultipleBusinessDetailInBoDetail(input);
            return resultFromDB;
        },
        
        giftBizzCoin: async (_, {_id, noOfCoins}, {dataSources}) => {
            try{
                let res = await dataSources.BoDetailDB.giftBizzCoin(_id, noOfCoins);
                console.log(getCurrentLocalTime(), ": giftBizzCoin > ", res);
                if(res.acknowledged && res.modifiedCount === 1)
                    return true;
                return false;
            }
            catch(error)
            {
                console.error(getCurrentLocalTime(), ": ", error.message);
                return false;
            }
        }, 

        deductBizzCoin: async (_, {_id, noOfCoins}, {dataSources}) => {
            try{
                let res = await dataSources.BoDetailDB.deductBizzCoin(_id, noOfCoins);
                console.log(getCurrentLocalTime(), ":deductBizzCoin > ", res);
                if(res.acknowledged && res.modifiedCount === 1)
                    return true;
                return false;
            }
            catch(error)
            {
                console.error(getCurrentLocalTime(), ": ", error.message);
                return false;
            }
        }

    }
}

