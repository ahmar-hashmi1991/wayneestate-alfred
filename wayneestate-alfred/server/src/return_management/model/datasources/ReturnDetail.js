import { REFUND_PROCESSED, RETURN_INITIATED_CANCELLED, RETURN_INITIATED_PROCESSED, RETURN_PICKED, UNICOM_RETURN_COMPLETE, notNullAndUndefinedCheck , UNICOM_RETURN_CREATED, getCurrentLocalTime} from '../../../utility';
import { GtReturnDetail } from '../GtReturnDetail';


export class ReturnDetail {

    async  getReturnDetailById(_id) {
        return await GtReturnDetail.findOne({_id}).populate('returnInitiated').populate('transaction');
    }

    async getAllReturnDetail(limit , offset){
    let foundReturnDetails;
    
        if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){
               foundReturnDetails = await GtReturnDetail.find().sort({returnCreatedDate: -1}).skip(offset).limit(limit).populate('transaction');
    
            }else {
       
               foundReturnDetails = await GtReturnDetail.find().sort({returnCreatedDate: -1}).populate('transaction');
       
            }
        return foundReturnDetails;
    }

    async  getReturnDetailByBoNumber(boPhone) {
        return await GtReturnDetail.find({orderBoPhone: boPhone}).populate('returnInitiated').populate('transaction');
    }

    async createReturnDetail({input}){
        try{
           // console.log(getCurrentLocalTime(), "create return detail input  ", input);

           let newReturnDetailCreated = new GtReturnDetail({...input});
           let retCreated = await newReturnDetailCreated.save();

           if(!retCreated)
           throw({message: "ReturnDetail Data creation failed. Please check logs"});

           return{
               success: true,
               message:"Return Detail created successfully.",
               returnDetail: newReturnDetailCreated
            };
         }catch (error){
           // console.error(getCurrentLocalTime(), ": ", "error in update Order >> ", error);
           return {
               success: false,
               message: error?.message,
           }
       }
   }

   async updateReturnDetailWithRevPickupCodeAndStatus(_id, reversePickupCode, returnStatus) {
        try {
            // console.log(getCurrentLocalTime(), "inside update return detail with rev pickup code");
            // console.log(getCurrentLocalTime(), "returnStatus >> ", returnStatus);
            console.log(getCurrentLocalTime(), "reverse Pickup Code >> ", reversePickupCode);
            let response = await GtReturnDetail.updateOne({_id}, {$set: { reversePickupCode : reversePickupCode , returnStatus: returnStatus}});
            
            if(!response)
            throw({message: "ReturnDetail Data updation failed. Please check logs"});

            return{
                success: true,
                message:"Return Detail updated successfully.",
                // returnDetail: response
             };
             
        } catch (error) {
            return error;
        }
    }

    async cancelReturnDetail(_id)
    {
         try{
               let respRDCancelled = await GtReturnDetail.updateOne({_id}, {$set: {returnStatus: RETURN_INITIATED_CANCELLED}})
               let respRD = await GtReturnDetail.findById(_id);


               console.log(getCurrentLocalTime(), respRDCancelled);
             
                if(!respRDCancelled.acknowledged)
                    throw { message: "Return Initiated ID may not exist, please check logs."}

                 return{
                     success: true,
                     message:"Return Initiated Cancelled successfully.",
                     returnDetail: respRD
                  };
            }
            catch (error){
              // console.error(getCurrentLocalTime(), ": ", "error in update Order >> ", error);
              return {
                  success: false,
                  message: error?.message,
              }
            }
    }

    async updateReturnStatusInReturnDetails(returnRespFromUniware) {
        try {
            console.log(getCurrentLocalTime(), " Inside updateReturnStatusInReturnDetails ");
            
            let res = await Promise.all(returnRespFromUniware.map( async item => {

                let status = RETURN_INITIATED_PROCESSED;

                // In our use case, Return gets created only at Picked on WAC
                if(item.statusCode === UNICOM_RETURN_CREATED)
                    status = RETURN_PICKED
                else if(item.statusCode === UNICOM_RETURN_COMPLETE)
                    status = RETURN_INITIATED_PROCESSED

                let returnStatus = await GtReturnDetail.findOne({reversePickupCode: item.code});
                if(returnStatus !== REFUND_PROCESSED)
                    await GtReturnDetail.updateOne({reversePickupCode: item.code}, {returnStatus: RETURN_PICKED})
            }));


            return{
                message: "Return Status Update from Get Sale Order is successful.",
                success: true
            }

         
        } catch (error) {
            // console.error(getCurrentLocalTime(), ": ", "error in update Order >> ", error);
            return {
                success: false,
                message: error?.message,
            }
        }
    }

    async updateTransactionIdAndStatusInReturnDetail(_id, txnId) {
        try {
            let updateResp = await GtReturnDetail.updateOne({_id}, { $set: {transaction: txnId, returnStatus: REFUND_PROCESSED}});
            console.log(getCurrentLocalTime(), updateResp);
            return {
                message: "Transaction id updation in return detail successful.",
                success: true,
            }
        } catch (error) {
            return {
                success: false,
                message: error?.message,
            }
        }
    }

}

