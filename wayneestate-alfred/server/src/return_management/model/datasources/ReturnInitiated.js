import { RETURN_INITIATED_CANCELLED, RETURN_INITIATED_REQUESTED , notNullAndUndefinedCheck , getCurrentLocalTime} from '../../../utility';
import { GtReturnInitiated } from '../GtReturnInitiated';

export class ReturnInitiated {

    async  getReturnInitiatedById(_id) {
        return GtReturnInitiated.findOne({_id}).populate('order').populate('returnDetail').populate({
            path: 'returnItem',
            populate: ({
                path: 'sku',
                populate: ({
                    path: 'product',
                    populate: {
                        path: 'productGroup'
                    }
                })
            })        
        });
    }

    // populate return reason in this
    async getAllReturnInitiated(returnInitiatedStatus) {
        let foundOrders = await GtReturnInitiated.find({returnInitiatedStatus});
        
        if (foundOrders.length > 0) {
            foundOrders = await GtReturnInitiated.find({returnInitiatedStatus}).sort({returnInitiatedCreatedDate: -1})
            .populate('order').populate('returnDetail').populate({
                path: 'returnItem',
                populate: [{
                    path: 'sku',
                    select: ['skuCode', 'skuName', '_id']
                }, {
                    path: 'returnItemReason',
                    select: ['reasonDescription']
                }]
            });
            console.log(getCurrentLocalTime(), foundOrders[0].returnItem);
        }

        return foundOrders;
    }

      
      async getAllReturnInitiatedForNewAlfred(offset,limit) {
       
        let foundReturns;
          //When frontend sends a request with both offset and limit we send a response with pagination.
          if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){
            
            foundReturns = await GtReturnInitiated.find({}).sort({returnInitiatedCreatedDate: -1}).skip(offset).limit(limit)
            .populate({
                path:'order',
                populate: 'boDetail'
            }).populate('returnDetail').populate({
                path: 'returnItem',
                populate: [{
                    path: 'sku',
                    select: ['skuCode', 'skuName', '_id']
                }, {
                    path: 'returnItemReason',
                    select: ['reasonDescription']
                }]
            })

          } else {
            //Response without pagination
            foundReturns = await GtReturnInitiated.find({}).sort({returnInitiatedCreatedDate: -1})
            .populate({
                path:'order',
                populate: 'boDetail'
            }).populate('returnDetail').populate({
                path: 'returnItem',
                populate: [{
                    path: 'sku',
                    select: ['skuCode', 'skuName', '_id']
                }, {
                    path: 'returnItemReason',
                    select: ['reasonDescription']
                }]

            })
        }
        
        console.log(getCurrentLocalTime(), foundReturns[0].returnItem);
        return foundReturns;
    }

    async populateReturnInitiatedFromIds(returnInitiatedIds) {        
        return await GtReturnInitiated.find({
            '_id': { $in : returnInitiatedIds}
        }).populate('order');
    }

    async createReturnInitiated({input}){
        try{
           console.log(getCurrentLocalTime(), "create return initiated input  ", input);
           let newReturnInitiated = new GtReturnInitiated({...input});
           await newReturnInitiated.save()

           return{
               success: true,
               message:"Return Initiated Detail created successfully.",
               returnInitiated: newReturnInitiated
            };
         }catch (error){
           // console.error(getCurrentLocalTime(), ": ", "error in update Order >> ", error);
           return {
               success: false,
               message: error?.message,
           }
       }
   }

   async updateReturnInitiatedStatusAndReturnDetail(returnInitiated, status, details){
        try{
               let resp = await GtReturnInitiated.updateOne({_id: returnInitiated}, {$set: {returnInitiatedStatus: status}, $addToSet: {returnDetail: details }})
               //console.log(getCurrentLocalTime(), " updateReturnInitiatedStatusAndReturnDetail Resp >> ", resp);
           if(!resp.acknowledged)
               throw { message: "Return Initiated ID may not exist, please check logs."}
          return{
              success: true,
              message:"Return Initiated Detail status updated successfully.",
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

    async changeReturnInitiatedStatus(retInitID, returnInitiatedStatus)
    {
        try{
               console.log(getCurrentLocalTime(), "retInitID >> ", retInitID, " >> ", returnInitiatedStatus);
               let resp = await GtReturnInitiated.updateOne({_id: retInitID}, {$set: {returnInitiatedStatus: returnInitiatedStatus}})
               console.log(getCurrentLocalTime(), " updateReturnInitiatedStatusAndReturnDetail Resp here >> ", resp);

                if(!resp.acknowledged)
                    throw { message: "Return Initiated ID may not exist, please check logs."}

                 return{
                     success: true,
                     message:"Return Initiated Cancelled successfully.",
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

    async getRetDatailFromRetInit(retInitID)
    {
        try 
        {
            console.log(getCurrentLocalTime(), "retInitID >> ", retInitID);
            let resp = await GtReturnInitiated.findById({_id: retInitID}).populate('returnDetail');
            
             if(!resp)
                 throw { message: "Return Initiated ID may not exist, please check."}

              return{
                  success: true,
                  message:"Return Initiated Cancelled successfully.",
                  returnDetail: resp.returnDetail
               };
        } catch (error) {
            return {
                success: false,
                message: error?.message,
            }
        }
    }

    
}

