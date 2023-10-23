import { GtOrderPreference } from "../GtOrderPreference";

export class OrderPreference {
    
    async getAllOrderPreferenceSkusByBoID({boDetail}) {
        let res = await GtOrderPreference.findOne({boDetail});
        return res?.skus;
    }

    async createOrderPreference({input}) {
        try{
            console.log("input >> ", input);
            let inp = {
                boDetail: input.boDetail,
                skus: [input.sku]
            };
            let newOrderPref = new GtOrderPreference({...inp});
            await newOrderPref.save();
               
            return {
                success: true,
                message: "Order Preference is created successfully.",
                orderPrference: newOrderPref
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                orderPreference: null
              }
        }       
    }

    async updateOrderPreference({input}) {
        try {
            console.log("input >> ", input);
            let res = await GtOrderPreference.updateOne({ boDetail: input.boDetail }, { $addToSet: {skus: input.sku}});
            return {
                success: true,
                message: "Order preference updated successfully.",
                orderPreference: res
            }
        } catch (error) {
            return {
                success: false,
                message: error?.message,
                orderPreference: null
            }
        }
    }

    async isBOPresent({input}) {
        try {
            let res = await GtOrderPreference.findOne({ boDetail: input.boDetail });
            if (!res) return false;
            return true;
        } catch (error) {
            return false;
        }
    }
}
