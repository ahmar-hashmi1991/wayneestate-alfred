import { getCurrentLocalTime } from "../../../utility";
import { GtCountry } from "../GtCountry";

export class Country {

    async getCountry(countryName) {
        let countryFound = await GtCountry.findOne({countryName});
        console.log(getCurrentLocalTime(), "countryFound", countryFound);
        return countryFound;
    }

    async updateCountry({countryName, input}){
        
        try {
            let newGTCountry = await GtCountry.updateOne({countryName: new RegExp(countryName, "i")},
             {$set: {...input}})
            console.log(getCurrentLocalTime(), "newCountry", newGTCountry);
            console.log(getCurrentLocalTime(), "Update is successfull");
            return {
                
                success: true,
                message: "Country is updated successfully.",
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

    async createCountry({input}) {
        let newGTCountry = new GtCountry({...input});
        console.log(getCurrentLocalTime(), "newCountry", newGTCountry);
        try {
            await newGTCountry.save();
            console.log(getCurrentLocalTime(), "Save is successfull");
            return {
                
                success: true,
                message: "Country is created successfully.",
                country: newGTCountry
            };
        }
        catch (error) {
            console.log(getCurrentLocalTime(), "Save failed");
            return {
                
                success: false,
                message: error?.message,
                country: null
            }
        }
    }

    async getAllServiceableCountries(countryIsServiceable) {
        let serviceAbleCountries = await GtCountry.find({countryIsServiceable})
       // console.log(getCurrentLocalTime(), "serviceAbleCountries", serviceAbleCountries);
        return serviceAbleCountries;
    }
}

