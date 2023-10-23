import { GtConsumer } from "../GtConsumer";
import { getCurrentLocalTime } from "../../../../utility";

export class Consumer {

    async updateConsumer(_id, input){
        try {
            //console.log(getCurrentLocalTime(), "updateConsumer input >> ", input, " phoNo = ", phoneNumber);
            let newGtConsumer = await GtConsumer.updateOne({_id}, {$set: {...input}});
            //console.log(getCurrentLocalTime(), "newGtConsumer", newGtConsumer);
            return {

                success: newGtConsumer?.acknowledged,
                message: `Consumer is updated - ${newGtConsumer?.acknowledged}`,
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Update failed with error >> ", error.message);
            return {
                success: false,
                message: error?.message,
            }
        } 
    }

    async updateConsumerbyPhoneNo(phoneNumber, input){
        try {
            //console.log(getCurrentLocalTime(), "updateConsumer input >> ", input, " phoNo = ", phoneNumber);
            let newGtConsumer = await GtConsumer.updateOne({consumerPhoneNumber: phoneNumber}, {$set: {...input}});
            //console.log(getCurrentLocalTime(), "newGtConsumer", newGtConsumer);
            return {
                success: newGtConsumer?.acknowledged,
                message: `Consumer is updated - ${newGtConsumer?.acknowledged}`,
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Update failed with error >> ", error.message);
            return {
                
                success: false,
                message: error?.message,
            }
        } 
    }

    async createConsumer({ input }) {
        let newGtConsumer = new GtConsumer({ ...input });
        // console.log(getCurrentLocalTime(), "newGtConsumer", newGtConsumer);
        try {
            await newGtConsumer.save();
            console.log(getCurrentLocalTime(), "Save is successfull");
            return {
                success: true,
                message: "consumer is created successfully.",
                consumer: newGtConsumer
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Save failed");
            return {
                success: false,
                message: error?.extensions?.response?.body,
                consumer: null
            }
        }
    }
    
    // We first check if the consumer exists then update else create.
    async createOrUpdateConsumer({ input }) {

        try {
            if(input?.length)
            {
                return await Promise.all(
                    input.map(async consumer => {
                    //Checking for existing consumer with phone number
                    let existingConsumer = await this.getConsumerWithPhoneNumber(consumer?.consumerPhoneNumber);
                    //if yes the update
                    if(existingConsumer)
                    {
                        // get All BOs linked to this consumer
                       let BOs = (await this.getAllBOforConsumer(existingConsumer?._id)).consumerBoLinked;
                        //console.log(getCurrentLocalTime(), "BOs createUpdateConsumer >> ",BOs);

                       let consumerBoLinked = consumer?.consumerBoLinked;
                        if(BOs?.length)
                             consumerBoLinked = [...BOs, ...consumerBoLinked];
                        // console.log(getCurrentLocalTime(), "consumerBoLinked >> ",consumerBoLinked);
                       
                        let updConsumer = await this.updateConsumerbyPhoneNo((existingConsumer?.consumerPhoneNumber), {consumerBoLinked});
                        // console.log(getCurrentLocalTime(), "updConsumer >> ", updConsumer);
                        
                        return updConsumer;
                    }
                    else
                    {
                        let newGtConsumer = new GtConsumer({ ...consumer });
                        // console.log(getCurrentLocalTime(), "newGtConsumer", newGtConsumer);
                        await newGtConsumer.save();
                        return {
                            success: true,
                            message: "Consumer created successfully.",
                        };
                        // console.log(getCurrentLocalTime(), "Save is successfull");
                    }
                }));
            }
           
        }
        catch (error) {
            //console.log(getCurrentLocalTime(), "Save failed");
            return {
                
                success: false,
                message: error?.message,
                consumer: null
            }
        }
    }

   async getConsumerWithPhoneNumber(consumerPhoneNumber) {
        let consumer =  GtConsumer.findOne({consumerPhoneNumber});
       // console.log(getCurrentLocalTime(), "serviceAbleStates", serviceAbleStates);
        return consumer;
    }

    async getAllConsumers() {
        let consumers = await GtConsumer.find();
       // console.log(getCurrentLocalTime(), "serviceAbleStates", serviceAbleStates);
        return consumers;
    }
 
    async getAllConsumersForBO(boId){
        let consumers =  GtConsumer.find({consumerBoLinked: boId})
        // Need to check this query
        //console.log(getCurrentLocalTime(), "Get consumers for all BO >> ", consumers);
        return consumers;
    }

     async getAllBOforConsumer(consumerId){
        //console.log(getCurrentLocalTime(), "ID >> ", consumerId);
        let boForConsumer = GtConsumer.findById({_id: consumerId}, {consumerBoLinked :1})
        //console.log(getCurrentLocalTime(), "Get All BOs for this consumer >> ", boForConsumer);
        return boForConsumer;
    }

}

