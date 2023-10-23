
export const resolvers = {
    Query: {
        getCartWishlistById: (_, {_id}, {dataSources}) => {
            return dataSources.CartWishlistDB.getCartWishlistById(_id)
        },
        getCartWishlistByBo: (_, {_id}, {dataSources}) => {
            return dataSources.CartWishlistDB.getCartWishlistByBo({_id});
        },
        getAllCartWishlist: (_, __, {dataSources}) => {
            return dataSources.CartWishlistDB.getAllCartWishlist();
        }
    },
    Mutation: {
        
        createCartWishlist: (_, {input}, {dataSources}) => {
            return dataSources.CartWishlistDB.createCartWishlist({input});
        },
        emptyCartWishlist: (_,{boID}, {dataSources}) => {
            return dataSources.CartWishlistDB.emptyCartWishlist({boID});
        },
        updateCartWishlistByBoID: async (_, {boID, input}, {dataSources}) => {
            let cwCartItems = [];
            for (let i=0; i<input.cwCartItems.length; ++i) {
                let cartItem = input.cwCartItems[i];
                const skuObj = await dataSources.SkuDB.getSkuById(cartItem.sku);
                // console.log("skuObj >> ", skuObj);

                const resp = await skuCappingCheck(dataSources, {boID, input: cartItem});
                // console.log("updateCart resp >> ", resp);
                if (resp.success === false) {
                    cwCartItems.push({
                        sku: skuObj,
                        remaining: resp.remaining
                    });
                }
            }

            if (cwCartItems.length > 0) {
                return {
                    success: false,
                    message: "You have reached the maximum limit for this product.",
                    cartWishlist: {
                        cwCartItems: cwCartItems
                    }
                };                
            }

            return await dataSources.CartWishlistDB.updateCartWishlistByBoID({boID, input});
        },
        addCwCartItemByBoID: async (_, {boID, input}, {dataSources}) => {
            const resp = await skuCappingCheck(dataSources, {boID, input});
            console.log("addToCart resp >> ", resp);
            if (resp.success === false) {
                const skuObj = await dataSources.SkuDB.getSkuById(input.sku);
                // console.log("skuObj >> ", skuObj);
                return {
                    success: false,
                    message: resp.message,
                    cartWishlist: {
                        cwCartItems: [{
                            sku: skuObj,
                            remaining: resp.remaining
                        }]
                    }
                };
            };

            return dataSources.CartWishlistDB.addCwCartItemByBoID({boID, input});
        },
        addCwWishlistItemByBoID: (_, {boID, input}, {dataSources}) => {
            return dataSources.CartWishlistDB.addCwWishlistItemByBoID({boID, input});
        },
        addCwNotifyMeItemByBoID: (_, {boID, input}, {dataSources}) => {
            return dataSources.CartWishlistDB.addCwNotifyMeItemByBoID({boID, input});
        },
        deleteSkuFromCart: (_, {boID, skuID}, {dataSources}) => {
            return dataSources.CartWishlistDB.deleteSkuFromCart(boID, skuID);
        },
        deleteSkuFromWishlist: (_, {boID, skuID}, {dataSources}) => {
            return dataSources.CartWishlistDB.deleteSkuFromWishlist(boID, skuID);
        },
        deleteSkuFromNotifyMe: (_, {boID, skuID}, {dataSources}) => {
            return dataSources.CartWishlistDB.deleteSkuFromWishlist(boID, skuID);
        }
    }
}

const skuCappingCheck = async (dataSources, {boID, input}) => {
    // retrieve thresholdObject using skuCode(as an input)
    const thresholdObj = await dataSources.SkuDB.getThresholdObject(input.sku);

    if (JSON.stringify(thresholdObj) !== '{}') {
        console.log("threshold Obj >> ", thresholdObj);
        // check if current date is in between eligible dates
        // check if current time is in between eligible times

        const currDateTime = new Date();
        const currDate = currDateTime.toISOString().split('T')[0];
        const currTime = currDateTime.toTimeString().split(' ')[0];

        const thresholdStartDate = thresholdObj.startDate?.toISOString().split('T')[0];
        const thresholdEndDate = thresholdObj.endDate?.toISOString().split('T')[0];

        if (currDate >= thresholdStartDate && currDate <= thresholdEndDate) {
            console.log("CurrDate in between limit");
            if (currTime >= thresholdObj.startTime && currTime <= thresholdObj.endTime) {
                console.log("time is within limit");
                // fetch current user's all orders' skuCode's total ordered qty in today's date timeframe(startTime to currTime)
                const totalOrderedQty = await dataSources.OrderDB.getTotalOrderedQtyForTodaysTimeFrameForGivenSkuOfGivenBO(input.sku, boID, thresholdObj.startTime, thresholdObj.endTime);
                
                console.log("totalOrderedQty >> ", totalOrderedQty);
                const thresholdValue = thresholdObj.threshold;
                const quantity = input.quantity;

                // if value within threshold, then return true with eligible qty = totalQty, 
                // otherwise return false with eligible quantity = remaining qty

                if (thresholdValue <= totalOrderedQty) {
                    return {
                        success: false,
                        message: "You have reached the maximum limit for this product.",
                        remaining: 0
                    }
                } else {
                    const remaining = thresholdValue - totalOrderedQty;

                    if (quantity > remaining) {
                        return {
                            success: false,
                            message: "You have reached the maximum limit for this product.",
                            remaining: remaining
                        }
                    }
                }

            } else {
                console.log("time is outside limit");
            }
        } else {
            console.log("CurrDate outside limits");
        }
    }
    
    return {
        success: true,
        message: "SKU's quantity within threshold."
    }    
}
