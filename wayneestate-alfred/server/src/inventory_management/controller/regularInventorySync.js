import { BEARER, getCurrentLocalTime } from "../../utility";
import { Singleton } from "../../resources";
import { Sku } from "../../product_management/model/datasources/Sku";

import fetch from "node-fetch";

export const callGetInventorySnapshotAPI = async (facility) => {

  

  let baseURL = process.env.BASE_URL + `/services/rest/v1/inventory/inventorySnapshot/get`;
  let responseInventorySnapshot;

  try {

    const updatedSinceInMinutes24Hr = 1440;

    // Commenting the code since we dont need all the SKUs to fetch the snapshot, by default it considers all SKUs available.
    
    let skuCodes = await (new Sku()).getAllSkuCodes();
    // console.log(getCurrentLocalTime(), "SKU CODES >> ", skuCodes);
    
    let authToken = await Singleton.getResources();
    const authorization_value = `${BEARER} ${authToken?.access_token}`;

    let payload = {
      itemTypeSKUs: skuCodes
    };

    await fetch(baseURL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorization_value,
          "Facility": facility
        },
        body: JSON.stringify(payload),
      })
      .then(response => response.json())
      .then(inventorySnapshot => {
        // console.log(getCurrentLocalTime(), "inventorySnapshot >> ", inventorySnapshot);
        responseInventorySnapshot = inventorySnapshot;
      });

      if(responseInventorySnapshot?.successful && responseInventorySnapshot?.inventorySnapshots?.length > 0)
      {
       
        let inventorySnap = await responseInventorySnapshot?.inventorySnapshots;
    
        const SKUobject = new Sku();
    
        let skuSyncPromise =  Promise.allSettled(inventorySnap.map(async item => await SKUobject.updateSkuQuantity(item?.itemTypeSKU, item?.inventory)))
            .then(response => console.log(getCurrentLocalTime(), ": Inventory Sync Completed from facility >> ", facility))
            .catch( error => console.error(getCurrentLocalTime(), ": ", error.message));
    
       
       // console.log(getCurrentLocalTime(), "skuSyncPromise >> ", skuSyncPromise);
      }
  }
  catch (error) {
    console.log(getCurrentLocalTime(), getCurrentLocalTime(), ": Error in GIS Cycle", error.message);
  }

   


}

export const callGetInventorySnapshotAPIAndIncrement = async (facility) => {

  

  let baseURL = process.env.BASE_URL + `/services/rest/v1/inventory/inventorySnapshot/get`;
  let responseInventorySnapshot;

  try {

    // Commenting the code since we dont need all the SKUs to fetch the snapshot, by default it considers all SKUs available.
    
    let skuCodes = await (new Sku()).getAllSkuCodes();
    //console.log(getCurrentLocalTime(), "SKU CODES >> ", skuCodes);

    let authToken = await Singleton.getResources();
    const authorization_value = `${BEARER} ${authToken?.access_token}`;

    let payload = {
      itemTypeSKUs: skuCodes
    };

    await fetch(baseURL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorization_value,
          "Facility": facility
        },
        body: JSON.stringify(payload),
      })
      .then(response => response.json())
      .then(inventorySnapshot => {
        // console.log(getCurrentLocalTime(), "inventorySnapshot >> ", inventorySnapshot);
        responseInventorySnapshot = inventorySnapshot;
      });

      if(responseInventorySnapshot?.successful && responseInventorySnapshot?.inventorySnapshots?.length > 0)
      {
       
        let inventorySnap = await responseInventorySnapshot?.inventorySnapshots;
    
        const SKUobject = new Sku();
    
        let skuSyncPromise =  Promise.allSettled(inventorySnap.map(async item => await SKUobject.incrementSkuQuantity(item?.itemTypeSKU, item?.inventory)))
            .then(response => console.log(getCurrentLocalTime(), ": Increment Inventory Sync Completed from facility >> ", facility))
            .catch( error => console.error(getCurrentLocalTime(), ": ", error.message));
    
      
      }
  }
  catch (error) {
    console.log(getCurrentLocalTime(), ": Error in GIS Cycle", error.message);
  }

   


}
