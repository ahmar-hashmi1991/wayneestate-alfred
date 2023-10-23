import { ORDER_STATUS_CANCELLED, ORDER_STATUS_COMPLETED, ORDER_STATUS_CREATED, ORDER_STATUS_FAILED, ALFREDCHANNEL, ROBINCHANNEL, SHIPMENT_STATUS_DELIVERED, SHIPMENT_STATUS_RETURNED , notNullAndUndefinedCheck, getCurrentLocalTime } from '../../../utility';
import { GtOrder } from '../GtOrder';

export class Order {

  async getOrderBySOID(saleOrderId) {
      //console.log(getCurrentLocalTime(), "Sale Order ID >> ", saleOrderId);
    return GtOrder.findOne({saleOrderId: saleOrderId}).populate([{
        path: 'orderItems.orderCoupon',
        select: ['couponCode', 'couponAmount'],
    },
    {
        path: 'orderItems.orderHookTagCoupon',
        select: ['couponCode', 'couponAmount'],
    }]);
  }

  async  getOrderById(_id) {
        return GtOrder.findOne({_id}).populate('boDetail').populate({
            path: 'orderItems.sku',
            select: ['_id','skuName', 'skuImages', 'skuPackOf']
        }).populate('orderItems.orderTag').populate({
            path: 'orderItems.orderCoupon',
            select: ['couponCode', 'couponAmount', 'couponMinOrderValue', 'couponMaxDiscountAmount'],
        })
        .populate({
            path: 'orderItems.orderHookTagCoupon',
            select: ['couponCode', 'couponAmount', 'couponMinOrderValue', 'couponMaxDiscountAmount'],
        })        
        .populate({
            path: 'orderShippingPackages.returnInitiated',
            populate: [{
                path: 'returnItem',
                populate: [{
                    path: 'sku',
                    select: ['skuCode','skuName', 'skuImages']
                },
                {
                    path: 'returnItemReason',
                    select: ['reasonDescription']
                }]
            },
            {
                path: 'returnDetail',
                populate: {
                    path: 'transaction',
                }
            }
        ]
        })
    }

   async getAllOrders(offset,limit) {
 
       let foundOrders = await GtOrder.find({}).sort({orderCreatedDate: -1}).skip(offset).limit(limit);

       return foundOrders;
    }

