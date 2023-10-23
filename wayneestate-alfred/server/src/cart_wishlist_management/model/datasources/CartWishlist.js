import { model } from 'mongoose';
import { GtCartWishlist } from '../GtCartWishlist';
import { couponTypeDiscountCategory, couponTypePercentageCode, getCurrentLocalTime } from '../../../utility';
import { GtCouponTypeConstant } from '../../../static_content_management/model/GtCouponTypeConstant';
export class CartWishlist {

    async getCartWishlistById(_id) {
        let foundCartWishlist = await GtCartWishlist.findOne({_id});
        return foundCartWishlist;
    }

    async getAllCartWishlist() {
        let cartWishlistsFound = await GtCartWishlist.find().populate(
            {path: 'boDetail',
            select: ['boMobileNumber','boFullName']})
        .populate({
            path: 'cwCartItems.sku',
            select: ['skuCode','skuName','_id']
           })
        return cartWishlistsFound;
    }
    async getCartWishlistByBo( boID){
        let currDate = Date.now();
        let discountCouponTypeID = await GtCouponTypeConstant.find({couponTypeCategory: couponTypeDiscountCategory, couponTypeCode: couponTypePercentageCode});

        let foundCartWishlist = await GtCartWishlist.findOne({boDetail: boID}).populate('boDetail').populate({
            path: 'cwCartItems.sku',
            populate: ({
                path: 'tag',
                populate: ([{
                    path: 'coupon',
                    select: ['couponAmount', 'couponCode', 'couponMinOrderValue'],
                    match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},

                },
                {
                    path: 'hookTagCoupon',
                    select: ['couponAmount', 'couponCode', 'couponMinOrderValue'],
                    match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},

                }])
            })
        })
        .populate({
            path: 'cwWishlistItems.sku',
            populate: ({
                path: 'tag',
                populate: ({
                    path: 'coupon',
                    select: ['couponAmount', 'couponCode', 'couponMinOrderValue'],
                    match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                })
            })            
        })
        .populate({
            path: 'cwNotifyMeItems.sku',
            populate: ({
                path: 'tag',
                populate: ({
                    path: 'coupon',
                    select: ['couponAmount', 'couponCode', 'couponMinOrderValue'],
                    match: {couponIsActive: true, couponEndDate: { $gte : currDate}, couponStartDate: { $lte : currDate}, couponType: discountCouponTypeID},
                })
            })            
        });
        // console.log(getCurrentLocalTime(), foundCartWishlist);
        return foundCartWishlist;
    }

    async deleteSkuFromCart( boID, skuID){
       try{
            let respCart = await GtCartWishlist.findOne({boDetail:  boID});
            let cartItems = respCart.cwCartItems;
            // console.log(getCurrentLocalTime(), "cartItems >> ", cartItems);

            if(cartItems && cartItems?.length)
            {
                // cartItems 
                const updatedCartItems = cartItems.filter( skuQty => (skuQty.sku._id != skuID) )
                // console.log(getCurrentLocalTime(), "updatedCartItems >> ", updatedCartItems)
                let deleteSkuFromCartResp = await  GtCartWishlist.updateOne({_id}, {$set : {cwCartItems: updatedCartItems}})
                console.log(getCurrentLocalTime(), ": deleteSkuFromCartResp >> ", deleteSkuFromCartResp);
                return{
                    success: true,
                    message: "Cart updated successfully."
                };
            }
            return{
                success: false,
                message:"No Cart found with this id.",
            };
            //let deleteSkuFromCartResp = await  GtCartWishlist.findOne({_id})
           
             }catch (error){
                 return {
                     success: false,
                     message: error.message,
                 }
             }
    }

    async deleteSkuFromWishlist(boID, skuID){
        try{
             let respWishList = await GtCartWishlist.findOne({boDetail: boID});
             let wishlistItems = respWishList.cwWishlistItems;
             //console.log(getCurrentLocalTime(), "wishlistItems >> ", wishlistItems);
 
             if(wishlistItems && wishlistItems?.length)
             {
                 // wishlistItems 
                 const updatedWishlistItems = wishlistItems.filter( skuQty => (skuQty.sku._id != skuID) )
                 //console.log(getCurrentLocalTime(), "updatedWishListItems >> ", updatedWishlistItems)
                 let deleteSkuFromWishlistResp = await  GtCartWishlist.updateOne({boDetail: boID}, {$set : {cwWishlistItems: updatedWishlistItems}})
                 //console.log(getCurrentLocalTime(), "deleteSkuFromWishlistResp >> ", deleteSkuFromWishlistResp);
                 return{
                     success: true,
                     message: "Wishlist updated successfully."
                 };
             }
             return{
                 success: false,
                 message:"No Wishlist found with this id.",
             };
             //let deleteSkuFromWishlistResp = await  GtCartWishlist.findOne({_id})
            
              }catch (error){
                  return {
                      success: false,
                      message: error.message,
                  }
              }
     }

     async deleteSkuFromNotifyMe(boID, skuID){
         try{
             let respNotifyMe = await GtCartWishlist.findOne({boDetail: boID});
                let notifyMeItems = respNotifyMe.cwNotifyMeItems;
                //console.log(getCurrentLocalTime(), "notifyMeItems >> ", notifyMeItems);

                if(notifyMeItems && notifyMeItems?.length)
                {
                    // notifyMeItems 
                    const updatedNotifyMeItems = notifyMeItems.filter( skuQty => (skuQty.sku._id != skuID) )
                    //console.log(getCurrentLocalTime(), "updatedNotifyMeItems >> ", updatedNotifyMeItems)
                    let deleteSkuFromNotifyMeResp = await  GtCartWishlist.updateOne({boDetail: boID}, {$set : {cwnotifyMeItems: updatedNotifyMeItems}})
                    //console.log(getCurrentLocalTime(), "deleteSkuFromNotifyMeResp >> ", deleteSkuFromNotifyMeResp);
                    return{
                        success: true,
                        message: "Notify me updated successfully."
                    };
                }
                return{
                    success: false,
                    message:"No Notify Me found with this id.",
                }
         }
         catch(error)
         {
             console.error(getCurrentLocalTime(), ": ", getCurrentLocalTime(), " : ", error.message);
             return{
                success: false,
                message: error.message,
            }
         }
     }

    async updateCartWishlistByBoID({boID, input}){
        try{
            console.log(getCurrentLocalTime(), "update cart wishlist >> ", input);
            console.log(await GtCartWishlist.findOne({boDetail: input.boID}));

            let updatedCartWishlist = await GtCartWishlist.updateOne({boDetail: boID} , {$set: {...input}})
            return{
                code:200,
                success: true,
                message:"cartWishlist updated successfully",
                cartWishlist: updatedCartWishlist
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
            }
        }
    }

    async addCwCartItemByBoID({ boID, input}) {
        try {
            let respCartWishList = await GtCartWishlist.findOne({boDetail:  boID});
            
            if (!respCartWishList) {
                console.log(getCurrentLocalTime(), " : Cart added for the first time");
                respCartWishList = new GtCartWishlist({
                    boDetail: boID,
                    cwWishlistItems: [],
                    cwCartItems: [],
                    cwNotifyMeItems: []
                });
            }

            let cartItems = respCartWishList.cwCartItems;
            let inp = {...input};
            let index = cartItems.findIndex( cartItem => cartItem.sku.toString() === inp.sku.toString());

            if (index != -1) {
                cartItems[index].quantity += inp.quantity;
            } else {
                cartItems.push(inp);
            }

            respCartWishList.cwCartItems = cartItems;

            await respCartWishList.save();
            return{
                code:200,
                success: true,
                message:"Cart Item updated successfully",
                cartWishlist: respCartWishList
            };
        } catch (error) {
            return {
                
                success: false,
                message: error.message,
            }
        }
    }

    async addCwWishlistItemByBoID({ boID, input}) {
        try {
            let respCartWishList = await GtCartWishlist.findOne({boDetail:  boID});

            let wishlistItems = respCartWishList.cwWishlistItems;
            let inp = {...input};
            
            if (wishlistItems) {
                let index = wishlistItems.findIndex( wishlistItem => wishlistItem.sku.toString() === inp.sku.toString());

                if (index != -1) {
                    wishlistItems[index].quantity += inp.quantity;
                } else {
                    wishlistItems.push(inp);
                }
            }
            respCartWishList.cwWishlistItems = wishlistItems;

            await respCartWishList.save();
            return{
                code:200,
                success: true,
                message:"WishlistItem updated successfully",
                cartWishlist: respCartWishList
            };
        } catch (error) {
            return {
                
                success: false,
                message: error?.message,
            }
        }
    }

    async addCwNotifyMeItemByBoID({ boID, input}) {
        try {
            let respCartWishList = await GtCartWishlist.findOne({boDetail:  boID});

            let notifyMeItems = respCartWishList.cwNotifyMeItems;
            let inp = {...input};
            
            if (notifyMeItems) {
                let index = notifyMeItems.findIndex( wishlistItem => wishlistItem.sku.toString() === inp.sku.toString());

                if (index != -1) {
                    notifyMeItems[index].quantity += inp.quantity;
                } else {
                    notifyMeItems.push(inp);
                }
            }
            respCartWishList.cwnotifyMeItems = notifyMeItems;

            await respCartWishList.save();
            return{
                code:200,
                success: true,
                message:"NotifyMeItem updated successfully",
                cartWishlist: respCartWishList
            };
        } catch (error) {
            return {
                
                success: false,
                message: error?.message,
            }
        }
    }

    async createCartWishlist({input}){
        try{
            let newCartWishlist = new GtCartWishlist({...input});
         
            await newCartWishlist.save();
            return {
                
                success: true,
                message: "CartWishlist is created successfully.",
                cartWishlist: newCartWishlist
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                cartWishlist: null
              }
        }
    }

    async emptyCartWishlist({boID}) {
        try {
            let res = await GtCartWishlist.updateOne({boDetail: boID}, {$set: {cwCartItems: []}});
            return {  
                success: true,
                message: "CartWishlist is emptied successfully.",
                cartWishlist: null
            };
        } catch (error) {
            return {
                
                success: false,
                message: error?.message,
                cartWishlist: null
              }
        }
    }
}