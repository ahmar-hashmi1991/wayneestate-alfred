import { RETURN_INITIATED_REQUESTED , getCurrentLocalTime} from '../../../utility';
import { GtReturnInitiated } from '../GtReturnInitiated';
import { GtReturnItem } from '../GtReturnItem';

export class ReturnItem {

   async createReturnItem({input}){
    try{
       
        let newReturnItem = new GtReturnItem({...input});
        await newReturnItem.save()
 
        return{
            success: true,
            message:"Return Item created successfully."
         };
      }catch (error){
        // console.error(getCurrentLocalTime(), ": ", "error in update Order >> ", error);
        return {
            success: false,
            message: error?.message,
        }
    }
 
   }

   async updateReturnItem(input){
    
    
    let inpItems = input.returnItemsUpdate;
    console.log(getCurrentLocalTime(), "input >> ", inpItems);

    try{    
            inpItems.map(async item => {
                      
                              await GtReturnItem.updateOne({_id: item._id}, {$set: {
                                returnItemReason: item.returnItemReason,
                                returnRejectQuantityReason: item.returnRejectQuantityReason,
                                returnItemApprovedQuantity: item.returnItemApprovedQuantity,
                                returnItemIsProcessed: item.returnItemIsProcessed,
                                returnType: item.returnType

                            }});
                   }); 
               
    
            return{
                success: true,
                message:"Return Items update successfully."
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

   async createReturnInitiatedAndItem({input}){
    try{
       
        
        if(input?.returnItem && input.returnItem.length)
        {
            let result = await GtReturnItem.insertMany(input.returnItem);
//          console.log(getCurrentLocalTime(), result);
            let retItemIds =  result.map(rItem => rItem._id);

            let newReturnInitiated = new GtReturnInitiated({
                shipmentPackageCode: input.shipmentPackageCode,
                order: input.order,
                returnInitiatedTotalRequestedRefund: input.returnInitiatedTotalRequestedRefund,
                returnItem: retItemIds,
                returnInitiatedStatus: RETURN_INITIATED_REQUESTED,
                returnInitiatedLastUpdatedBy: -1,
             });
            
            let retInitiated = await newReturnInitiated.save();
            
            if(!retInitiated)
                 throw({message: "ReturnInitiated Data creation failed. Please check logs"})

                 
            return{
               success: true,
               message:"Return Item created successfully.",
               returnInitiated: retInitiated
            };



           
        }
      }catch (error){
        // console.error(getCurrentLocalTime(), ": ", "error in update Order >> ", error);
        return {
            success: false,
            message: error?.message,
        }
    }
 
   }

}

