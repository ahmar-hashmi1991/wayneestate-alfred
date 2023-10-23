import { BEARER, CONTENT_TYPE_HEADER_JSON_VALUE, getCurrentLocalTime } from "../../utility";
import { Singleton } from "../../resources";

import fetch from "node-fetch";
import { Order } from "../model/datasources/Order";

export const callfetchOrderAndShippmentForActiveOrders = async () => {

  let baseURL = process.env.BASE_URL;
  let endPoint = `/services/rest/v1/oms/saleorder/get`;

    try{

        const orderDB = new Order();
        let allActiveOrders = await orderDB.getAllActiveShipments();
        console.log(getCurrentLocalTime(), "Automatic Call in callfetchOrderAndShippmentForActiveOrders At Midnight - 00:00+ 2min");

        let authToken = await Singleton.getResources();
        const authorization_value = `${BEARER} ${authToken?.access_token}`;

        const multipOrderUpd = await Promise.all(allActiveOrders.map( async order => {

            let ordStatus = order.orderStatus?.toUpperCase();
            // console.log(getCurrentLocalTime(), "orderSaleOrderID >> ",order.saleOrderId, " | orderStatus >> ", ordStatus);
             
            if(order)
            {
    
                // Since facility codes are not mandatory, we don't take it in the payload
                let payload = {
                  code: order.saleOrderId,
                  //facilityCodes: facilityCodes
                }
         
            
                await fetch(baseURL+endPoint, {
                    method: 'POST',
                    headers: {
                        "Authorization": authorization_value,
                        "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
                    },
                    body: JSON.stringify(payload),
                  })
                  .then(response => response.json())
                  .then(async resultGetSaleOrder => {
                    if (resultGetSaleOrder.successful) {
                    
                        order.orderStatus = resultGetSaleOrder?.saleOrderDTO?.status;
    
                        let orderShippingPackages = [];
                        const multipShipPkgUpd = await Promise.all(resultGetSaleOrder?.saleOrderDTO?.shippingPackages.map( async shipmentDetail => {

                            /* 
                            
                            // Removing invoice detail call from below - since to use dataSources is not possible here, hence to get shippment charges from invoice,
                            // we need to make a nested API call, that isn't the right way to go about it. Plus these Shipments aren't really important since, the shippments
                            // for BOs get directly updated on "My Orders" section.  

                            // let invoiceDetail = await dataSources.UnicomOrderAPI.getInvoiceDetails(shipmentDetail.code, authToken);
                            // console.log("invoiceDetail >> ", invoiceDetail);
                            let shippingCharges = 0;
                            if (invoiceDetail.success) {
                                shippingCharges = invoiceDetail?.invoiceDetailsDTOResponse?.shippingCharges;    
                            }
                            
                            */
                            let shippmentDetails = {
                                shipmentPackageCode: shipmentDetail.code,
                                shipmentPackageType: shipmentDetail.shippingPackageType,
                                shipmentProvider: shipmentDetail.shippingProvider,
                                shipmentMethod: shipmentDetail.shippingMethod,
                                shipmentFCStatus: shipmentDetail.status, // CREATED, PICKING, PICKED, PACKED, READY TO SHIP, ADDED TO MANIFEST, DISPATCHED, SHIPPED, DELIVERED, CANCELED, RETURN EXPECTED, RETURN ACKNOWLEDGED, RETURNED
                                shipmentTrackingNumber: shipmentDetail.trackingNumber,
                                shipmentTrackingStatus: shipmentDetail.trackingStatus,
                                shipmentCourierStatus: shipmentDetail.courierStatus,
                                shipmentEstimatedWeight: shipmentDetail.estimatedWeight,
                                shipmentActualWeight: shipmentDetail.actualWeight,
                                shipmentCreatedDate: shipmentDetail.created,
                                shipmentUpdatedDate: shipmentDetail.updated,
                                shipmentDispatchedDate: shipmentDetail.dispatched,
                                shipmentDeliveredDate: shipmentDetail.delivered,
                                shipmentInvoiceCode: shipmentDetail.invoiceCode,
                                shipmentInvoiceDisplayCode: shipmentDetail.invoiceDisplayCode,
                                shipmentNoOfItems: shipmentDetail.noOfItems,
                                shipmentCollectableAmount: shipmentDetail.collectableAmount,
                                shipmentPaymentReconciled: shipmentDetail.paymentReconciled,
                                shipmentPodCode: shipmentDetail.podCode,
                                shipmentManifestCode: shipmentDetail.shippingManifestCode,
                                // shipmentShippingCharges: shippingCharges,
                                shipmentPackageItems: (Object.keys(shipmentDetail.items)).map(skuCode => {
                                    //console.log(getCurrentLocalTime(), "items >> code >> ", skuCode);
                                    return {
                                        itemSku: skuCode,
                                        itemName: shipmentDetail.items[skuCode].itemName,
                                        quantity: shipmentDetail.items[skuCode].quantity
                                    }
                                })
                            }
                            orderShippingPackages.push(shippmentDetails);    
                        }));
                        
                        order.orderShippingPackages = orderShippingPackages;
                        //console.log(getCurrentLocalTime(), " Shipment = ", orderShippingPackages[0].shipmentPackageItems);
                        let successStatusUpdResp = await orderDB.updateOrder({ _id: order._id, input: { orderShippingPackages, orderStatus: order.orderStatus  } });
                        //console.log(getCurrentLocalTime(), "Shipments updated in our DB >> ", orderShippingPackages);
                    }
                  });                
            }
            return order;
        }));
        // return multipOrderUpd;  
        console.log(getCurrentLocalTime(), "Multiple Orders were updated along with their shipments and status.");
    }
    catch(error)
    {
        console.error(getCurrentLocalTime(), ": ", "Unable to fetch and update order status and Shipments, error >> ", error);
    }   
}