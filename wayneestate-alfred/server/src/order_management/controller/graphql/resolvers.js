import { async } from "regenerator-runtime";
import { getMillisecondsToNext5Min, ORDER_STATUS_PROCESSING, ORDER_STATUS_FAILED, ORDER_STATUS_CREATED, FORCEALLOCATE_VALUE, CANCEL_ORDER_MESSAGE, SHIPMENT_UPDATED_MESSAGE, SHIPMENT_CANNOT_UPDATE_MESSAGE, CONUSMER_APP_INSTALLED_VALUE, TRANSACTION_TYPE_DEBIT, PARTICULARS_ORDER_PLACED, UPDATED_SINCE_IN_MINUTES_ONE_DAY_VALUE, ORDER_STATUS_FAILED_AT_UNICOM, ORDER_STATUS_FAILED_AT_UNICOM_MESSAGE, ORDER_STATUS_CANCELLED, ORDER_STATUS_CREATED_AT_UNICOME_MESSAGE, BIZZCOIN_5_CUST_AMOUNT, TRANSACTION_TYPE_CREDIT, PARTICULARS_5_COSTOMERS_TAGGED, BIZZCOIN_USED_AT_ORDER_AMOUNT, ORDER_STATUS_COMPLETED, getCurrentLocalTime, SHIPMENT_STATUS_DELIVERED, SHIPMENT_STATUS_RETURNED, ROBINCHANNEL, EPSILON, notNullAndUndefinedCheck, SHIPMENT_PAYMENT_STATUS_UNPAID, ORDER_PAYMENT_STATUS_UNPAID, ORDER_PAYMENT_STATUS_COMPLETELY_PAID } from "../../../utility";
export const resolvers = {
    Query: {
        getOrderById: async (_, { _id }, { dataSources }) => {
            let order = await dataSources.OrderDB.getOrderById({ _id });
            // console.log(getCurrentLocalTime(), "getOrderById >> ", order);
            return order;
        },
        getAllOrdersByBoId: async (_, { offset ,limit ,_id }, { dataSources, authToken }) => {
            
            let foundOrders = await dataSources.OrderDB.getAllOrdersByBoId({_id},offset, limit);
            // console.log("Founded Orders >> ", foundOrders);

        try{
            const multipOrderUpd = await Promise.all(foundOrders.map( async order => {

                let ordStatus = order.orderStatus?.toUpperCase();
                // console.log(getCurrentLocalTime(), "OrderSOID >> ",order.saleOrderId, "orderStatus >> ", ordStatus);
                 
                if(ordStatus && !(ordStatus === (ORDER_STATUS_CANCELLED)) && !(ordStatus === (ORDER_STATUS_FAILED)))
                {
                    // console.log("order input >> ", order);
                    // console.log(getCurrentLocalTime(), "Inside If for Order >> ");
                    let nonDeliveredShipments = order?.orderShippingPackages?.filter( shipment => (shipment.shipmentFCStatus!== SHIPMENT_STATUS_DELIVERED || shipment.shipmentFCStatus!== SHIPMENT_STATUS_RETURNED));
                    if(nonDeliveredShipments && nonDeliveredShipments.length)
                    {
                         // console.log(getCurrentLocalTime(), "Inside If for non Delivered >> ");
                         // console.log("sale order id >> ", order.saleOrderId);
                        let resultGetSaleOrder = await dataSources.UnicomOrderAPI.getSaleOrder({ code: order.saleOrderId}, authToken);
                         // console.log(getCurrentLocalTime(), ": ResultGetSaleOrder from API getSaleOrder Call in getAllOrdersByBoId >> ", resultGetSaleOrder);
        
                        if (resultGetSaleOrder.successful) {
                            order.orderStatus = resultGetSaleOrder?.saleOrderDTO?.status;
                            let orderShippingPackages = [];

                            let retFromUniw = resultGetSaleOrder?.saleOrderDTO?.returns;

                           const multipShipPkgUpd = await Promise.all(resultGetSaleOrder?.saleOrderDTO?.shippingPackages?.map( async (shipmentDetail, index) => {
                                let invoiceDetail = await dataSources.UnicomOrderAPI.getInvoiceDetails(shipmentDetail.code, authToken);
                                let shipmentAttributes =  await dataSources.UnicomOrderAPI.getShippingPackageDetails({ shippingPackageCode: shipmentDetail.code }, authToken);
                                
                                let shippingCharges = 0;
                                let invoiceCreatedDate;
                                let actualWeight;
                                let shipmentBoxWidth; 
                                let shipmentBoxHeight;
                                let shipmentBoxLength;
                                if (invoiceDetail.success) {
                                    shippingCharges = invoiceDetail?.invoiceDetailsDTOResponse?.shippingCharges;
                                    invoiceCreatedDate = invoiceDetail?.invoiceDetailsDTOResponse?.created;    
                                }    

                                if (shipmentAttributes.success) {
                                    actualWeight = shipmentAttributes?.shippingPackageDetailDTO?.actualWeight;                                
                                    shipmentBoxWidth = shipmentAttributes?.shippingPackageDetailDTO?.boxWidth;
                                    shipmentBoxHeight = shipmentAttributes?.shippingPackageDetailDTO?.boxHeight;
                                    shipmentBoxLength = shipmentAttributes?.shippingPackageDetailDTO?.boxLength;
                                }    
                

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
                                    shipmentActualWeight: actualWeight,
                                    shipmentBoxWidth : shipmentBoxWidth,
                                    shipmentBoxHeight : shipmentBoxHeight,
                                    shipmentBoxLength : shipmentBoxLength,
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
                                    shipmentShippingCharges: shippingCharges,
                                    shipmentInvoiceCreatedDate: invoiceCreatedDate,
                                    shipmentPackageItems: (Object.keys(shipmentDetail.items)).map(skuCode => {
                                        return {
                                            itemSku: skuCode,
                                            itemName: shipmentDetail.items[skuCode].itemName,
                                            quantity: shipmentDetail.items[skuCode].quantity
                                        }
                                    }),
                                    returnInitiated: order?.orderShippingPackages && order.orderShippingPackages[index]?.returnInitiated,
                                }                           
                                orderShippingPackages.push(shippmentDetails);
                                return shipmentDetail;
                            }));
                            order.orderShippingPackages = orderShippingPackages;
                            
                            if (retFromUniw) {
                                let retUpdResp = await dataSources.ReturnDetailDB.updateReturnStatusInReturnDetails(retFromUniw);
                            }
                            //console.log(getCurrentLocalTime(), retUpdResp);

                            // console.log(getCurrentLocalTime(), " Shipment = ", orderShippingPackages);
                            let successStatusUpdResp = await dataSources.OrderDB.updateOrder({ _id: order._id, input: { orderShippingPackages, orderStatus: order.orderStatus  } });
                            //console.log(getCurrentLocalTime(), "Shipments updated in our DB >> ", orderShippingPackages)
                        }
                    }
                    
                }
                return order;
            }));
            return multipOrderUpd;  
        }
        catch(error)
        {
            console.error(getCurrentLocalTime(), ": Error >> ", error);
            return {
            success: false,
            message: SHIPMENT_CANNOT_UPDATE_MESSAGE,
            }
        }
        // let resultGetSaleOrder = await dataSources.UnicomOrderAPI.getSaleOrder({ code: saleOrderID, facilityCodes: facilityCodes }, authToken);
        },
        getTodaysOrdersForBoId: async (_, { offset, limit, _id}, { dataSources, authToken}) => {
            return await dataSources.OrderDB.getTodaysOrdersForBoId({_id},offset, limit);
        },
        getAllOrders: async (_, {offset,limit}, { dataSources }) => {
            let resGetAllOrders =  await dataSources.OrderDB.getAllOrders(offset,limit);
            // console.log(getCurrentLocalTime(), "ResGetAllOrders >> ", resGetAllOrders);
            return resGetAllOrders;
        },
        getSaleOrder: async (_, { _id, saleOrderID, facilityCodes }, { authToken, dataSources }) => {
            let resultGetSaleOrder = await dataSources.UnicomOrderAPI.getSaleOrder({ code: saleOrderID, facilityCodes: facilityCodes }, authToken);

            console.log(getCurrentLocalTime(), ": Inside getSaleOrder Call");

            if (resultGetSaleOrder.successful) {
                let orderShippingPackages = [];
                
                const multipSaleOrderUpd = await Promise.all(resultGetSaleOrder?.saleOrderDTO?.shippingPackages.map( async shipmentDetail => {
                    let invoiceDetail = await dataSources.UnicomOrderAPI.getInvoiceDetails(shipmentDetail.code, authToken);
                    console.log("invoiceDetail >> ", invoiceDetail);
                    let shippingCharges = 0;
                    if (invoiceDetail.success) {
                        shippingCharges = invoiceDetail?.invoiceDetailsDTOResponse?.shippingCharges;    
                    }
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
                        shipmentShippingCharges: shippingCharges,
                        shipmentPackageItems: (Object.keys(shipmentDetail.items)).map(skuCode => {
                            return {
                                itemSku: skuCode,
                                itemName: shipmentDetail.items[skuCode].itemName,
                                quantity: shipmentDetail.items[skuCode].quantity
                            }
                        })
                    }
                    orderShippingPackages.push(shippmentDetails);
                }));

                //console.log(getCurrentLocalTime(), " Shipment = ", orderShippingPackages);
                let successStatusUpdResp = await dataSources.OrderDB.updateOrder({ _id, input: { orderShippingPackages, orderStatus: ORDER_STATUS_PROCESSING } });
                //console.log(getCurrentLocalTime(), "Shipments updated in our DB >> ", orderShippingPackages)
                if (successStatusUpdResp)
                    return {
                        success: true,
                        message: SHIPMENT_UPDATED_MESSAGE,
                        saleOrderDTOResponse: resultGetSaleOrder?.saleOrderDTO
                    }
                return {
                    success: false,
                    message: SHIPMENT_CANNOT_UPDATE_MESSAGE,
                }
            }
        },
        getShippingPackageDetails: async (_, { shippingPackageCode }, { authToken, dataSources }) => {
            return await dataSources.UnicomOrderAPI.getShippingPackageDetails({ shippingPackageCode }, authToken);
        },

        getInvoicePDF: async (_, { invoiceCodes, facility }, { authToken, dataSources }) => {
            //return await dataSources.InvoicePDFAPI.getInvoicePDF({ invoiceCodes, facility }, authToken);
            return await dataSources.UnicomOrderAPI.getInvoicePDF({ invoiceCodes, facility }, authToken);
        },

        getInvoiceDetails: async (_, { shippingPackageCode }, { authToken, dataSources }) => {
            return await dataSources.UnicomOrderAPI.getInvoiceDetails(shippingPackageCode, authToken);
        },

        getOrderBySOID: async (_, {saleOrderId}, {dataSources}) => {
            //console.log(getCurrentLocalTime(), "saleOrderId >", saleOrderId);
            return await dataSources.OrderDB.getOrderBySOID(saleOrderId);
        },

        getAllOrdersByBoPhone: async (_, {orderBoPhone}, {dataSources}) => {
            return await dataSources.OrderDB.getAllOrdersByBoPhone(orderBoPhone);
        },

        getAllReturnInitiatedIdsOfOrdersByBoPhone: async (_, {orderBoPhone}, {dataSources}) => {
            return await dataSources.OrderDB.getAllReturnInitiatedIdsOfOrdersByBoPhone(orderBoPhone);
        },

        getOrdersForAlfredOrderPage: async (_, {saleOrderId, orderBoPhone}, {dataSources}) => {
            return await dataSources.OrderDB.getOrdersForAlfredOrderPage(saleOrderId, orderBoPhone);
        },

        getAlfredOrderCountForToday: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getAlfredOrderCountForToday();
        },

        getAlfredOrderCountDeltaFromYesterday: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getAlfredOrderCountDeltaFromYesterday();
        },

        getRobinOrderCountForToday: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getRobinOrderCountForToday();
        },

        getRobinOrderCountDeltaFromYesterday: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getRobinOrderCountDeltaFromYesterday();
        },
        
        getTotalRevenueForToday: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getTotalRevenueForToday();
        },

        getTotalRevenueDeltaFromYesterday: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getTotalRevenueDeltaFromYesterday();
        },

        getTotalAlfredRevenueForToday: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getTotalAlfredRevenueForToday();
        },

        getTotalRobinRevenueForToday: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getTotalRobinRevenueForToday();
        },
        
        getTotalOrderDiscountAllTime: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getTotalOrderDiscountAllTime();
        },

        getTotalBizzcoinUsedAllTime: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getTotalBizzcoinUsedAllTime();
        },

        getTotalRevenueAllTime: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getTotalRevenueAllTime();
        },

        getTotalAlfredOrderCount: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getTotalAlfredOrderCount();
        },

        getTotalRobinOrderCount: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getTotalRobinOrderCount();
        },

        getStatewiseRevenue: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getStatewiseRevenue();
        },

        getStatewiseOrderCount: async (_, __, {dataSources}) => {
            return await dataSources.OrderDB.getStatewiseOrderCount();
        },

        getTopSellingSkusByCount: async (_, {limit}, {dataSources}) => {
            return await dataSources.OrderDB.getTopSellingSkusByCount(limit);
        },

        getTopSellingSkusByRevenue: async (_, {limit}, {dataSources}) => {
            return await dataSources.OrderDB.getTopSellingSkusByRevenue(limit);
        },
        
        getDailyRevenueFromAlfredSincePastNDays: async (_, {limit}, {dataSources}) => {
            return await dataSources.OrderDB.getDailyRevenueFromAlfredSincePastNDays(limit);
        },

        getDailyRevenueFromRobinSincePastNDays: async (_, {limit}, {dataSources}) => {
            return await dataSources.OrderDB.getDailyRevenueFromRobinSincePastNDays(limit);
        },

        getDailyOrderCountFromAlfredSincePastNDays: async (_, {limit}, {dataSources}) => {
            return await dataSources.OrderDB.getDailyOrderCountFromAlfredSincePastNDays(limit);
        },

        getDailyOrderCountFromRobinSincePastNDays: async (_, {limit}, {dataSources}) => {
            return await dataSources.OrderDB.getDailyOrderCountFromRobinSincePastNDays(limit);
        },
        
        fetchOrderAndShippmentForActiveOrders: async (_, __, {authToken, dataSources}) => {

            let allActiveOrders = await dataSources.OrderDB.getAllActiveShipments();

            try{
                const multipOrderUpd = await Promise.all(allActiveOrders.map( async order => {
    
                    let ordStatus = order.orderStatus?.toUpperCase();
                    console.log(getCurrentLocalTime(), ": orderStatus >> ", ordStatus);
                     
                    if(ordStatus)
                    {
                        let resultGetSaleOrder = await dataSources.UnicomOrderAPI.getSaleOrder({ code: order.saleOrderId}, authToken);
                        //console.log(getCurrentLocalTime(), ": ResultGetSaleOrder from API getSaleOrder Call in fetchOrderAndShippmentForActiveOrders");
        
                        if (resultGetSaleOrder.successful) {
                            
                            order.orderStatus = resultGetSaleOrder?.saleOrderDTO?.status;
        
                            let orderShippingPackages = [];

                            const multipShipPkg = await Promise.all(resultGetSaleOrder?.saleOrderDTO?.shippingPackages.map( async shipmentDetail => { 
                                let invoiceDetail = await dataSources.UnicomOrderAPI.getInvoiceDetails(shipmentDetail.code, authToken);
                                console.log("invoiceDetail >> ", invoiceDetail);
                                let shippingCharges = 0;
                                if (invoiceDetail.success) {
                                    shippingCharges = invoiceDetail?.invoiceDetailsDTOResponse?.shippingCharges;    
                                };

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
                                    shipmentShippingCharges: shippingCharges,
                                    shipmentPackageItems: (Object.keys(shipmentDetail.items)).map(skuCode => {
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
        
                            //console.log(getCurrentLocalTime(), " Shipment = ", orderShippingPackages);
                            let successStatusUpdResp = await dataSources.OrderDB.updateOrder({ _id: order._id, input: { orderShippingPackages, orderStatus: order.orderStatus  } });
                            //console.log(getCurrentLocalTime(), "Shipments updated in our DB >> ", orderShippingPackages)
                        }
                    }
                    return order;
                }));
                return multipOrderUpd;  
            }
            catch(error)
            {
                console.error(getCurrentLocalTime(), ": Error >> ", error);
                return {
                success: false,
                message: SHIPMENT_CANNOT_UPDATE_MESSAGE,
                }
            }
        }
    },



    Mutation: {
        createOrder: async (_, { input }, { authToken, dataSources }) => {

            let userInput = JSON.parse(JSON.stringify(input));
            console.log(getCurrentLocalTime(), ": Input for create order >> ", {...input});

            const isOrdValid = await checkOrderValidityViaFirewall(input, dataSources);

            if (!isOrdValid.success) {
                console.log(getCurrentLocalTime(), "Order Firewall Result: ", {...isOrdValid});
                return {
                    success: false,
                    messageFromGotham: isOrdValid.message,
                    isSkuOutOfStock: false,
                    orderStatus: ORDER_STATUS_FAILED
                } 
            }

            let inputSkuCodesAndQuantity = {};
            let inputSkuCodesAndID = {};
            
            input?.orderItems.forEach(orderItem => {
                inputSkuCodesAndQuantity[orderItem.orderSkuCode] = Number(orderItem.orderQuantity);
                inputSkuCodesAndID[orderItem.orderSkuCode] = orderItem.sku;
            });

            

            let inventoryCheckFromGotham = await getInventoryFromGotham(inputSkuCodesAndQuantity, inputSkuCodesAndID, dataSources);
            let inventoryCheckFromUnicom = await isInventoryVisibleInGIS(inputSkuCodesAndQuantity, dataSources, authToken);

            // An inventory of any SKU if not present on Unicom then no chance it should be available on Gotham. In case it is. DB is out of sync. Anyways the order should not go through
            // and asynchronously they should sync. Though there is a slight chance that the inventory is seen on Uniware while it is zero on Gotham because of the 5/10 min processing delay uniware
            // does. Hence ultimately, the order should be placed from Gotham inventory only.

            // Gotham will be considered out of sync on this equation  GOTHAM_INV > UNIWARE_INV, Hence we will sync it before Order.
            let gtInv = inventoryCheckFromGotham.inventorySkuCodesAndQuantity;
            let uniwInv = inventoryCheckFromUnicom.inventorySkuCodesAndQuantity;
            console.log(getCurrentLocalTime(), "gotham Inventory >> ", gtInv, " uniware Inventory >> ", uniwInv);

            (Object.keys(uniwInv)).forEach( uniwCode => {
                
                console.log(getCurrentLocalTime(), "uniwCode >> ", uniwCode, " uniwInv[uniwCode] >> ", uniwInv[uniwCode]);
                if(uniwInv[uniwCode] < gtInv[uniwCode])
                {
          
                    console.log(getCurrentLocalTime(), ": Gotham out of sync for ",uniwCode, " >> Syncing Gotham with Uniware !! This shouldn't happen ideally. This might still give rise to unfulfillable orders");
                    console.log(getCurrentLocalTime(), ": Uniware quantity for ", uniwCode, " = ", uniwInv[uniwCode]);
                    console.log(getCurrentLocalTime(), ": Gotham quantity for ", uniwCode, " = ", gtInv[uniwCode]);
                    
                    //updating our DB with the latest inventory from uniware.
                    dataSources.SkuDB.updateSkuQuantity(uniwCode, uniwInv[uniwCode]);
                    
                    gtInv[uniwCode] = uniwInv[uniwCode];
                    console.log(getCurrentLocalTime(), ": Modified quantity now for ", uniwCode, " at Gotham = ", gtInv[uniwCode]);

                }
            });

            if(inventoryCheckFromUnicom?.inventoryAvailable)
            {
               
                if (inventoryCheckFromGotham?.inventoryAvailable) {

                    // console.log(getCurrentLocalTime(), "inputSkuCodesAndQuantity >> ", inputSkuCodesAndQuantity);
                    let resultFromDBAtCreateOrder = await dataSources.OrderDB.createOrder(input, userInput, authToken);
                    if (resultFromDBAtCreateOrder.success) {
    
                        // We only creat Order on Unicommerce if the order is created in Gotham.                
                        let resultFromUnicom = await dataSources.UnicomOrderAPI.createSaleOrder(userInput, authToken);
                        console.log(getCurrentLocalTime(), ": ResultFromUnicom create sale Order - ", resultFromUnicom?.successful);
    
                        let orderID = resultFromDBAtCreateOrder?.order?._id;
                        let saleOrderID = userInput.saleOrderID;
    
                        if (resultFromUnicom?.successful) {
                            // deduct the inventory for the sku now.
                            let skuCodes = Object.keys(inventoryCheckFromGotham.inventorySkuCodesAndQuantity);
    
                            // console.log(getCurrentLocalTime(), "skuCodes >> ", skuCodes);
                            // Deducting the inventory with the order quantity and updating the DB, since it is independent of order status, we are not bothered much if it gets actually updated or not.
                            skuCodes.forEach(skuCode => {
                                // Deducting the inventory with the order quantity and updating the DB
                                 dataSources.SkuDB.updateSkuQuantity(skuCode, inventoryCheckFromGotham.inventorySkuCodesAndQuantity[skuCode] - inputSkuCodesAndQuantity[skuCode]);
                            });
    
                            // Add data to Consumer table if the BO attached customers
                            if (input?.orderBoConsumers?.length) {
                                let boConsumers = input.orderBoConsumers.map(consumer => {
                                    return ({
                                        consumerName: consumer.orderBoConsumerName,
                                        consumerPhoneNumber: consumer.orderBoConsumerPhoneNumber,
                                        consumerBoLinked: [input?.boDetail],
                                        consumerIsAppInstalled: CONUSMER_APP_INSTALLED_VALUE,
                                    })
                                })
    
                               await dataSources.ConsumerDB.createOrUpdateConsumer({ input: boConsumers });
                               console.log(getCurrentLocalTime(), "Consumer created at order");
                            }
    
                            if (input?.orderBizzcoinUsed) {
                                
                                let deductedBizzCoins = await dataSources.BoDetailDB.deductBizzCoin(input.boDetail, BIZZCOIN_USED_AT_ORDER_AMOUNT);
                                if(deductedBizzCoins)
                                {
                                    let bizzcoinInput = {
                                        bizzcoinAmount: input?.orderBizzcoinUsed,
                                        bizzcoinType: TRANSACTION_TYPE_DEBIT,
                                        boDetail: input?.boDetail,
                                        orderId: resultFromDBAtCreateOrder?.order?._id,
                                        bizzcoinParticulars: PARTICULARS_ORDER_PLACED,
                                    }
                                    await dataSources.BizzcoinDB.createBizzcoin({ input: bizzcoinInput });
                                    console.log(getCurrentLocalTime(), "Creating Bizzcoin record for BO ");
                                }
    
                            }
    
                            // Update DB with CREATED status and SO ID
                            let successUpdate = { saleOrderId: saleOrderID, orderStatus: ORDER_STATUS_CREATED };
                            let successStatusUpdResp = await dataSources.OrderDB.updateOrder({ _id: orderID, input: successUpdate })
    
                            if (successStatusUpdResp.success) {
                                // console.log(getCurrentLocalTime(), " Update DB with CREATED status and SO ID >> ", successStatusUpdResp);   
                                // console.log(getCurrentLocalTime(), "getMill ", getMillisecondsToNext5Min());

                                
                                /* After Sprint 1.2.10 (14th July, 2022) - Earning of bizzcoins was stopped. Hence commenting the below code. */
                    
                                /*
                                // If More than 5 consumers were added >> gift the user 50 bizzcoins after every DB update so we are sure that the order is placed successfully.
                                if (input?.orderBoConsumers?.length >=5 ) {
                                    
                                    let giftedBizzcoin = await dataSources.BoDetailDB.giftBizzCoin(input.boDetail, BIZZCOIN_5_CUST_AMOUNT);
    
                                    if (giftedBizzcoin) {
                                        let bizzcoinInput = {
                                            bizzcoinAmount: BIZZCOIN_5_CUST_AMOUNT,
                                            bizzcoinType: TRANSACTION_TYPE_CREDIT,
                                            boDetail: input?.boDetail,
                                            orderId: resultFromDBAtCreateOrder?.order?._id,
                                            bizzcoinParticulars: PARTICULARS_5_COSTOMERS_TAGGED,
                                        }
                                        await dataSources.BizzcoinDB.createBizzcoin({ input: bizzcoinInput });
                                        console.log(getCurrentLocalTime(), "PARTICULARS_5_COSTOMERS_TAGGED>> "); 
                                    }
                                }
                                */
    
                                resultFromDBAtCreateOrder.orderStatus = ORDER_STATUS_CREATED;
                                resultFromDBAtCreateOrder.messageFromUniware = ORDER_STATUS_CREATED_AT_UNICOME_MESSAGE;
    
                                let extraTimeToAllocateInventory = 300000;
                                if (FORCEALLOCATE_VALUE)
                                    extraTimeToAllocateInventory = 0;
    
    
    
                                setTimeout(async (orderID, saleOrderID) => {
                                    // We are only sending code as input and not facilityCodes for now.
                                    // console.log(getCurrentLocalTime(), "resultFromDBAtCreateOrder.orderStatus >> ",resultFromDBAtCreateOrder,"\n\n");
                                    let order = await dataSources.OrderDB.getOrderById(orderID);
                                    if (order && order.orderStatus === ORDER_STATUS_CREATED) {
    
                                        let resultGetSaleOrder = await dataSources.UnicomOrderAPI.getSaleOrder({ code: saleOrderID/*, facilityCodes: [DEMOSTAGING_FAC_CODE] */ }, authToken);
                                        // console.log(getCurrentLocalTime(), "resultGetSaleOrder >> ", { ...resultGetSaleOrder?.saleOrderDTO?.shippingPackages });
    
                                        if (resultGetSaleOrder.successful) {
                                            let orderShippingPackages = [];
                                            for (let i = 0; i < resultGetSaleOrder?.saleOrderDTO?.shippingPackages?.length;
                                                i++) {
                                                let shipmentDetail = resultGetSaleOrder?.saleOrderDTO?.shippingPackages[i];

                                                // console.log(getCurrentLocalTime(), "Items >> ", {...shipmentDetail.items}, " \n and map of Items >> ", (Object.keys(shipmentDetail.items)).map(skuCode => {
                                                //     let items = shipmentDetail.items;
                                                //     return {
                                                //         itemSku: items[skuCode].itemSku,
                                                //         itemName: items[skuCode].itemName,
                                                //         quantity: items[skuCode].quantity
                                                //     }
                                                // }));

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
                                                    shipmentPackageItems: (Object.keys(shipmentDetail.items)).map(skuCode => {
                                                         
                                                        let items = shipmentDetail.items;
                                                        return {
                                                            itemSku: items[skuCode]?.itemSku,
                                                            itemName: items[skuCode]?.itemName,
                                                            quantity: items[skuCode]?.quantity
                                                        }
                                                    })
                                                }
                                                orderShippingPackages.push(shippmentDetails);
                                            }
                                            // console.log(getCurrentLocalTime(), " Shipment = ", orderShippingPackages);
                                            successStatusUpdResp = await dataSources.OrderDB.updateOrder({ _id: orderID, input: { orderShippingPackages, orderStatus: ORDER_STATUS_PROCESSING } });
                                            //console.log(getCurrentLocalTime(), "Shipments updated in our DB >> ", orderShippingPackages)
                                        }
                                    }
                                }, (extraTimeToAllocateInventory + getMillisecondsToNext5Min()), orderID, saleOrderID);
                                   
                                const isCartEmptied = dataSources.CartWishlistDB.emptyCartWishlist({boID: input.boDetail});
                                // console.log("isCartEmpty >> ", isCartEmpty);
                            }
                            else
                               {
                                    throw { message: "Failed at updating the status of order after success Create Sale Order" };
                               }
    
                        }
                        else {
                            let failStatusUpdate = { orderStatus: ORDER_STATUS_FAILED };
                            let failStatusUpdResp = await dataSources.OrderDB.updateOrder({ _id: orderID, input: failStatusUpdate })
                            resultFromDBAtCreateOrder.orderStatus = ORDER_STATUS_FAILED_AT_UNICOM;
                            resultFromDBAtCreateOrder.success = false;
                            resultFromDBAtCreateOrder.messageFromUniware =  resultFromUnicom?.errors && resultFromUnicom?.errors[0].description;
                            // console.log(getCurrentLocalTime(), " Updated Order Status as Failed >> ", failStatusUpdResp);   
                        }
                    }
                    else
                        resultFromDBAtCreateOrder.orderStatus = ORDER_STATUS_FAILED;
    
                    return resultFromDBAtCreateOrder;
                }

            }
        
           
            return {
                success: false,
                messageFromGotham: `One item or more just got out of Stock- Sorry! Please Press 'Notify Me' on the item to get notified!`,
                messageFromUniware: `One item or more just got out of Stock- Sorry! Please Press 'Notify Me' on the item to get notified!`,
                isSkuOutOfStock: true,
                orderStatus: ORDER_STATUS_FAILED
            }
        

        },

        updateOrder: (_, { _id, input }, { dataSources }) => {
            return dataSources.OrderDB.updateOrder({ _id, input });
        },

        cancelOrder: async (_, { _id, orderCancellationReason }, { authToken, dataSources }) => {
            
            let respFromUnicom = await dataSources.UnicomOrderAPI.cancelSaleOrder({ _id, orderCancellationReason }, authToken);

            console.log(getCurrentLocalTime(), ":RespFromUnicom for Cancel Sale Order >> ", respFromUnicom);

            if (respFromUnicom.successful) {
                let orderUpdRes = await dataSources.OrderDB.cancelOrder(_id, orderCancellationReason);
                // Adding the inventory with the order quantity and updating the DB, since it is independent of order status, we are not bothered much if it gets actually updated or not.
                
                const orderItems = orderUpdRes?.order?.orderItems;
                // console.log(getCurrentLocalTime(), "orderItems = ", orderItems);
                if(orderItems && orderItems?.length)
                {
                   orderItems.map(orderItem => {
                         dataSources.SkuDB.changeSkuInventory(orderItem.sku, orderItem.orderQuantity);
                    });
                }
                orderUpdRes.messageFromUniware = "Order cancelled sucessfully on Unicom";
                orderUpdRes.orderStatus = ORDER_STATUS_CANCELLED;

                return orderUpdRes;
            }
            return {
                success: false,
                messageFromUniware: respFromUnicom?.errors.length ? respFromUnicom?.errors[0]?.description : CANCEL_ORDER_MESSAGE
            }
        } ,
        
    
    
    
    
    }
}


const isInventoryVisibleInGIS = async (inputSkuCodesAndQuantity, dataSources, authToken) => {

    console.log(getCurrentLocalTime(), ": Required Sku codes and Quantity in the order >> ", inputSkuCodesAndQuantity);
    
    // Check inventory at all FCs then only place order.
    let inventorySkuCodesAndQuantity = {};
    let facilities = process.env.ALL_FACILITY.split(", ");

    for (let i = 0; i < facilities.length; i++) {
 
        let getInventoryResponse = await dataSources.UnicomInventoryAPI.checkInventoryforSKU(Object.keys(inputSkuCodesAndQuantity), null, facilities[i], authToken);
         //console.log(getCurrentLocalTime(), "getInventoryResponse >> ", getInventoryResponse)
        if (getInventoryResponse?.success && getInventoryResponse?.inventorySnapshot) {
            let inventorySnapshots = getInventoryResponse.inventorySnapshot;
            inventorySnapshots.forEach(skuSnapshot => {
                inventorySkuCodesAndQuantity[skuSnapshot.itemTypeSKU] = Number(inventorySkuCodesAndQuantity[skuSnapshot.itemTypeSKU] ? inventorySkuCodesAndQuantity[skuSnapshot.itemTypeSKU] : 0) + Number(skuSnapshot.inventory);
            })
        }

        if (Object.keys(inputSkuCodesAndQuantity).length != Object.keys(inventorySkuCodesAndQuantity).length) {
            console.log(getCurrentLocalTime(), ": Two Array length did not match, There's an SKU missing on uniware. ", inventorySkuCodesAndQuantity);
            return { inventoryAvailable: false, inventorySkuCodesAndQuantity: {} };
        }

        const skuCodes = Object.keys(inputSkuCodesAndQuantity);
        
        let foundAllSKUsInThisFC = true;
        skuCodes.forEach(skuCode => {
            if (inventorySkuCodesAndQuantity[skuCode] < inputSkuCodesAndQuantity[skuCode])
                foundAllSKUsInThisFC = false;
        });

         //console.log(getCurrentLocalTime(), ": Inventory sku codes and Quantity >> ", inputSkuCodesAndQuantity, " and ", foundAllSKUsInThisFC);

        if (foundAllSKUsInThisFC)
            return { inventoryAvailable: true, inventorySkuCodesAndQuantity };

    }
    return { inventoryAvailable: false, inventorySkuCodesAndQuantity };
}

const getInventoryFromGotham = async (inputSkuCodesAndQuantity, inputSkuCodesAndID, dataSources) => {

    const skuCodes = Object.keys(inputSkuCodesAndQuantity);

    // console.log(getCurrentLocalTime(), "inputSkuCodesAndQuantity in Gotham Check >> ", inputSkuCodesAndQuantity);
    // console.log(getCurrentLocalTime(), "inputSkuCodesAndID in Gotham Check >> ", inputSkuCodesAndID);
    let inventorySkuCodesAndQuantity = {}, inventoryAvailable = true;

    const skuQuantity =
         await Promise.all(
            
            skuCodes.map(async skuCode => {

                try{
                    
                    let gtQuantity = await dataSources.SkuDB.getSkuQuantityById(inputSkuCodesAndID[skuCode]);
                    console.log(getCurrentLocalTime(), ": Inventory for Sku in Gotham - ", skuCode, " = ",  gtQuantity?.skuInventory);

                    if (gtQuantity === null || gtQuantity === undefined || gtQuantity?.skuInventory === null || gtQuantity?.skuInventory === undefined)
                        {
                            inventoryAvailable = false;
                            throw {message: `Inventory for Sku- ${skuCode} cannot be null or undefined-  ${gtQuantity}`}
                        }
                    else{
                        // console.log(getCurrentLocalTime(), " gtQuantity = ", gtQuantity);
                        if (Number(gtQuantity?.skuInventory) < Number(inputSkuCodesAndQuantity[skuCode])) {
                            inventoryAvailable = false;
                            throw {message: `Inventory for Sku- ${skuCode} is ${gtQuantity?.skuInventory} while the quantity ordered -  ${inputSkuCodesAndQuantity[skuCode]}`}
                        }
                    }
                    return (gtQuantity?.skuInventory || 0);
                    
                }
                catch(error)
                 {
                    console.error(getCurrentLocalTime(), ": ", error.message);
                    return 0;
                 }   
           
            // console.log(getCurrentLocalTime(), "inventorySkuCodesAndQuantity At Gotham >> ", inventorySkuCodesAndQuantity);
        }))
            .catch(error => console.error(getCurrentLocalTime(), ": ", error));

    for (let i = 0; i < skuQuantity.length; i++) {
        let temp = skuCodes[i];
        inventorySkuCodesAndQuantity[temp] = skuQuantity[i]; 
    }

    //console.log(getCurrentLocalTime(), "inventorySkuCodesAndQuantity At Gotham >> ", inventorySkuCodesAndQuantity);
    return ({ inventoryAvailable: inventoryAvailable, inventorySkuCodesAndQuantity })

}

const checkOrderValidityViaFirewall = async (input, dataSources) => {
    try {

        // Checking if the order is not from a Block-Listed BOs
        const isOrderFromActiveBO = await verifyActiveBOFlag(input.boDetail, dataSources);

        if (!isOrderFromActiveBO.success) {
           // console.log("BO is Block Listed. Bo isActive = false");
            throw { message: isOrderFromActiveBO.message };
        }


        const isOrderTotalAmountCorrect = verifyTotalAmount(input);

        if (!isOrderTotalAmountCorrect.success) {
            console.log("total amount incorrect.");
            throw { message: isOrderTotalAmountCorrect.message };
        }

        const isOrderTotalDiscountCorrect = verifyTotalDiscount(input);            

        if (!isOrderTotalDiscountCorrect.success) {
            console.log("total discount incorrect.");
            throw { message: isOrderTotalDiscountCorrect.message };
        }

        const isCouponActive = await verifyCouponValidity(input, dataSources);
        
        if (!isCouponActive.success) {
            console.log("coupon incorrect");
            throw { message: isCouponActive.message };
        }

        const isPincodeServiceable = await verifyPincodeServiceability(input, dataSources);

        if (!isPincodeServiceable.success) {
            console.log("pincode not serviceable anymore.");
            throw { message: isPincodeServiceable.message };
        }

        if (input?.orderChannel == ROBINCHANNEL) {
            const isOrderPricingValid = await verifyOrderPricing(input, dataSources);
            if (!isOrderPricingValid.success) {
                console.log("order pricing values incorrect.");
                throw { message: isOrderPricingValid.message };
            };
        }
        
        return {
            success: true,
            message: "Order verified correctly. Ready to create."
        }

    } catch (error) {
        return {
            success: false,
            message: (error?.message) ? error.message : "please check server logs for issues.", 
            orderStatus: ORDER_STATUS_FAILED                       
        }        
    }
}

const verifyActiveBOFlag = async ( boID, dataSources ) => {

    let activeFlag = await dataSources.BoDetailDB.isBOActive(boID);
    console.log("inside verifyActiveBOFlag, ", activeFlag);

    if (activeFlag?.boIsActive) {
        return {
            success: true,
            message: "VERIFY SUCCESS : BO is active"
       }
    } else {
        return {
            success: false,
            message: "VERIFY FAIL : BO is block Listed"
        }
    }

}

const verifyTotalAmount = ( input ) => {
    console.log("inside verifyTotalAmount");
    let givenOrderAmount = input?.orderAmount;
    let calculatedOrderAmount = 0;

    for (let i=0; i<input?.orderItems.length; i++) {
        let orderItem = input?.orderItems[i];
        calculatedOrderAmount += orderItem.orderQuantity * orderItem?.orderPrice?.orderSellingPrice;
    }

    calculatedOrderAmount += notNullAndUndefinedCheck(input?.orderShippingCharges) ? input.orderShippingCharges : 0;

    console.log("given val : ", givenOrderAmount);
    console.log("calculated val : ", calculatedOrderAmount);

    if (Math.abs(givenOrderAmount - calculatedOrderAmount) < EPSILON) {
        return {
            success: true,
            message: "VERIFY SUCCESS : Order amount verified successfully."
       }
    } else {
        return {
            success: false,
            message: "VERIFY FAIL : Order total amount calculation incorrect."
        }
    }
}

const verifyTotalDiscount = ( input ) => {
    console.log("inside verifyTotalDiscount");
    let givenOrderDiscount = input?.orderTotalDiscountAmount;
    let bizzcoinUsed = input?.orderBizzcoinUsed ? input.orderBizzcoinUsed : 0;
    let calculatedOrderDiscount = 0;

    for (let i=0; i<input?.orderItems.length; i++) {
        let orderItem = input?.orderItems[i];
        calculatedOrderDiscount += orderItem?.orderQuantity * orderItem?.orderPrice?.orderDiscountAmount;
    }

    console.log("given val : ", givenOrderDiscount);
    console.log("calculated val : ", calculatedOrderDiscount);
    console.log("bizzcoin used : ", bizzcoinUsed);

    if (Math.abs((givenOrderDiscount+bizzcoinUsed) - calculatedOrderDiscount) < EPSILON) {
        return {
            success: true,
            message: "VERIFY SUCCESS : Order discount verified successfully."
        }
    } else {
        return {
            success: false,
            message: "VERIFY FAIL : Order discount calculation incorrect."
        }
    }
}

const verifyPincodeServiceability = async ( input, dataSources ) => {
    try {
        console.log("inside verifyPincodeServiceability");       
        const inpPincode = input?.orderShippingAddress?.orderPincode;

        if (!inpPincode) {
            throw { message: "VERIFY FAIL: No pincode provided in shipping address." };
        }
    
        const pincodeDetails = await dataSources.PincodeDB.getPincode(inpPincode);
    
        if (!pincodeDetails) {
            throw { message: `VERIFY FAIL: ${inpPincode} not found.` }; 
        };
    
        if (!pincodeDetails.pincodeIsServiceable) {
            throw { message: `VERIFY FAIL: ${inpPincode} is not serviceable` };
        }

        console.log("pincode is serviceable");
        return {
            success: true,
            message: "VERIFY SUCCESS: Pincode is serviceable."
        };
    } catch (error) {
        console.log("error >> ", error);
        return {
            success: false,
            message: (error?.message) ? error.message : "please check server logs for issues.", 
            orderStatus: ORDER_STATUS_FAILED                       
        }
    }
}

const verifyCouponValidity = async ( input, dataSources ) => {
    try { 
        console.log("inside verifyCouponValidity");       
        const multipCouponValidity = await Promise.all(input?.orderItems.map( async orderItem => {
            if (orderItem.orderCoupon) {
                let coupon = await dataSources.CouponDB.getCouponById(orderItem.orderCoupon);

                if (!coupon) {
                    console.log("coupon not found >> ", orderItem.orderCoupon);
                    throw { message: `VERIFY FAIL : ${orderItem.orderCoupon} coupon doesn't exist.` };
                }

                if (!coupon.couponIsActive) {
                    console.log("coupon not active >> ", coupon);
                    throw { message: `VERIFY FAIL : ${orderItem.orderCoupon} coupon is not active.` };
                }
                
                if (coupon.couponEndDate < getCurrentLocalTime()) {
                    console.log("coupon expired >> ", coupon);
                    throw { message: `VERIFY FAIL : ${orderItem.orderCoupon} coupon is expired.` };
                }
            }

            if (orderItem.orderHookTagCoupon) {
                let coupon = await dataSources.CouponDB.getCouponById(orderItem.orderHookTagCoupon);

                if (!coupon) {
                    console.log("hook tag coupon not found >> ", orderItem.orderHookTagCoupon);
                    throw { message: `VERIFY FAIL : ${orderItem.orderHookTagCoupon} coupon doesn't exist.` };
                }

                if (!coupon.couponIsActive) {
                    console.log("hook tag coupon not active >> ", coupon);
                    throw { message: `VERIFY FAIL : ${orderItem.orderHookTagCoupon} coupon is not active.` };
                }
                
                if (coupon.couponEndDate < getCurrentLocalTime()) {
                    console.log("hook tag coupon expired >> ", coupon);
                    throw { message: `VERIFY FAIL : ${orderItem.orderHookTagCoupon} hook tag coupon is expired.` };
                }
            }
        }));

        console.log(getCurrentLocalTime(), "All coupons are valid.");

        return {
            success: true,
            message: "VERIFY SUCCESS: All coupons are valid."
        }
    } catch (error) {
        console.log("error >> ", error);
        return {
            success: false,
            message: (error?.message) ? error.message : "please check server logs for issues.", 
            orderStatus: ORDER_STATUS_FAILED                       
        }    
    }
};

const verifyOrderPricing = async (input, dataSources) => {
    try { 
        console.log("inside verifyOrderPricing");

        // const totalQty = input?.orderItems.reduce((partialSum, orderItem) => partialSum + orderItem.orderQuantity, 0);
        // const bizzcoinUsed = input?.orderBizzcoinUsed ? input.orderBizzcoinUsed : 0;
        // console.log("bizzcoin used >> ", bizzcoinUsed);
        // const itemLevelBizzCoinUsed = parseFloat(bizzcoinUsed / totalQty);
        // console.log(" item level bizzcoin used >> ", itemLevelBizzCoinUsed);
        // console.log("total Qty >> ", totalQty);
        const bizzcoinUsed = input?.orderBizzcoinUsed ? input.orderBizzcoinUsed : 0;
        const orderTotalAmount = input?.orderItems.reduce((partialSum, orderItem) => partialSum + (orderItem.orderQuantity * orderItem.orderPrice?.orderSellingPrice), 0);
        console.log("orderTotalAmount >> ", orderTotalAmount);


        const multipOrdPricingValidity = await Promise.all(input?.orderItems.map( async orderItem => {
            
            const boPrice = orderItem?.orderPrice?.orderSkuPrices?.orderBoPrice;
            const fsd = orderItem?.orderPrice?.orderSkuPrices?.orderSkuFlashSaleDiscountPercentage;
           
            const skuQunatity = orderItem?.orderQuantity;
            const skuSellingPrice = orderItem?.orderPrice?.orderSellingPrice;
            const skuCoinsAmountPrice = skuSellingPrice * skuQunatity / orderTotalAmount;
            const itemLevelBizzCoinUsed = (skuCoinsAmountPrice * bizzcoinUsed) / skuQunatity ;

            const offerPrice = boPrice - (fsd * 0.01 * boPrice);
            const specialDiscount = orderItem?.orderPrice?.orderSkuPrices?.orderSkuSpecialDiscountPercentage;
            let genericDiscount = 0;
            let coupon = null;
            if (orderItem?.orderCoupon) {
                coupon = await dataSources.CouponDB.getCouponById(orderItem.orderCoupon);
                if (!coupon) {
                    console.log("coupon is invalid >> ", orderItem.orderCoupon);
                    throw {message: `VERIFY FAIL : ${orderItem.orderCoupon} coupon is invalid.`};
                }
            }

            genericDiscount = (coupon?.couponAmount) ? coupon.couponAmount : 0;

            // Hook Tag Coupon Discount calculated
            let extraGenDiscount = 0;
            let hookTagCoupon = null;
            if (orderItem?.orderHookTagCoupon) {
                hookTagCoupon = await dataSources.CouponDB.getCouponById(orderItem.orderHookTagCoupon);
                if (!hookTagCoupon) {
                    console.log("coupon is invalid >> ", orderItem.orderHookTagCoupon);
                    throw {message: `VERIFY FAIL : ${orderItem.orderHookTagCoupon} coupon is invalid.`};
                }
            }

            extraGenDiscount = (hookTagCoupon?.couponAmount) ? hookTagCoupon.couponAmount : 0;

            const discount = (specialDiscount + genericDiscount + extraGenDiscount) * 0.01 * offerPrice + itemLevelBizzCoinUsed;
            const sellingPrice = offerPrice - discount;
            
            // const totalDiscount = discount * orderItem?.orderQuantity;
            // const totalSum = sellingPrice * orderItem?.orderQuantity;

            if (Math.abs(discount - orderItem?.orderPrice?.orderDiscountAmount) > EPSILON) {
                console.log("given val : ", orderItem?.orderPrice?.orderDiscountAmount);
                console.log("calculated val : ", discount);
                throw {message: `VERIFY FAIL : Mismatch in sku level discount calculation for ${orderItem.orderSkuCode}, given val : ${orderItem?.orderPrice?.orderDiscountAmount},
                calculated val : ${discount}` };
            }

            if (Math.abs(sellingPrice - orderItem?.orderPrice?.orderSellingPrice) > EPSILON) {
                console.log("given val : ", orderItem?.orderPrice?.orderSellingPrice);
                console.log("calculated val : ", sellingPrice);
                throw {message: `VERIFY FAIL : Mismatch in sku level selling price calculation for ${orderItem.orderSkuCode}, given val : ${orderItem?.orderPrice?.orderSellingPrice}, 
                        calculated val : ${sellingPrice}`};
            }

        }));

        console.log(getCurrentLocalTime(), "All items pricing correct.");
        return {
            success: true,
            message: `VERIFY PASS : All items pricing correct.`,
        }
    } catch (error) {
        console.log("error >> ", error);
        return {
            success: false,
            message: (error?.message) ? error.message : "please check server logs for issues.", 
            orderStatus: ORDER_STATUS_FAILED                       
        }        
    }
}