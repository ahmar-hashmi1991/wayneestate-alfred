import { GtPincode } from "../GtPincode";
import { GtSku } from "../../../product_management/model/GtSku";
import { notNullAndUndefinedCheck ,getCurrentLocalTime } from '../../../utility'

export class Pincode {

    async getPincode(pincode) {
        let pincodeFound = await GtPincode.findOne({pincode}).populate({
            path: 'state',
            populate: {
                path: 'country',
                model: 'GtCountry'
        }});
        // console.log(getCurrentLocalTime(), "pincodeFound", pincodeFound);
        return pincodeFound;
    }

    async getAllServiceablePincodes(pincodeIsServiceable) {
        let serviceAblePincodes = await GtPincode.find({pincodeIsServiceable}).populate({
            path: 'state',
            populate: {
                path: 'country',
                model: 'GtCountry'
        }});
        // console.log(getCurrentLocalTime(), "serviceAblePincodes", serviceAblePincodes);
        return serviceAblePincodes;
    }

    async getAllPincodes(offset,limit) {
        
          //When frontend sends a request with both offset and limit we send a response with pagination.
          if(notNullAndUndefinedCheck(offset) && notNullAndUndefinedCheck(limit)){

            return await GtPincode.find().skip(offset).limit(limit)
            .populate({
                path: 'state',
                populate: {
                    path: 'country',
                    model: 'GtCountry'
            }});

          } else {
            //Response without pagination
            return await GtPincode.find().populate({
                path: 'state',
                populate: {
                    path: 'country',
                    model: 'GtCountry'
            }});

           }    
     
    }

    async createPincode({ input }) {
        let newGtPincode = new GtPincode({ ...input });
        console.log(getCurrentLocalTime(), "pincode", newGtPincode);
        try {
            await newGtPincode.save();
            console.log(getCurrentLocalTime(), "Save is successfull");
            return {
                
                success: true,
                message: "Pincode is created successfully.",
                pincode: newGtPincode
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Save failed");
            return {
                
                success: false,
                message: error?.message,
                pincode: null
            }
        }
    }

    async updatePincode({pincode, input}){
        try {

            let newGTPincode = await GtPincode.updateOne({pincode}, {$set: {...input}})
            let currGtPincode = await GtPincode.findOne({pincode});

            // If pincode is made non-serviceable, the SKU prices of that pincode if any will be deleted.
            if (!input?.pincodeIsServiceable) {      
                await GtSku.updateMany(
                    {"skuPrice.pincodeLevelSellingPrice": { "$elemMatch": { "pincode" : currGtPincode._id }}}, 
                    { $pull: {"skuPrice.pincodeLevelSellingPrice": { "pincode": currGtPincode._id }}}
                );
            }
            // console.log(getCurrentLocalTime(), "newPincode", newGTPincode);
            // console.log(getCurrentLocalTime(), "Update is successfull");
            return {
                
                success: true,
                message: "Pincode is updated successfully.",
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Update failed");
            return {
                
                success: false,
                message: error?.message,
            }
        } 
    }
    
    async deletePincodeById({_id}){
        return await GtPincode.deleteOne({_id});
    }
}

