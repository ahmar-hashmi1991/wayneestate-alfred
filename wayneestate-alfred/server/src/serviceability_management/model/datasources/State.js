import { GtCountry } from "../GtCountry";
import { GtState } from "../GtState";
import { getCurrentLocalTime } from "../../../utility";

export class State {

    async getState(stateName) {
        let stateFound = await GtState.findOne({stateName});
        let countryFound = await GtCountry.findOne({_id: stateFound.country});     
        return stateFound;
    }


    async updateState({stateName, input}){
        try {
            let newGTState = await GtState.updateOne({stateName: new RegExp(stateName, "i")},
             {$set: {...input}})
            console.log(getCurrentLocalTime(), "newState", newGTState);
            console.log(getCurrentLocalTime(), "Update is successfull");
            return {
                
                success: true,
                message: "State is updated successfully.",
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

    async createState({ input }) {
        let newGtState = new GtState({ ...input });
        console.log(getCurrentLocalTime(), "newGtState", newGtState);
        try {
            await newGtState.save();
            console.log(getCurrentLocalTime(), "Save is successfull");
            return {
                
                success: true,
                message: "State is created successfully.",
                state: newGtState
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Save failed");
            return {
                
                success: false,
                message: error?.extensions?.response?.body,
                state: null
            }
        }
    }

    async getAllServiceableStates(stateIsServiceable) {
        let serviceAbleStates = await GtState.find({stateIsServiceable})
       // console.log(getCurrentLocalTime(), "serviceAbleStates", serviceAbleStates);
        return serviceAbleStates;
    }
}

