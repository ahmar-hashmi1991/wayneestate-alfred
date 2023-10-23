import { RESTDataSource } from 'apollo-datasource-rest';
import { CONTENT_TYPE_HEADER_JSON_VALUE, BEARER, ALFREDCHANNEL, CURRENCY_CODE, TRANXN_NOTE, NOTIF_EMAIL, ADD_REF_BILL, ADD_REF_SHIP, ZERO, SHIP_METHOD_CODE, CHANNEL_PROD_ID, PAYMENT_METHOD_COD, PAYMENT_METHOD_OTHER, FORCEALLOCATE_VALUE, CONTENT_TYPE_HEADER_PDF_VALUE, SALE_ORDER_ID_PREFIX, getCurrentLocalTime, RETURN_INITIATED_PROCESSED, RETURN_INITIATED_CANCELLED } from '../../../utility';
import { GtOrder } from '../../../order_management/model/GtOrder';
import { GtReturnReasonTypeConstant } from '../../../static_content_management/model/GtReturnReasonTypeConstant';

export class UnicomAPI extends RESTDataSource {
  constructor() {
    super();
    //console.log(getCurrentLocalTime(), "Hi this is constructor");
      this.baseURL = process.env.BASE_URL;
  }

  async createReversePickup(input, authToken){
                  console.log(getCurrentLocalTime(), "input for reverse pickup >> ", input);

                  let orderId = input.reversePickup?.orderID;
                  let shipmentPackageCode = input.reversePickup?.shipmentPackageCode;
                  let returnInitiatedId = input.returnInitiated;
                  let returnType = input.returnType;

                  let authorization_value = BEARER + " " + authToken?.access_token;
                  let endPoint = `/services/rest/v1/oms/reversePickup/create`;
                  let unicomReversePickItems = [];

                  let order = await GtOrder.findById({_id: orderId}).populate({
                    path: 'orderShippingPackages.returnInitiated',
                    populate: {
                      path: 'returnItem',
                      populate: {
                        path: 'sku'
                      }
                    }
                  });
                
                  /*order = await GtOrder.populate(order, {
                    path: 'orderShippingPackages.returnInitiated.returnItem.returnItemReason',
                    // populate: {
                    //   path: 'returnItem',
                    //   populate: {
                    //     path: 'returnItemReason'
                    //   }
                    // }    
                  });*/

                  // console.log(getCurrentLocalTime(), "order >> ", order);
                
                  let saleOrderId = order.saleOrderId;
                
                  // console.log(getCurrentLocalTime(), "order >> ", order);
                
                  let index = order?.orderShippingPackages?.findIndex(shipPackage => shipPackage.shipmentPackageCode === shipmentPackageCode);
                  // console.log(getCurrentLocalTime(), " index >> ", index);
                
                  let shipPackage = order.orderShippingPackages[index];
                
                  console.log(getCurrentLocalTime(), "shipPackage return item initiated >> ", shipPackage.returnInitiated[0]);
                
                  let otherReturnInitiateds = shipPackage?.returnInitiated?.filter(x => ((x._id.toString() !== returnInitiatedId) && (x.returnInitiatedStatus === RETURN_INITIATED_PROCESSED || (x.returnInitiatedStatus === RETURN_INITIATED_CANCELLED))));
                  console.log(getCurrentLocalTime(), "otherReturnInitiateds >> ", otherReturnInitiateds);
                
                  console.log(getCurrentLocalTime(), "passed returnInitiated >> ", returnInitiatedId);
                
                  let returnInitiatedIndexInShipPackage = shipPackage?.returnInitiated?.findIndex(x => x._id.toString() === returnInitiatedId);
                  console.log(getCurrentLocalTime(), "index >> ", returnInitiatedIndexInShipPackage);
                
                  let returnInitiatedInShipPackage = shipPackage?.returnInitiated[returnInitiatedIndexInShipPackage];
                  console.log(getCurrentLocalTime(), "value >> ", returnInitiatedInShipPackage);
                
                  let skuMapping = new Object();
                
                  for (let i=0; i<otherReturnInitiateds?.length; i++) {
                    let returnItems = otherReturnInitiateds[i].returnItem;
                    for (let j=0; j<returnItems?.length; j++) {
                      let returnItem = returnItems[j];
                      console.log(getCurrentLocalTime(), "\n return item >> ", returnItem);
                      if (!skuMapping[returnItem?.sku?.skuCode]) {
                        skuMapping[returnItem.sku.skuCode] = returnItem.returnItemApprovedQuantity || 0;
                      } else {
                        skuMapping[returnItem.sku.skuCode] += returnItem.returnItemApprovedQuantity || 0;
                      }
                    }
                  }
                  
                  console.log(getCurrentLocalTime(), "\n SKU MAPPING >> ", skuMapping);
                  for (let i = 0; i < returnInitiatedInShipPackage?.returnItem?.length; i++) {
                    let returnItem = returnInitiatedInShipPackage.returnItem[i];
                   
                    console.log(getCurrentLocalTime(), "\n Return types >> ", returnItem.returnType, " >> ", returnType);
                    if (returnItem.returnType === returnType) {
                      let currApprovedQty = returnItem.returnItemApprovedQuantity;
                      let approvedQuantity = skuMapping[returnItem.sku.skuCode] || 0;
                      console.log(getCurrentLocalTime(), " currApprovedQty + approvedQuantity >> ", currApprovedQty, " + ", approvedQuantity);
                      // console.log(getCurrentLocalTime(), " Return item >> ", returnItem);
  
                      let reasonID = returnItem.returnItemReason;
                      let reasonIDObj = await GtReturnReasonTypeConstant.findById(reasonID);
                      // let pkgItemIndex = order.orderShippingPackages.shipmentPackageItems.findIndex(packageItem => packageItem.itemSku === returnItem.sku.skuCode);
                      // let totalQuantity = order.orderShippingPackages.shipmentPackageItems[pkgItemIndex].quantity;
                      // console.log(getCurrentLocalTime(), "return item reason description >> ", reasonIDObj.reasonDescription);
  
                      for (let j = approvedQuantity; j < approvedQuantity + currApprovedQty; j++) {
                            let unicomSaleOrderItem = {
                              saleOrderItemCode: `${returnItem.sku.skuCode}-${j}`, // SKU code + Quantity item
                              reason: reasonIDObj.reasonDescription
                            }
                              unicomReversePickItems.push(unicomSaleOrderItem);
                      }
                    }
                  }

                  if (unicomReversePickItems.length === 0)
                  {
                    return {
                        success: false,
                        message: "No return items found for given return type.",
                      }
                  }
                                  
                  let payload = {
                      "saleOrderCode": saleOrderId,
                      "reversePickItems": unicomReversePickItems,
                      "actionCode": returnType
                  }
                
                  console.log(getCurrentLocalTime(), "payload  " , payload);
                
                  let createReversePickup =  await this.post(endPoint, payload, {
                    headers: {
                      "Authorization": authorization_value,
                      "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
                    }
                  });

                  //create return from front end  - done
                  //confirm hashmap function- done
                  //make request to db for all return items - done
                  //update mutation to take id - done
                  //get reverse pickup code from response - done 
                  //update db post request - Pending
                
                
                  try {
                    const response = await createReversePickup;
                    console.log(getCurrentLocalTime(), "Response from Uniware >> ", response);
                  
                    if(!response.successful) {
                      throw response;
                    }

                    return {
                      success: true,
                      message: "Return created Successfully",
                      reversePickupCode: response.reversePickupCode
                    };
                  } catch (error) {
                    console.log(getCurrentLocalTime(), "error from catch >> ", error);
                    return {
                      success: false,
                      message:(error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
                    };
                  }
                
  }


async cancelReversePickup(reversePickupCode, authToken){
  // console.log(getCurrentLocalTime(), "input for reverse pickup >> ", input);


  let authorization_value = BEARER + " " + authToken?.access_token;
  let endPoint = `/services/rest/v1/oms/reversePickup/cancel`;

  let payload = {
      "reversePickupCode": reversePickupCode,
  }
  
  //create return from front end  - done
  //confirm hashmap function- done
  //make request to db for all return items - done
  //update mutation to take id - done
  //get reverse pickup code from response - done 
  //update db post request - Pending


  try {
        let cancelReversePickupResp =  await this.post(endPoint, payload, {
          headers: {
            "Authorization": authorization_value,
            "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
          }
        });
        //console.log(getCurrentLocalTime(), "Response from Uniware >> ", response);
        if(!cancelReversePickupResp.successful)        
            throw cancelReversePickupResp;
            
         return cancelReversePickupResp;
      } 
      catch (error) {
        console.log(getCurrentLocalTime(), "error from catch >> ", error);
        return {
          success: false,
          message:(error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
        };
      }

}
}


