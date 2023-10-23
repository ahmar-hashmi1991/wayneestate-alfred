import { getCurrentLocalTime, cacheCapacity } from "../../../utility";
import { GtSearchPreference } from "../GtSearchPreference";

export class SearchPreference {
    
    async getAllSearchKeywordsByBoID(boDetail) {
        let res = await GtSearchPreference.findOne({boDetail});
        return res?.keywords;
    }

    async getAllSearchSkusByBoID(boDetail) {
        let res = await GtSearchPreference.findOne({boDetail});
        return res?.skus;
    }

    async getLastNSearchedSkusByBoID({boDetail}) {        
        const res = await GtSearchPreference.find({boDetail}, {lastNSearchedSkus: 1}).populate({
            path: "lastNSearchedSkus",
            select: ["skuName"]
        });
        
        if (!res || !res.length) {
            return null;
        }
        return res[0].lastNSearchedSkus;
    }

    async createSearchPreference({input}) {
        try{
            // console.log("input >> ", input);
            let inp = {
                boDetail: input.boDetail,
                skus: [{
                    frequency: 1,
                    sku: input.sku,
                    skuLastUpdatedAt: new Date()
                }],
                lastNSearchedSkus: [input.sku]
            };
            let newSearchPref = new GtSearchPreference({...inp});
            await newSearchPref.save();
               
            return {
                success: true,
                message: "Search Preference is created successfully.",
                searchPreferenceResponse: newSearchPref
            };
        }catch (error){
            return {
                
                success: false,
                message: error?.message,
                searchPreferenceResponse: null
              }
        }       
    }

    async updateSearchPreference({input}) {
        try {

            // console.log("input >> ", input)
            let res = await GtSearchPreference.findOne({ boDetail: input.boDetail });

            // console.log("res >> ", res)
            let ind = res.skus.findIndex( skuDetail => skuDetail.sku?.toString() == input.sku?.toString());
            console.log("ind >> ", ind);

            if (ind === -1) {
                res.skus.push({
                    frequency: 1,
                    sku: input.sku,
                    skuLastUpdatedAt: new Date()
                });
            } else {
                res.skus[ind].frequency++;
                res.skus[ind].skuLastUpdatedAt = new Date();
            }

            if (res.lastNSearchedSkus.length === cacheCapacity) {
                const indForLastNSearchedSku = res.lastNSearchedSkus.findIndex(sku => sku.toString() === input.sku?.toString());
                
                if (indForLastNSearchedSku === -1) {
                    res.lastNSearchedSkus.pop();
                    res.lastNSearchedSkus.unshift(input.sku);
                } else if (indForLastNSearchedSku !== 0) {
                    res.lastNSearchedSkus.splice(indForLastNSearchedSku, 1);
                    res.lastNSearchedSkus.unshift(input.sku);
                }
            } else {
                const indForLastNSearchedSku = res.lastNSearchedSkus.findIndex(sku => sku.toString() === input.sku?.toString());
                
                if (indForLastNSearchedSku === -1) {
                    res.lastNSearchedSkus.unshift(input.sku);
                } else if (indForLastNSearchedSku !== 0) {
                    res.lastNSearchedSkus.splice(indForLastNSearchedSku, 1);
                    res.lastNSearchedSkus.unshift(input.sku);
                }
            }            


            await res.save();
            return {
                success: true,
                message: "Search preference updated successfully.",
                searchPreferenceResponse: res
            }
        } catch (error) {
            return {
                success: false,
                message: error?.message,
                searchPreferenceResponse: null
            }
        }
    }

    async isBOPresent({input}) {
        try {
            let res = await GtSearchPreference.findOne({ boDetail: input.boDetail });
            if (!res) return false;
            return true;
        } catch (error) {
            return false;
        }
    }
}
