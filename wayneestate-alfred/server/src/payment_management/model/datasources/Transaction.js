
import { GtTransaction } from '../GtTransaction';

export class Transaction {

    async getAllTransactions() {
        return await GtTransaction.find();
    }

    async getTransactionById(_id) {
        return await GtTransaction.findOne({_id});
    }

    async createTransaction(input){
        let newTransaction = new GtTransaction(input);
        try{
            await newTransaction.save();
            return {
                
                success: true,
                message: "Transaction is created successfully.",
                transaction: newTransaction
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                transaction: null
              }
        }
    }

    async updateTransaction({_id, input}){
        try{
            let updatedTransaction = await GtTransaction.updateOne({_id},{$set: {...input}})
            return{
                success: true,
                message:"Transaction updated successfully",
                transaction: updatedTransaction
            };
        }catch (error){
            return {
                
                success: false,
                message: error.extensions.response.status,
                transaction: null
            }
        }
    }
}

