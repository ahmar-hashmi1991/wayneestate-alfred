import { GtBoDetail } from '../GtBoDetail';
import { GtPincode } from '../../../../serviceability_management/model/GtPincode';
import { getCurrentLocalTime, notNullAndUndefinedCheck } from '../../../../utility';

export class BoDetail {

    async isBOActive( _id)
    {
        try{
            let activeFlag = await GtBoDetail.findById(_id, {boIsActive: 1})
            return activeFlag;    
        }
        catch(error)
        {
            console.log(getCurrentLocalTime(), " Error in Active test >> ", error);
            return false;
        }
    }

    async getBoByID({ _id }) {
        try {
            let boFound = await GtBoDetail.findOne({ _id }).populate({
                path: 'boShippingAddress.pincode',
                populate: ({
                    path: 'state',
                    populate: {
                        path: 'country'
                    }
                })
            }).populate({
                path: 'boBusinessDetail.boBillingAddress.pincode',
                populate: ({
                    path: 'state',
                    populate: {
                        path: 'country'
                    }
                })
            }).populate({
                path: 'boBusinessDetail.boKYCDocumentDetail.kycDocumentConstant'
            });
            
            if(boFound)
                return {
                    success: true,
                    message: "BoDetail Found successfully.",
                    boDetail: boFound
                };
            else
                return {
                    success: false,
                    message: "No such BO found",
                    boDetail: null
                }
        }
        catch (error) {
            console.log(getCurrentLocalTime(), ": getBoByID failed >> ", error.message);
            return {
                success: false,
                message: error.message,
                boDetail: null
            }
        }

    }

    async getBoByMobileNo({ boMobileNumber }) {
        
        try {
            
            let boFoundByMobile = await GtBoDetail.findOne({ boMobileNumber }).populate({
                path: 'boShippingAddress.pincode',
                populate: ({
                    path: 'state',
                    populate: {
                        path: 'country'
                    }
                })
            }).populate({
                path: 'boBusinessDetail.boBillingAddress.pincode',
                populate: ({
                    path: 'state',
                    populate: {
                        path: 'country'
                    }
                })
            }).populate({
                path: 'boBusinessDetail.boKYCDocumentDetail.kycDocumentConstant'
            });

            if(boFoundByMobile)
                return {
                    success: true,
                    message: "BoDetail Found successfully.",
                    boDetail: boFoundByMobile
                };
            else
                return {
                    success: false,
                    message: "No such BO found",
                    boDetail: null
                }
        }
        catch (error) {
            console.log(getCurrentLocalTime(), ": GetBoByID failed >> ", error.message);
            return {
                success: false,
                message: error.message,
                boDetail: null
            }
        }
    }

    async countAllUsers() {
        return await GtBoDetail.count({ boIsActive: true })
    }
    
