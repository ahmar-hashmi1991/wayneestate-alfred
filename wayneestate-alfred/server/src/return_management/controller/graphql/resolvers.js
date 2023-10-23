import { RETURN_INITIATED_CANCELLED, RETURN_INITIATED_PROCESSED, RETURN_TYPE_WITHOUT_PICKUP, getCurrentLocalTime , RETURN_PICKED } from "../../../utility";
import { GtReturnDetail } from "../../model/GtReturnDetail";



export const resolvers = {
    Query: {
        getReturnInitiatedById: async (_, {_id}, {dataSources}) => {
            return await dataSources.ReturnInitiatedDB.getReturnInitiatedById({_id});
        },
        getAllReturnInitiated: async (_, {returnInitiatedStatus}, {dataSources}) => {
            return await dataSources.ReturnInitiatedDB.getAllReturnInitiated(returnInitiatedStatus);
        },
        getAllReturnInitiatedForNewAlfred: async (_, {offset,limit}, {dataSources}) => {
            return await dataSources.ReturnInitiatedDB.getAllReturnInitiatedForNewAlfred(offset,limit);
        },
        getReturnDetailById: async (_, {_id}, {dataSources}) => {
            return await dataSources.ReturnDetailDB.getReturnDetailById({_id});
        },
        getAllReturnDetail: async (_, {limit, offset}, {dataSources}) => {
            return await dataSources.ReturnDetailDB.getAllReturnDetail(limit,offset);
        },
        getAllReturnInitiatedsByBoNumber: async (_, {orderBoPhone}, {dataSources}) => {
            let returnInitiatedIds = await dataSources.OrderDB.getAllReturnInitiatedIdsOfOrdersByBoPhone(orderBoPhone);
            return await dataSources.ReturnInitiatedDB.populateReturnInitiatedFromIds(returnInitiatedIds);
        },
        getReturnDetailByBoNumber: async (_, {boPhone}, {dataSources}) => {
            return await dataSources.ReturnDetailDB.getReturnDetailByBoNumber(boPhone);
        },
    },

    Mutation: {
    
        createReturnInitiated: async (_, {input}, {dataSources}) => {
            return await dataSources.ReturnInitiatedDB.createReturnInitiated({input});
        },
        createReturnItem: (_, {input}, {dataSources}) => {
            return dataSources.ReturnItemDB.createReturnItem({input});
        },
        createReturnInitiatedAndItem: async (_, {input}, {dataSources}) => {
            let resp =  await dataSources.ReturnItemDB.createReturnInitiatedAndItem({input});
            if(resp.success)
            {
                let respOrderUpd = await dataSources.OrderDB.updateShippingPackageWithReturnInitiated(input.order, input.shipmentPackageCode, resp.returnInitiated._id)
                // console.log(getCurrentLocalTime(), "respOrderUpd >> ", respOrderUpd);

                if(respOrderUpd.success)
                {
                    return {
                        success: true,
                        message: "Return is successfully Initiated.",
                    }; 
                }
            }
        },

        // createReturnDetail: async (_, {input}, {dataSources, authToken}) => {
        //     let resp = await dataSources.ReturnDetailDB.createReturnDetail({input});
        //     // console.log(getCurrentLocalTime(), "resp >> ", resp);
        //     if(resp.success)
        //     {
        //         // add message from uniware, and from gotham in response
        //         let uniwareResp = await dataSources.UnicomReturnAPI.createReversePickup(input, authToken);
                
        //         if (uniwareResp.success) {

        //             let updateRevPickupCode = await dataSources.ReturnDetailDB.updateReturnDetailWithRevPickupCodeAndStatus(input._id, uniwareResp.reversePickupCode);
                    
        //             if (updateRevPickupCode) {
        //                 return {
        //                     messageFromGotham: "Return Detail is successfully Created.",
        //                     messageFromUniware: "Reverse pickup created successfully",
        //                     uniwareResp: uniwareResp
        //                 };
        //             }
        //         } else {
        //             return {
        //                 message: "Call to uniware unsuccessful",
        //                 success: false
        //             }
        //         }
        //     } else {
        //         return {
        //             message: "Call to gotham unsuccessful",
        //             success: false
        //         }
        //     }
        // },

        createReturnDetailAndUpdateItem: async (_, {input}, {dataSources, authToken}) => {
            
            try{

                let resp = await dataSources.ReturnItemDB.updateReturnItem(input);
                
                if(!resp.success)
                    throw { message: "Upating Return Items failed, please check with the tech team"};
                
                let respCRD = await dataSources.ReturnDetailDB.createReturnDetail({input});
                if(!respCRD.success)
                     throw { message: "Create Return Detail failed, please check with the tech team"};

                // console.log(getCurrentLocalTime(), "return Detail created >> ", respCRD.returnDetail);

                let respFromRIStatusUpdate = await dataSources.ReturnInitiatedDB.updateReturnInitiatedStatusAndReturnDetail(input.returnInitiated, RETURN_INITIATED_PROCESSED, respCRD.returnDetail._id);
                console.log(getCurrentLocalTime(), "Update Reverse >> ", respFromRIStatusUpdate);
                
                if(!respFromRIStatusUpdate.success)
                    throw { message: "Upating Return Initiated Status failed, please check with the tech team"};

                if(input.returnType === RETURN_TYPE_WITHOUT_PICKUP)
                {
                    let uniwareResp = await dataSources.UnicomReturnAPI.createReversePickup(input, authToken);
                    console.log(getCurrentLocalTime(), "uniware Resp >> ", uniwareResp);
                    
                    if (!uniwareResp.success)
                        throw uniwareResp
                   
                    // add message from uniware, and from gotham in response
                    let updateRevPickupCode = await dataSources.ReturnDetailDB.updateReturnDetailWithRevPickupCodeAndStatus(respCRD.returnDetail._id, uniwareResp.reversePickupCode, RETURN_INITIATED_PROCESSED);
                    if (!updateRevPickupCode.success)
                        throw { message: "Upating Return Detail with Reverse Pickup Code failed, please check with the tech team"};
                }

                return {
                    messageFromGotham: "Return Detail is successfully Created.",
                    messageFromUniware: "Reverse pickup created successfully",
                    success: true,
                };
               
                
            }
            catch(error)
            {
                return {
                    messageFromGotham: "Return Detail process failed. ",
                    messageFromUniware: (error?.message) ? error?.message : "Reverse pickup failed",
                    success: false,
                } 
            }

           
        },

        createReversePickup: async (_, {input, _id}, {dataSources, authToken}) => {

            try{

                // Need to update items - just in case, there was a change in the items collected, we need to update back the item.
                let respURI = await dataSources.ReturnItemDB.updateReturnItem(input);
                if (!respURI.success) 
                    throw { message: "Upating Return Items with Changed Quantities on Pickup failed, please check with the tech team"};
                
                let uniwareResp = await dataSources.UnicomReturnAPI.createReversePickup(input, authToken);
                if (!uniwareResp.success)
                    throw uniwareResp
               
                // add message from uniware, and from gotham in response
                // console.log(getCurrentLocalTime(), "ID from CRP for Return Detail >> ", _id);
                let updateRevPickupCode = await dataSources.ReturnDetailDB.updateReturnDetailWithRevPickupCodeAndStatus(_id, uniwareResp.reversePickupCode, input.returnStatus);
                if (!updateRevPickupCode.success) 
                    throw { message: "Upating Return Detail with Reverse Pickup Code failed, please check with the tech team"};
                    
                
                return {
                    messageFromGotham: "Return Detail is successfully Created.",
                    messageFromUniware: "Reverse pickup created successfully",
                    success: true,
                };
            }

            catch(error)
            {
                return {
                    messageFromGotham: "Return Detail process failed. ",
                    messageFromUniware: (error?.message) ? error?.message : "Reverse pickup failed",
                    success: false,
                } 
            }

        },

        changeReturnInitiatedStatus: async (_, {_id, returnInitiatedStatus}, {dataSources}) => {
            try{
                let cancelRIResp = await dataSources.ReturnInitiatedDB.changeReturnInitiatedStatus(_id, returnInitiatedStatus);
                if (!cancelRIResp.success)
                    throw cancelRIResp
                return cancelRIResp;
            }
            catch(error)
            {
                return {
                    message: (error?.message) ? error?.message : "changeReturnInitiatedStatus failed",
                    success: false,
                } 
            }
        },

        cancelReturnDetail: async (_, {_id}, {dataSources, authToken}) => {

            try{
                let cancelRDResp = await dataSources.ReturnDetailDB.cancelReturnDetail(_id);

                // let retDetail = await GtReturnDetail.findById(_id);
                // let retInitID = retDetail.returnInitiated;
                // let reversePickupCode = retDetail?.reversePickupCode;

                // let cancRIResp = await dataSources.ReturnInitiatedDB.changeReturnInitiatedStatus(retInitID, RETURN_INITIATED_CANCELLED);

                // if (!cancelRDResp.success)
                //     throw cancelRDResp
                
                // if(!cancRIResp.success)
                //     throw { message: "Return Initiated Cancellation failed, check with Tech Team."};
                
                // console.log(getCurrentLocalTime(), cancelRDResp.returnDetail);
                // // if there's a reverse pickup code in Return Detail, then cancel on Uniware too
                // if(cancelRDResp.returnDetail.reversePickupCode)
                // {
                //     let cancelReversePickupResp = await dataSources.UnicomReturnAPI.cancelReversePickup(reversePickupCode, authToken);      
                    
                //     if(!cancelReversePickupResp.successful)   
                //     {
                //         return {
                //             messageFromGotham: "Return Cancellation is successful.",
                //             messageFromUniware: (cancelReversePickupResp?.errors?.length) ? (cancelReversePickupResp?.errors[0]?.message) : "Reverse pickup Cancelled on Uniware Failed",
                //             success: false,
                //         };
                //     }

                //     return {
                //         messageFromGotham: "Return Cancelled successfull",
                //         messageFromUniware: "Reverse pickup Cancelled on Uniware successfully",
                //         success: true,
                //     }
                // }

                let retDetail = await dataSources.ReturnDetailDB.getReturnDetailById(_id);
                const retInitID = retDetail.returnInitiated;

                let retDetResp = await dataSources.ReturnInitiatedDB.getRetDatailFromRetInit(retInitID);
                let nonCancelledRetDetail = retDetResp?.returnDetail?.filter(retDetail => retDetail.returnStatus !== RETURN_INITIATED_CANCELLED)
                if(!nonCancelledRetDetail || nonCancelledRetDetail.length===0)
                {
                     let cancRIResp = await dataSources.ReturnInitiatedDB.changeReturnInitiatedStatus(retInitID, RETURN_INITIATED_CANCELLED);
                     if(!cancRIResp.success)
                        throw { message: "Return Initiated Cancellation failed, check with Tech Team."};
                }

                return {
                        messageFromGotham: cancelRDResp.message,
                        messageFromUniware: "Reverse pickup wasn't created on Uniware, so no cancellation required.",
                        success: true,
                };
            }
            catch(error)
            {
                return {
                    messageFromGotham: (error?.message) ? error?.message : "CancelReturnDetail failed",
                    messageFromUniware: "Reverse pickup Cancelled on Uniware Failed",
                    success: false,
                } 
            }
        },

        updateTransactionIdInReturnDetail: async (_, {_id, txnId}, {dataSources}) => {
            try {
                let updateTxnIdInRD = await dataSources.ReturnDetailDB.updateTransactionIdAndStatusInReturnDetail(_id, txnId);
                if (updateTxnIdInRD) {
                    return {
                        message: "Update transaction id successful.",
                        success: true
                    }
                }
            } catch (error) {
                return {
                    message: (error?.message) ? error?.message : "updateTransactionIdInReturnDetail failed",
                    success: false,
                }
            }
        }
    }
}

