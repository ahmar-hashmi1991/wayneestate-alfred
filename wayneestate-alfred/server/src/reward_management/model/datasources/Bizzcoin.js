import { TRANSACTION_TYPE_CREDIT, PARTICULARS_SIGNUP, BIZZCOIN_SIGNUP_AMOUNT } from '../../../utility';
import { GtBizzcoin } from '../GtBizzcoin';

export class Bizzcoin {

    async getBizzcoinById(_id){
        let foundBizzcoin = await GtBizzcoin.findOne({_id});
        return foundBizzcoin;
    }

   async getAllBizzcoins(){
        let allBizzcoins = await GtBizzcoin.find();
        return allBizzcoins;
    }

    async getBizzcoinByBoId(_id){
        let foundBizzcoin = await GtBizzcoin.find({boDetail:_id});
        // console.log(getCurrentLocalTime(), foundBizzcoin);
        return foundBizzcoin;
    }

    async createBizzcoin({input}){
      
        if(input.bizzcoinType === TRANSACTION_TYPE_CREDIT && input.bizzcoinParticulars === PARTICULARS_SIGNUP){
            input.bizzcoinAmount = BIZZCOIN_SIGNUP_AMOUNT
        } 
     
       
        let newGtBizzcoin = new GtBizzcoin({...input});

        try{
            await newGtBizzcoin.save();
            return {
                
                success: true,
                message: "Bizzcoin is created successfully.",
                bizzcoin: newGtBizzcoin
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                bizzcoin: null
              }
        }
    }

    async updateBizzcoin({_id, input}){
        try{
            let updatedBizzcoin = await GtBizzcoin.updateOne({_id},{$set: {...input}})
            return{
                code:200,
                success: true,
                message:"Bizzcoin updated successfully",
                bizzcoin: updatedBizzcoin
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                bizzcoin: null
            }
        }
    }
}

 