    async getAllBOsForNewAlfred(offset,limit) {
          
                //When frontend sends a request with both offset and limit we send a response with pagination.
            if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){
                
                return await GtBoDetail.find().sort({boCreatedDate: -1}).skip(offset).limit(limit)
                .populate({
                    path: 'boShippingAddress.pincode',
                    populate: ({
                        path: 'state',
                        populate: {
                            path: 'country'
                        }
                    })
                }).populate({
                    path: 'boBusinessDetail.boBillingAddress.pincode',
                    populate: ({
                        path: 'state',
                        populate: {
                            path: 'country'
                        }
                    })
                }).populate({
                    path: 'boBusinessDetail.boKYCDocumentDetail.kycDocumentConstant'
                });
    
              } else {

                //Response without pagination
                return await GtBoDetail.find().sort({boCreatedDate: -1})
                .populate({
                    path: 'boShippingAddress.pincode',
                    populate: ({
                        path: 'state',
                        populate: {
                            path: 'country'
                        }
                    })
                }).populate({
                    path: 'boBusinessDetail.boBillingAddress.pincode',
                    populate: ({
                        path: 'state',
                        populate: {
                            path: 'country'
                        }
                    })
                }).populate({
                    path: 'boBusinessDetail.boKYCDocumentDetail.kycDocumentConstant'
                });
              }        

    }

    async getAllBOs(boMobileNumber,boFullName) {

        if(boMobileNumber){
        return await GtBoDetail.find({boMobileNumber: boMobileNumber}).populate({
            path: 'boShippingAddress.pincode',
            populate: ({
                path: 'state',
                populate: {
                    path: 'country'
                }
            })
        }).populate({
            path: 'boBusinessDetail.boBillingAddress.pincode',
            populate: ({
                path: 'state',
                populate: {
                    path: 'country'
                }
            })
        }).populate({
            path: 'boBusinessDetail.boKYCDocumentDetail.kycDocumentConstant'
        });

    }

    if(boFullName){
        return await GtBoDetail.find({boFullName: boFullName}).populate({
            path: 'boShippingAddress.pincode',
            populate: ({
                path: 'state',
                populate: {
                    path: 'country'
                }
            })
        }).populate({
            path: 'boBusinessDetail.boBillingAddress.pincode',
            populate: ({
                path: 'state',
                populate: {
                    path: 'country'
                }
            })
        }).populate({
            path: 'boBusinessDetail.boKYCDocumentDetail.kycDocumentConstant'
        });

    }

    return await GtBoDetail.find({}).sort({boLastUpdateDate: -1}).limit(50).populate({
        path: 'boShippingAddress.pincode',
        populate: ({
            path: 'state',
            populate: {
                path: 'country'
            }
        })
    }).populate({
        path: 'boBusinessDetail.boBillingAddress.pincode',
        populate: ({
            path: 'state',
            populate: {
                path: 'country'
            }
        })
    }).populate({
        path: 'boBusinessDetail.boKYCDocumentDetail.kycDocumentConstant'
    });


    }

    async createBoDetail(input) {

        // Fetching pincode from Shipping Address and converting into ID
        let pincode = (input?.boShippingAddress?.length > 0) ? (input.boShippingAddress[0].pincode) : false;
        if (pincode) {
            let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1, pincodeDistrict: 1 });
            //console.log(getCurrentLocalTime(), "Hello boShippingAddress Pincode ID >>", pincodeRes);
            input.boShippingAddress[0].pincode = pincodeRes._id;
        }

        // Fetching pincode from Billing Address and converting into ID
        pincode = (input?.boBusinessDetail?.boBillingAddress?.length > 0) ? (input.boBusinessDetail.boBillingAddress[0].pincode) : false;
        if (pincode) {
            let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1, pincodeDistrict: 1 });
            //console.log(getCurrentLocalTime(), "Hello boBillingAddress Pincode ID >>", pincodeRes._id);
            input.boBusinessDetail.boBillingAddress[0].pincode = pincodeRes._id;
        }

        // Fetching pincode from Virtual Shop Address and converting into ID
        pincode = (input?.boVirtualShopDetail?.boShopAddress?.pincode)
        console.log(getCurrentLocalTime(), "pincode = ", pincode);
        if (pincode) {
            let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1 });
            //console.log(getCurrentLocalTime(), "Hello boVirtualShopDetail Address Pincode ID >>", pincodeRes._id);
            input.boVirtualShopDetail.boShopAddress.pincode = pincodeRes._id;
        }

        
        // console.log(getCurrentLocalTime(), "input from CBD >> ", input);

        let newBoDetail = new GtBoDetail({ ...input });
        try {
            await newBoDetail.save();
            //console.log(getCurrentLocalTime(), "Save is successfull");
            //console.log(getCurrentLocalTime(), "newBoDetail after save", newBoDetail);
            return {
                
                success: true,
                message: "BoDetail is created successfully.",
                boDetail: newBoDetail
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Save failed >> ", error.message);
            return {
                success: false,
                message: error.message,
                boDetail: null
            }
        }
    }

    async createMultipleBO(input) {

        console.log(getCurrentLocalTime(), ": Input from createMultipleBO >> ", input);

        const multipleBO = await Promise.all(input.map(async boUser => {
            
            // Fetching pincode from Shipping Address and converting into ID
            let pincode = (boUser?.boShippingAddress?.length > 0) ? (boUser.boShippingAddress[0].pincode) : false;
            if (pincode) {
                let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1, pincodeDistrict: 1 });
                //console.log(getCurrentLocalTime(), "Hello boShippingAddress Pincode ID >>", pincodeRes);
                boUser.boShippingAddress[0].pincode = pincodeRes._id;
            }

            // Fetching pincode from Billing Address and converting into ID
            pincode = (boUser?.boBusinessDetail?.boBillingAddress?.length > 0) ? (boUser.boBusinessDetail.boBillingAddress[0].pincode) : false;
            if (pincode) {
                let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1, pincodeDistrict: 1 });
                //console.log(getCurrentLocalTime(), "Hello boBillingAddress Pincode ID >>", pincodeRes._id);
                boUser.boBusinessDetail.boBillingAddress[0].pincode = pincodeRes._id;
            }

            // Fetching pincode from Virtual Shop Address and converting into ID
            pincode = (boUser?.boVirtualShopDetail?.boShopAddress?.pincode)
            if (pincode) {
                let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1 });
                //console.log(getCurrentLocalTime(), "Hello boVirtualShopDetail Address Pincode ID >>", pincodeRes._id);
                boUser.boVirtualShopDetail.boShopAddress.pincode = pincodeRes._id;
            }
            return boUser;
        }));
        
        console.log(getCurrentLocalTime(), ": boUsers from Create Multiple BO >> ", multipleBO);
        // let newBoDetail = new GtBoDetail({ ...boUser });
        try {
                let resultFromGotham; 

                if(multipleBO && multipleBO.length>0)
                    resultFromGotham = await GtBoDetail.insertMany(multipleBO);

                console.log(getCurrentLocalTime(), ": BoDetails creation >> ", resultFromGotham);
           
                if(!resultFromGotham)
                    throw resultFromGotham;

                return {
                    success: true,
                    message: "BOs are created successfully.",
                };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), ": Save failed >> ", error.message);
            return {
                success: false,
                message: error.message,
            }
        }
    }

    async deductBizzCoin(_id, noOfCoins){
        console.log(getCurrentLocalTime(), ": _id and noOfCoins >>> ", noOfCoins);
        try{
            let coin =  await GtBoDetail.updateOne({_id}, {$inc : {"boReward.boBizzCoin" : -noOfCoins}});
            return coin;
        }
        catch(error)
        {
            console.error(getCurrentLocalTime(), ": Some error at deductBizzCoin", error);
            return false;
            
        }
    }

    async giftBizzCoin(_id, noOfCoins){
        console.log(getCurrentLocalTime(), ": _id and noOfCoins >>> ", noOfCoins);
        try{
            let coin =  await GtBoDetail.updateOne({_id}, {$inc : {"boReward.boBizzCoin" : noOfCoins}});
            // console.log(getCurrentLocalTime(), "coin >>> ", coin);
            return coin;
        }
        catch(error)
        {
            console.error(getCurrentLocalTime(), ": Some error at giftbizzcoin", error);
            return false;
        }
       
    }

    async updateBusinessDetailInBoDetail(_id, input) {
        try {
            let getBoDetail = await GtBoDetail.findById({ _id });

            if(input?.boBusinessDetail)
            {
                //input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentNumber || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0].boDocumentNumbe || nullr
                input.boBusinessDetail.boLegalBusinessName = input?.boBusinessDetail?.boLegalBusinessName || getBoDetail?.boBusinessDetail?.boLegalBusinessName || null;
                input.boBusinessDetail.boBankAccountNumber = input?.boBusinessDetail?.boBankAccountNumber || getBoDetail?.boBusinessDetail?.boBankAccountNumber || null;
                input.boBusinessDetail.boBankAccountHolderName = input?.boBusinessDetail?.boBankAccountHolderName || getBoDetail?.boBusinessDetail?.boBankAccountHolderName || null;
                input.boBusinessDetail.boUpiId = input?.boBusinessDetail.boUpiId || getBoDetail?.boBusinessDetail.boUpiId || null;
                input.boBusinessDetail.boIsKycVerified = (input?.boBusinessDetail?.boIsKycVerified !== null || input?.boBusinessDetail?.boIsKycVerified !== "" || input?.boBusinessDetail?.boIsKycVerified !== undefined) ?  input?.boBusinessDetail?.boIsKycVerified :  (getBoDetail?.boBusinessDetail?.boIsKycVerified || null);
                input.boBusinessDetail.boKycRejectReason = input?.boBusinessDetail?.boKycRejectReason || getBoDetail?.boBusinessDetail?.boKycRejectReason || null;
                if(input?.boBusinessDetail?.boKYCDocumentDetail?.length > 0 )
                {
                    input.boBusinessDetail.boKYCDocumentDetail[0].kycDocumentConstant = input.boBusinessDetail.boKYCDocumentDetail[0]?.kycDocumentConstant || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.kycDocumentConstant || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentNumber = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentNumber || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentNumber || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentExpiryDate = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentExpiryDate || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentExpiryDate || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentImageFront = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentImageFront || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentImageFront || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentImageBack = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentImageBack || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentImageBack || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentVerifyStatus = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentVerifyStatus || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentVerifyStatus || null;
                }
                else
                    input.boBusinessDetail.boKYCDocumentDetail =  getBoDetail?.boBusinessDetail.boKYCDocumentDetail;

                if(input?.boBusinessDetail?.boBillingAddress?.length > 0)
                {
                    input.boBusinessDetail.boBillingAddress[0].boGSTNumber = input.boBusinessDetail.boBillingAddress[0]?.boGSTNumber || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boGSTNumber || null;
                    input.boBusinessDetail.boBillingAddress[0].boAddressName = input.boBusinessDetail.boBillingAddress[0]?.boAddressName || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boAddressName || null;
                    input.boBusinessDetail.boBillingAddress[0].boAddressLine1 = input.boBusinessDetail.boBillingAddress[0]?.boAddressLine1 || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boAddressLine1 || null;
                    input.boBusinessDetail.boBillingAddress[0].boAddressLine2 = input.boBusinessDetail.boBillingAddress[0]?.boAddressLine2 || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boAddressLine2 || null;
                    input.boBusinessDetail.boBillingAddress[0].boMapLocation = input.boBusinessDetail.boBillingAddress[0]?.boMapLocation || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boMapLocation || null;
        
                    // Fetching pincode from Billing Address and converting into ID
                    let pincode = (input?.boBusinessDetail?.boBillingAddress?.length > 0) ? (input.boBusinessDetail.boBillingAddress[0].pincode) : false;
                    if (pincode) {
                        let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1, pincodeDistrict: 1 });
                        //console.log(getCurrentLocalTime(), "Hello boBillingAddress Pincode ID >>", pincodeRes._id);
                        input.boBusinessDetail.boBillingAddress[0].pincode = pincodeRes._id;
                    }
                    else
                        input.boBusinessDetail.boBillingAddress[0].pincode = getBoDetail?.boBusinessDetail.boBillingAddress[0].pincode;
                }
                else
                    input.boBusinessDetail.boBillingAddress = getBoDetail?.boBusinessDetail.boBillingAddress;
            }

            let boDetail = await GtBoDetail.findOneAndUpdate({ _id }, { $set: { ...input } });
            
            // console.log(getCurrentLocalTime(), "Update is successfull >> \n\n", boDetail);

            return {
                success: true,
                message: "Bo User is updated successfully.",
                // isUnicomUpdateRequired: isUnicomUpdateRequired,
                // initialBoDetail: initialBoDetail,
                boDetail: boDetail,
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Save failed with message >> ", error);
            return {
                success: false,
                message: error.message,
            }
        }
    }

    async updateMultipleBusinessDetailInBoDetail(input) {
        try {
        
                    //console.log(getCurrentLocalTime(), "Raw input >> ", input);
        
                    let respMult = await Promise.all(input.map( async item => {
                       
                        let boBusinessDetail = {
                            boLegalBusinessName: item.boLegalBusinessName,
                            boBillingAddress: [{
                                boGSTNumber: item.boGSTNumber,
                                boAddressName: item.boAddressName,
                                boAddressLine1: item.boAddressLine1,
                                boAddressLine2: item.boAddressLine2,
                                pincode: item.pincode,
                                boMapLocation: item.boMapLocation
                            }]
                        };
        
                        console.log(getCurrentLocalTime(), "Processed Input >>>> ", item.boID, " >>>> ", {boBusinessDetail});
                        let resp = await this.updateBusinessDetailInBoDetail(item.boID, {boBusinessDetail});
                        return resp;
        
                    }))
        
                    return{
                        message: "Bo Business Details successfully updated.",
                        success: true
                    }

            // for (let i=0; i<input.length; i++) {

            //     let boBusinessDetail = {
            //         boLegalBusinessName: input[i].boLegalBusinessName,
            //         boBillingAddress: [{
            //             boGSTNumber: input[i].boGSTNumber,
            //             boAddressName: input[i].boAddressName,
            //             boAddressLine1: input[i].boAddressLine1,
            //             boAddressLine2: input[i].boAddressLine2,
            //             pincode: input[i].pincode,
            //             boMapLocation: input[i].boMapLocation
            //         }]
            //     };

            //     console.log(getCurrentLocalTime(), "input for ",i," ", input[i].boID, {boBusinessDetail});
            //     let resp = await this.updateBusinessDetailInBoDetail(input[i].boID, {boBusinessDetail});
                
            //     if (!resp.success) {
            //         return {
            //             success: false,
            //             message: "Bo User Biling address updation failed."
            //         }
            //     }
            // }
            // return {
            //     success: true,
            //     message: "All BO Details updated successfully."
            // };
        } catch (error) {
            console.log(getCurrentLocalTime(), "Save failed with updateMultipleBusinessDetailInBoDetail message >> ", error);
            return {
                success: false,
                message: error.message,
            }    
        }
    }

    async updateMultipleBoDetail(input) {
        try {
            for (let i=0; i<input.length; i++) {
                let resp = await this.updateBoDetail(input[i].boID, input[i].boDetail);
    
                if (!resp.success) {
                    return {
                        success: false,
                        message: "Bo User updation failed."
                    };    
                }
            }

            return {
                success: true,
                message: "All BO Details updated successfully."
            };
        } catch (error) {
            console.log(getCurrentLocalTime(), "Save failed with message >> ", error);
            return {
                success: false,
                message: error.message,
            }    
        }
    }

    async updateBoDetail( _id, input ) {
        
        try {    

            let getBoDetail = await GtBoDetail.findById({ _id });
            
             //  console.log(getCurrentLocalTime(), "input >> ", input.boBusinessDetail);
            // If the input contains any of the following params, then the customer is likely to be updated on unicom as well
            if(input?.boShippingAddress?.length > 0)
            {
           
                input.boShippingAddress[0].boAddressName = input?.boShippingAddress[0]?.boAddressName || getBoDetail?.boShippingAddress[0]?.boAddressName || null;
                input.boShippingAddress[0].boAddressLine1 = input?.boShippingAddress[0]?.boAddressLine1 || getBoDetail?.boShippingAddress[0]?.boAddressLine1 || null;
                input.boShippingAddress[0].boAddressLine2 = input?.boShippingAddress[0]?.boAddressLine2 || getBoDetail?.boShippingAddress[0]?.boAddressLine2 || null;
                input.boShippingAddress[0].boMapLocation = input?.boShippingAddress[0]?.boMapLocation || getBoDetail?.boShippingAddress[0]?.boMapLocation || null;
                // Fetching pincode from Shipping Address and converting into ID
                let pincode = (input.boShippingAddress[0].pincode) || false;
                if (pincode) {
              
                    let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1, pincodeDistrict: 1 });
                    //console.log(getCurrentLocalTime(), "Hello boShippingAddress Pincode ID >>", pincodeRes);
                    input.boShippingAddress[0].pincode = pincodeRes._id;
                }
                else
                    input.boShippingAddress[0].pincode = getBoDetail?.boShippingAddress[0].pincode;
            }

            if(input?.boBusinessDetail)
            {
                //input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentNumber || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0].boDocumentNumbe || nullr
                input.boBusinessDetail.boLegalBusinessName = input?.boBusinessDetail?.boLegalBusinessName || getBoDetail?.boBusinessDetail?.boLegalBusinessName || null;
                input.boBusinessDetail.boBankAccountNumber = input?.boBusinessDetail?.boBankAccountNumber || getBoDetail?.boBusinessDetail?.boBankAccountNumber || null;
                input.boBusinessDetail.boBankAccountHolderName = input?.boBusinessDetail?.boBankAccountHolderName || getBoDetail?.boBusinessDetail?.boBankAccountHolderName || null;
                input.boBusinessDetail.boUpiId = input?.boBusinessDetail.boUpiId || getBoDetail?.boBusinessDetail.boUpiId || null;
                input.boBusinessDetail.boIsKycVerified = (input?.boBusinessDetail?.boIsKycVerified !== null || input?.boBusinessDetail?.boIsKycVerified !== "" || input?.boBusinessDetail?.boIsKycVerified !== undefined) ?  input?.boBusinessDetail?.boIsKycVerified :  (getBoDetail?.boBusinessDetail?.boIsKycVerified || null);
                input.boBusinessDetail.boKycRejectReason = input?.boBusinessDetail?.boKycRejectReason || getBoDetail?.boBusinessDetail?.boKycRejectReason || null;
                if(input?.boBusinessDetail?.boKYCDocumentDetail?.length > 0 )
                {
                    input.boBusinessDetail.boKYCDocumentDetail[0].kycDocumentConstant = input.boBusinessDetail.boKYCDocumentDetail[0]?.kycDocumentConstant || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.kycDocumentConstant || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentNumber = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentNumber || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentNumber || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentExpiryDate = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentExpiryDate || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentExpiryDate || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentImageFront = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentImageFront || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentImageFront || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentImageBack = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentImageBack || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentImageBack || null;
                    input.boBusinessDetail.boKYCDocumentDetail[0].boDocumentVerifyStatus = input.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentVerifyStatus || getBoDetail?.boBusinessDetail.boKYCDocumentDetail[0]?.boDocumentVerifyStatus || null;
                }
                else
                    input.boBusinessDetail.boKYCDocumentDetail =  getBoDetail?.boBusinessDetail.boKYCDocumentDetail;

                if(input?.boBusinessDetail?.boBillingAddress?.length > 0)
                {
                    input.boBusinessDetail.boBillingAddress[0].boGSTNumber = input.boBusinessDetail.boBillingAddress[0]?.boGSTNumber || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boGSTNumber || null;
                    input.boBusinessDetail.boBillingAddress[0].boAddressName = input.boBusinessDetail.boBillingAddress[0]?.boAddressName || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boAddressName || null;
                    input.boBusinessDetail.boBillingAddress[0].boAddressLine1 = input.boBusinessDetail.boBillingAddress[0]?.boAddressLine1 || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boAddressLine1 || null;
                    input.boBusinessDetail.boBillingAddress[0].boAddressLine2 = input.boBusinessDetail.boBillingAddress[0]?.boAddressLine2 || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boAddressLine2 || null;
                    input.boBusinessDetail.boBillingAddress[0].boMapLocation = input.boBusinessDetail.boBillingAddress[0]?.boMapLocation || getBoDetail?.boBusinessDetail.boBillingAddress[0]?.boMapLocation || null;
        
                    // Fetching pincode from Billing Address and converting into ID
                    let pincode = (input?.boBusinessDetail?.boBillingAddress?.length > 0) ? (input.boBusinessDetail.boBillingAddress[0].pincode) : false;
                    if (pincode) {
                        let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1, pincodeDistrict: 1 });
                        //console.log(getCurrentLocalTime(), "Hello boBillingAddress Pincode ID >>", pincodeRes._id);
                        input.boBusinessDetail.boBillingAddress[0].pincode = pincodeRes._id;
                    }
                    else
                        input.boBusinessDetail.boBillingAddress[0].pincode = getBoDetail?.boBusinessDetail.boBillingAddress[0].pincode;
                }
                else
                    input.boBusinessDetail.boBillingAddress = getBoDetail?.boBusinessDetail.boBillingAddress;
            }

            if(input?.boVirtualShopDetail)
            {
                input.boBusinessDetail.boShopName = input?.boBusinessDetail?.boShopName || getBoDetail?.boBusinessDetail?.boShopName || null;
                input.boBusinessDetail.boDisplayShopName = input?.boBusinessDetail?.boDisplayShopName || getBoDetail?.boBusinessDetail?.boDisplayShopName || null;
                input.boBusinessDetail.boShopImages = input?.boBusinessDetail?.boShopImages || getBoDetail?.boBusinessDetail?.boShopImages || null;
                input.boBusinessDetail.boShopTagLine = input?.boBusinessDetail?.boShopTagLine || getBoDetail?.boBusinessDetail?.boShopTagLine || null;
                input.boBusinessDetail.boShopPrefCategories = input?.boBusinessDetail?.boShopPrefCategories || getBoDetail?.boBusinessDetail?.boShopPrefCategories || null;
                if(input?.boBusinessDetail?.boShopAddress)
                {
                    input.boBusinessDetail.boShopAddress.boAddresLine2 = input.boBusinessDetail.boShopAddress.boAddresLine2 || getBoDetail?.boBusinessDetail?.boShopAddress?.boAddresLine2 || null;
                    input.boBusinessDetail.boShopAddress.boAddresLine1 = input.boBusinessDetail.boShopAddress.boAddresLine1 || getBoDetail?.boBusinessDetail?.boShopAddress?.boAddresLine1 || null;
                    input.boBusinessDetail.boShopAddress.boAddresLine3 = input.boBusinessDetail.boShopAddress.boAddresLine3 || getBoDetail?.boBusinessDetail?.boShopAddress?.boAddresLine3 || null;
                    input.boBusinessDetail.boShopAddress.boMapLocation = input.boBusinessDetail.boShopAddress.boMapLocation || getBoDetail?.boBusinessDetail?.boShopAddress?.boMapLocation || null;
                    input.boBusinessDetail.boShopAddress.boDocumentImageBack = input.boBusinessDetail.boShopAddress.boDocumentImageBack || getBoDetail?.boBusinessDetail?.boShopAddress?.boDocumentImageBack || null;
                    
                    // Fetching pincode from Virtual Shop Address and converting into ID
                    let pincode = (input?.boVirtualShopDetail?.boShopAddress?.pincode)
                    if (pincode) {
                        let pincodeRes = await GtPincode.findOne({ pincode: pincode }, { _id: 1 });
                        //console.log(getCurrentLocalTime(), "Hello boVirtualShopDetail Address Pincode ID >>", pincodeRes._id);
                        input.boVirtualShopDetail.boShopAddress.pincode = pincodeRes._id;
                    }
                    else
                        input.boVirtualShopDetail.boShopAddress.pincode = getBoDetail?.boVirtualShopDetail.boShopAddress.pincode
                }
                else
                    input.boVirtualShopDetail.boShopAddress =  getBoDetail?.boVirtualShopDetail.boShopAddress;
            }

            if(input?.boRating)
            {
                input.boRating.boRatingByBizztm = input.boRating.boRatingByBizztm || getBoDetail?.boRating.boRatingByBizztm || null;
                input.boRating.boRatingByConsumers = input.boRating.boRatingByBizztm || getBoDetail?.boRating.boRatingByBizztm || null;
            }


            let boDetail = await GtBoDetail.findOneAndUpdate({ _id }, { $set: { ...input } });
            
            // console.log(getCurrentLocalTime(), "Update is successfull >> \n\n", boDetail);

            return {
                success: true,
                message: "Bo User is updated successfully.",
                // isUnicomUpdateRequired: isUnicomUpdateRequired,
                // initialBoDetail: initialBoDetail,
                boDetail: boDetail,
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Save failed with message >> ", error);
            return {
                success: false,
                message: error.message,
            }
        }
    }


    async getAllFcmRegistrationTokens() {
        let tokens = await GtBoDetail.find({ $and: [{ boFCMRegistrationToken : { $exists: true }}, {boFCMRegistrationToken: {$ne : ""}}] }, {boFCMRegistrationToken: 1});
       
        let resTokenArr = tokens.map(tokenObj => tokenObj.boFCMRegistrationToken);
        // console.log("tokens >> ", resTokenArr);
        return resTokenArr;
    } 


}