    async getAllOrdersByBoId(_id, offset, limit){
        let foundOrders;
        
            // When frontend sends a request with both offset and limit we send a response with pagination.
           if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit))
           {     
                foundOrders = await GtOrder.find({boDetail: _id}).sort({ orderCreatedDate: -1 }).skip(offset).limit(limit)
                .populate('boDetail').populate({
                    path: 'orderItems.orderCoupon',
                    select: ['couponCode', 'couponAmount'],
                })
                .populate({
                    path: 'orderItems.sku',
                    select: ['_id','skuName', 'skuImages', 'skuPackOf']
                })
                .populate({
                    path: 'orderShippingPackages.returnInitiated',
                    populate: [{
                        path: 'returnItem',
                        populate: {
                            path: 'sku',
                            select: ['skuCode','skuName', 'skuImages']
                        }
                    },
                    {
                        path: 'returnDetail',
                        populate: {
                            path: 'transaction',
                        }
                    }
                ]
                });
           } else {
                // Response without pagination
                foundOrders = await GtOrder.find({boDetail: _id}).sort({ orderCreatedDate: -1 }).populate('boDetail').populate({
                    path: 'orderItems.orderCoupon',
                    select: ['couponCode', 'couponAmount'],
                })
                .populate({
                    path: 'orderItems.sku',
                    select: ['_id','skuName', 'skuImages', 'skuPackOf']
                })
                .populate({
                    path: 'orderShippingPackages.returnInitiated',
                    populate: [{
                        path: 'returnItem',
                        populate: {
                            path: 'sku',
                            select: ['skuCode','skuName', 'skuImages']
                        }
                    },
                    {
                        path: 'returnDetail',
                        populate: {
                            path: 'transaction',
                        }
                    }
                ]
                });

              }
        
     
        // console.log("foundOrders >> ", foundOrders[0].orderShippingPackages[0].returnInitiated);
        return foundOrders;
    }

    async getTodaysOrdersForBoId({_id},offset, limit) {
        let today = new Date();
        today.setUTCHours(0,0,0,0);
        
        let foundOrders = await GtOrder.find({
            boDetail: _id,
            orderStatus: {$nin: [ORDER_STATUS_FAILED, ORDER_STATUS_CANCELLED]},
            orderCreatedDate: { $gte: today}
        }).sort({ orderCreatedDate: -1 }).skip(offset).limit(limit)
        .populate({
            path: 'orderItems.sku',
            select: ['_id','orderSkuCode', 'orderSkuQuantity']
            //match: { skuThresholdObject: { $exists: true }}
        });
        
        return foundOrders;
    }

    async getAllOrdersByBoPhone(orderBoPhone) {
        return GtOrder.find({orderBoPhone: orderBoPhone}).sort({ orderCreatedDate: -1 }).populate({
            path: 'orderItems.orderCoupon',
            select: ['couponCode', 'couponAmount'],
        });
      }

    async getAllReturnInitiatedIdsOfOrdersByBoPhone(orderBoPhone) {
        let orders = await GtOrder.find({
            orderBoPhone: orderBoPhone,
            "orderShippingPackages.0": {$exists: true},
            "orderShippingPackages.returnInitiated.0": {$exists: true}
        });

        let returnInitiateds = [];

        for (let i=0; i<orders.length; i++)
        {
            let order = orders[i];
            for (let j=0; j<order.orderShippingPackages.length; j++)
            {
                let orderShipPkg = order.orderShippingPackages[j];
                for (let k=0; k<orderShipPkg.returnInitiated.length; k++)
                {
                    returnInitiateds.push(orderShipPkg.returnInitiated[k]);
                }
            }
        }

        return returnInitiateds;
    }

    async getOrdersForAlfredOrderPage(saleOrderId,orderBoPhone) {

        if(saleOrderId)
            return await GtOrder.find({saleOrderId: saleOrderId}).populate({
            path: 'orderItems.orderCoupon',
            select: ['couponCode', 'couponAmount'],
        });

        if(orderBoPhone)
            return await GtOrder.find({orderBoPhone: orderBoPhone}).sort({ orderCreatedDate: -1 }).populate({
            path: 'orderItems.orderCoupon',
            select: ['couponCode', 'couponAmount'],
        });

        return await GtOrder.find().sort({orderCreatedDate: -1}).limit(50).populate({
            path: 'orderItems.orderCoupon',
            select: ['couponCode', 'couponAmount'],
        });
    }

    async updateOrder({_id, input}){
         try{
            let updatedOrder = await GtOrder.updateOne({_id},{$set: {...input}})
            return{
                success: true,
                messageFromGotham:"Order updated successfully on Gotham."
            };
        }catch (error){
            // console.error(getCurrentLocalTime(), ": ", "error in update Order >> ", error);
            return {
                success: false,
                messageFromGotham: error?.message,
            }
        }
    }

    async updateShippingPackageWithReturnInitiated(orderId, shipmentPackageCode, returnInitiatedId){
        try {
            console.log(getCurrentLocalTime(), orderId, shipmentPackageCode, returnInitiatedId);
            let order = await GtOrder.findById(orderId);

            let index = order?.orderShippingPackages?.findIndex(shipPackage => shipPackage.shipmentPackageCode === shipmentPackageCode);

            if (index != -1) {
                let returnInitiated = order.orderShippingPackages[index].returnInitiated;
                order.orderShippingPackages[index].returnInitiated = [...returnInitiated, returnInitiatedId];
                
                let updatedOrderResp = await GtOrder.updateOne({_id:orderId}, order);
                
                // console.log(getCurrentLocalTime(), "updatedOrderResp >> ", updatedOrderResp);

                if (updatedOrderResp.modifiedCount > 0) {
                    return {
                        success: true,
                        message: "Shipment package is updated successfully on Gotham.",
                        order: order
                    };
                }
            }
        } catch (error){
            return {
                
                success: false,
                messageFromGotham: error?.message,
                order: null,
              }        
        }
    }

    async createOrder(input, userInput){
        try{
                if(input?.orderItems && input.orderItems?.length>0)
                {
                  input.orderItems = input.orderItems.map(orderItem => {
                      return {...orderItem, ...{orderQuantityFulfillable: orderItem.orderQuantity}};
                  });
                }  
                // console.log(getCurrentLocalTime(), "input orderItems now >> ", input?.orderItems);
                let newOrder = new GtOrder({...input});
                //console.log(getCurrentLocalTime(), 'new order',newOrder);
                let orderResponse =  await newOrder.save();
                userInput.orderID = newOrder?._id;
                //console.log(getCurrentLocalTime(), 'orderResponse',orderResponse);
                return {
                    success: true,
                    messageFromGotham: "Order is created successfully on Gotham.",
                    order: newOrder,
                };
        }catch (error){
            return {
                
                success: false,
                messageFromGotham: error?.message,
                order: null,
              }
        }
    }

    async cancelOrder(_id, orderCancellationReason){
        try{
           let cancelOrder = await GtOrder.findByIdAndUpdate(_id,{orderStatus: ORDER_STATUS_CANCELLED, 
            orderCancellationReason: orderCancellationReason});

           // console.log(getCurrentLocalTime(), "cancelOrder > ", cancelOrder);

           return{
               success: true,
               messageFromGotham: "Order cancelled successfully on Gotham.",
               order: cancelOrder
              };
        } catch (error){
             return {               
               success: false,
               messageFromGotham: error?.message,
              }
       }
   }

   async getAllActiveShipments(){
    try
    {

        let allActiveShipments = await GtOrder.find(
            //$and: [  
            { orderChannel: {$in: [ROBINCHANNEL]},
            orderStatus : {$nin : [ ORDER_STATUS_FAILED, ORDER_STATUS_CANCELLED] },
            "orderShippingPackages.shipmentFCStatus": {$nin: [SHIPMENT_STATUS_DELIVERED, SHIPMENT_STATUS_RETURNED]}
        });

        //console.log(getCurrentLocalTime(), "allActiveShipments > ", allActiveShipments);
        return allActiveShipments;
    }
    catch (error)
    {
       console.log(getCurrentLocalTime(), "Error >> ", error);
    }
}

    async getTotalOrderedQtyForTodaysTimeFrameForGivenSkuOfGivenBO(_id, boID, startTime, endTime) {
        try {
            console.log("id >> ", _id);
            console.log("boID >> ", boID);

            let todayStart = new Date();
            // todayStart.setDate(todayStart.getDate() - 1); 

            let startTimeArr = startTime.split(':');
            let startTimeHrs = startTimeArr[0];
            let startTimeMins = startTimeArr[1];

            todayStart.setHours(startTimeHrs,startTimeMins,0,0);

            console.log("todayStart>> ", todayStart);
            
            let todayEnd = new Date();
            
            let endTimeArr = endTime.split(':');
            let endTimeHrs = endTimeArr[0];
            let endTimeMins = endTimeArr[1];

            todayEnd.setHours(endTimeHrs,endTimeMins,0,0);
            
            console.log("todayEnd >> ", todayEnd);

            let orders = await GtOrder.find({ orderStatus: {$nin: [ORDER_STATUS_FAILED, ORDER_STATUS_CANCELLED]},
                boDetail: boID,
                orderCreatedDate: {$gte : todayStart, $lte: todayEnd}
            }, { orderItems: 1});
            
            // console.log("orders >> ", orders);

            let skuQty = 0;
            orders.forEach(order => {
                order.orderItems.forEach( orderItem => {
                    console.log("orderItem >> ", orderItem);
                    if (_id === orderItem.sku.toString()) {
                        skuQty += orderItem.orderQuantity;
                    }
                })
            });

            return skuQty;
        } catch (error) {
            console.log(getCurrentLocalTime(), "Error >> ", error);            
        }
    }

    async getOrderCountOnGivenDateFromGivenChannel(givenDate, givenChannel, givenStatuses) {
        try {
            let tomorrow = new Date();
            tomorrow.setDate(givenDate.getDate() + 1); 

            givenDate.setUTCHours(0,0,0,0); 
            tomorrow.setUTCHours(0,0,0,0); 

            return await GtOrder.find({orderChannel: givenChannel, 
                                       orderStatus: {$nin: [ORDER_STATUS_FAILED, ORDER_STATUS_CANCELLED]},
                                       // orderStatus: {$in: givenStatuses}, 
                                       orderCreatedDate: {$gte : givenDate, $lte: tomorrow}}).count();
            
        } catch (error) {
            console.log(getCurrentLocalTime(), "Error >> ", error);
        }
    }

    async getAlfredOrderCountForToday() {
        let today = new Date();
        return await this.getOrderCountOnGivenDateFromGivenChannel(today, ALFREDCHANNEL);
    }
    
    async getAlfredOrderCountDeltaFromYesterday() {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1);
        let yesterdayOrderCount = await this.getOrderCountOnGivenDateFromGivenChannel(yesterday, ALFREDCHANNEL);
        let todayOrderCount = await this.getOrderCountOnGivenDateFromGivenChannel(today, ALFREDCHANNEL);
        return todayOrderCount - yesterdayOrderCount;
    }

    async getRobinOrderCountForToday() {
        let today = new Date();
        return await this.getOrderCountOnGivenDateFromGivenChannel(today, ROBINCHANNEL);
    }

    async getRobinOrderCountDeltaFromYesterday() {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1);
        let yesterdayOrderCount = await this.getOrderCountOnGivenDateFromGivenChannel(yesterday, ROBINCHANNEL);
        let todayOrderCount = await this.getOrderCountOnGivenDateFromGivenChannel(today, ROBINCHANNEL);
        return todayOrderCount - yesterdayOrderCount;
    }

    async getTotalRevenueOnGivenDateFromGivenChannels(givenDate, givenChannels = [ALFREDCHANNEL, ROBINCHANNEL]) {
        try {
            let tomorrow = new Date();
            tomorrow.setDate(givenDate.getDate() + 1); 

            givenDate.setUTCHours(0,0,0,0);
            tomorrow.setUTCHours(0,0,0,0);

            let result = await GtOrder.aggregate([
                {  $match: {    orderStatus: {$nin: ["FAILED", "CANCELLED"]},
                                orderChannel: {$in: givenChannels}, 
                                orderCreatedDate: {$gte : givenDate, $lte: tomorrow}
                           }   
                },
                {$group: {
                        _id: null,
                         totalorderAmount: {$sum: "$orderAmount"}
                        }
                }
            ]);

            console.log(getCurrentLocalTime(), "Total order amount :", result);
            return result[0].totalorderAmount;
        } catch (error) {
            console.log(getCurrentLocalTime(), "Error >> ", error);            
        }
    }

    async getTotalRevenueForToday() {
        let today = new Date();
        return await this.getTotalRevenueOnGivenDateFromGivenChannels(today);
    }
    
    async getTotalRevenueDeltaFromYesterday() {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() -1);
        let yesterdayTotalRevenue = await this.getTotalRevenueOnGivenDateFromGivenChannels(yesterday);
        let todayTotalRevenue = await this.getTotalRevenueOnGivenDateFromGivenChannels(today);
        let result = todayTotalRevenue - yesterdayTotalRevenue;

        // console.log(getCurrentLocalTime(), "Result ", result);
        return result;
    }

    async getTotalAlfredRevenueForToday() {
        let today = new Date();
        return await this.getTotalRevenueOnGivenDateFromGivenChannels(today, [ALFREDCHANNEL]);
    }

    async getTotalRobinRevenueForToday() {
        let today = new Date();
        return await this.getTotalRevenueOnGivenDateFromGivenChannels(today, [ROBINCHANNEL]);
    }

    async getTotalOrderDiscountAllTime() {
        let result = await GtOrder.aggregate([
            {$group: {
                _id: null,
                 totalOrderTotalDiscountAmount: {$sum: "$orderTotalDiscountAmount"}
                }
            }
        ]);

        return result[0].totalOrderTotalDiscountAmount;
    }

    async getTotalBizzcoinUsedAllTime() {
        let result = await GtOrder.aggregate([
            {  $match: { orderStatus: {$nin: ["FAILED", "CANCELLED"]}}   
            },
            {$group: {
                _id: null,
                totalOrderBizzcoinUsed: {$sum: "$orderBizzcoinUsed"}
                }
            }
        ]);

        return result[0].totalOrderBizzcoinUsed;    
    }

    async getTotalRevenueAllTime() {
        let result = await GtOrder.aggregate([
            {  $match: { orderStatus: {$nin: ["FAILED", "CANCELLED"]}}   
            },
            {$group: {
                _id: null,
                totalRevenue: {$sum: "$orderAmount"}
                }
            }
        ]);

        return result[0].totalRevenue;
    }

    async getTotalAlfredOrderCount() {
        return await GtOrder.find({orderChannel: ALFREDCHANNEL}).count();
    }

    async getTotalRobinOrderCount() {
        return await GtOrder.find({orderChannel: ROBINCHANNEL}).count();
    }

    async getStatewiseRevenue() {
        return await GtOrder.aggregate([
            {$match: { orderStatus: { $nin : ["FAILED", "CANCELLED"]}} },
            {$group: {
                _id: {orderState: "$orderShippingAddress.orderState"},
                orderState: {$first:"$orderShippingAddress.orderState"},
                orderRevenue: {$sum: "$orderAmount"}
                }
            },
            {$project: { _id: 0 } },
            {
              $sort: {
                  orderRevenue: -1
                }
            }
        ]);
    }

    async getStatewiseOrderCount() {
        return await GtOrder.aggregate([
            {$match: { orderStatus: { $nin : ["FAILED", "CANCELLED"]}} },
            {$group: {
                _id: {orderState: "$orderShippingAddress.orderState"},
                orderState: {$first:"$orderShippingAddress.orderState"},
                orderCount: {$sum: 1}
                }
            },
            {$project: { _id: 0 } },
            {
              $sort: {
                  orderCount: -1
                }
            }
        ]);
    }

    async getTopSellingSkusByCount(limit) {
        return await GtOrder.aggregate([
            {$match: { orderStatus: { $nin : ["FAILED", "CANCELLED"]}} },
            {$unwind: "$orderItems"},
            {$group: {
                _id: {orderSkuCode: "$orderItems.orderSkuCode"},
                orderSkuCode: { $first: "$orderItems.orderSkuCode" },
                skuCount: {$sum: "$orderItems.orderQuantity"}
                }
            },
            {$project: { _id: 0 } },
            {$sort: { 
                skuCount: -1
                }
            },
            { $limit: limit }	
        ]);
    }

    async getTopSellingSkusByRevenue(limit) {
        return await GtOrder.aggregate([
            {$match: { orderStatus: { $nin : ["FAILED", "CANCELLED"]}} },
            {$unwind: "$orderItems"},
            {$group: {
                _id: {orderSkuCode: "$orderItems.orderSkuCode"},
                orderSkuCode: { $first: "$orderItems.orderSkuCode" },
                skuRevenue: {$sum: { $multiply: ["$orderItems.orderQuantity", "$orderItems.orderPrice.orderSellingPrice"] } }
              },
            },
            {$project: { _id: 0 } },
            { $sort: { 
                skuRevenue: -1
              }
            },
            { $limit: limit }	
        ]);
    }

    async getDailyRevenueFromGivenChannelSincePastNDays(givenChannel, limit)
    {
        return await GtOrder.aggregate([
            {$match: {
                orderStatus:  { $nin : ["FAILED", "CANCELLED"]},
                orderChannel: {$eq: givenChannel}
                }
            },
            {$addFields: {
                    orderCreatedDateOnly: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$orderCreatedDate'
                        }
                    }
                }
            },
            {$group: {
                _id: '$orderCreatedDateOnly',
                ordersDate: { $first: '$orderCreatedDateOnly'},
                ordersRevenue: {$sum: '$orderAmount'}
                }
            },
            {$project: { _id: 0 } },
            {$sort: { 
                ordersDate: -1
                }
            },
            {$limit: limit}]);
    }

    async getDailyRevenueFromAlfredSincePastNDays(limit) {
        return await this.getDailyRevenueFromGivenChannelSincePastNDays(ALFREDCHANNEL, limit);
    }

    async getDailyRevenueFromRobinSincePastNDays(limit) {
        return await this.getDailyRevenueFromGivenChannelSincePastNDays(ROBINCHANNEL, limit);
    }

    async getDailyOrderCountFromGivenChannelSincePastNDays(givenChannel, limit) {
        return await GtOrder.aggregate([
            {$match: {
                orderStatus:  { $nin : ["FAILED", "CANCELLED"]},
                orderChannel: {$eq: givenChannel}
                }
            },
            {$addFields: {
                    orderCreatedDateOnly: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$orderCreatedDate'
                        }
                    }
                }
            },
            {$group: {
                _id: '$orderCreatedDateOnly',
                ordersDate: { $first: '$orderCreatedDateOnly'},
                ordersCount: {$sum: 1}
                }
            },
            {$project: { _id: 0 } },
            {$sort: { 
                ordersDate: -1
                }
            },
            {$limit: limit}]);        
    }

    async getDailyOrderCountFromAlfredSincePastNDays(limit) {
        return await this.getDailyOrderCountFromGivenChannelSincePastNDays(ALFREDCHANNEL, limit);
    }

    async getDailyOrderCountFromRobinSincePastNDays(limit) {
        return await this.getDailyOrderCountFromGivenChannelSincePastNDays(ROBINCHANNEL, limit);
    }
}
