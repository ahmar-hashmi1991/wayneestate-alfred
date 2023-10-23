import { RESTDataSource } from 'apollo-datasource-rest';
import { Sku } from '../../../product_management/model/datasources/Sku';
import { Singleton } from '../../../resources';
import { CONTENT_TYPE_HEADER_JSON_VALUE, BEARER, UNAUTHORISED, getCurrentLocalTime} from '../../../utility';

export class UnicomAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.BASE_URL;
  }

  async getInventorySnapshot(skuCodes, updatedSinceInMinutes, facility, authToken) {
    let endPoint = `/services/rest/v1/inventory/inventorySnapshot/get`;
    let payload = {
      itemTypeSKUs: skuCodes,
      updatedSinceInMinutes: updatedSinceInMinutes
    };


    let authorization_value = BEARER + " " + authToken?.access_token;
    //console.log(getCurrentLocalTime(), "Payload for Get Inv Snapshot >> ", payload, "and authToken = ", authorization_value, " fac = ", facility);

    let promiseInventory = this.post(endPoint, payload, {
      headers: {
        "Facility": facility,
        "Authorization": authorization_value,
        "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
      }
    });

    try {
      const response = await promiseInventory;
      console.log(getCurrentLocalTime(), "response from GIS try block >>", response);

      if(!response.successful)
        throw response;

      if(response?.successful && response?.inventorySnapshots?.length > 0)
      {
       
        let inventorySnap = await response?.inventorySnapshots;
        const SKUobject = new Sku();
    
        let skuSyncPromise =  Promise.allSettled(inventorySnap.map(async item => await SKUobject.updateSkuQuantity(item?.itemTypeSKU, item?.inventory)))
            .then(response => console.log(getCurrentLocalTime(), "Inventory Sync Completed."))
            .catch( error => console.error(getCurrentLocalTime(), ": ", error.message));
    
        console.log(getCurrentLocalTime(), "Inventory Sync Started ");
       // console.log(getCurrentLocalTime(), "skuSyncPromise >> ", skuSyncPromise);

      }

      return {
        success: true,
        message: "Get Snapshot Successfull",
        inventorySnapshot: response?.inventorySnapshots
      };

    } catch (error) {
      console.log(getCurrentLocalTime(), "error response from GIS >>", error);
      if(error.extensions.response.statusText === UNAUTHORISED)    
      {
        console.log(getCurrentLocalTime(), "Unauthorized if block - Retrying after getting new Token", error);
        
        authToken = await Singleton.forceGetResources();
        authorization_value = BEARER + " " + authToken?.access_token;
        //console.log(getCurrentLocalTime(), "payload for Get Inv Snapshot >> ", payload, "and authToken = ", authorization_value, " fac = ", facility);

        promiseInventory = this.post(endPoint, payload, {
          headers: {
            "Facility": facility,
            "Authorization": authorization_value,
            "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
          }
        });
    
        try {
          const responseAgain = await promiseInventory;
    
          if(!responseAgain.successful)
            throw responseAgain;
    
          if(responseAgain?.successful && responseAgain?.inventorySnapshots?.length > 0)
          {
           
            let inventorySnap = await responseAgain?.inventorySnapshots;
            const SKUobject = new Sku();
        
            let skuSyncPromiseAgain =  Promise.allSettled(inventorySnap.map(async item => await SKUobject.updateSkuQuantity(item?.itemTypeSKU, item?.inventory)))
                .then(response => console.log(getCurrentLocalTime(), "Inventory Sync Completed."))
                .catch( error => console.error(getCurrentLocalTime(), ": ", error.message));
        
            console.log(getCurrentLocalTime(), "Inventory Sync Started ");
           // console.log(getCurrentLocalTime(), "skuSyncPromise >> ", skuSyncPromise);
          }
          return {
            success: true,
            message: "Get Snapshot Successfull",
            inventorySnapshot: responseAgain?.inventorySnapshots
          };
    
        } catch (error) {
          console.log(getCurrentLocalTime(), "error response from GIS >>", error);
          return {
            success: false,
            message: (error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
            inventorySnapshot: null
          };
        }

      }
      return {
        success: false,
        message: (error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
        inventorySnapshot: null
      };
    }
}

  async checkInventoryforSKU(skuCodes, updatedSinceInMinutes, facility, authToken) {

    console.log(getCurrentLocalTime(), ": Inside Check Inventory for SKU ");

    let endPoint = `/services/rest/v1/inventory/inventorySnapshot/get`;
    let payload = {
      itemTypeSKUs: skuCodes,
      updatedSinceInMinutes: updatedSinceInMinutes
    };


    let authorization_value = BEARER + " " + authToken?.access_token;
    //console.log(getCurrentLocalTime(), ": Payload for Get Inv Snapshot >> ", payload,  " fac = ", facility);

    let promiseInventory = this.post(endPoint, payload, {
      headers: {
        "Facility": facility,
        "Authorization": authorization_value,
        "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
      }
    });

    try {
      const response = await promiseInventory;
      // console.log(getCurrentLocalTime(), "response from GIS try block >>", response);

      if(!response.successful)
        throw response;

      return {
        success: true,
        message: "Check Inventory Successfull",
        inventorySnapshot: response?.inventorySnapshots
      };

    } catch (error) {

      console.log(getCurrentLocalTime(), "error response from GIS >>", error);
      if(error.extensions.response.statusText === UNAUTHORISED)    
      {
        console.log(getCurrentLocalTime(), "Unauthorized if block - Retrying after getting new Token", error);
    
        try {

          authToken = await Singleton.forceGetResources();
          authorization_value = BEARER + " " + authToken?.access_token;
          //console.log(getCurrentLocalTime(), "payload for Get Inv Snapshot >> ", payload, "and authToken = ", authorization_value, " fac = ", facility);
  
          promiseInventory = this.post(endPoint, payload, {
            headers: {
              "Facility": facility,
              "Authorization": authorization_value,
              "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
            }
          });
          
          const responseAgain = await promiseInventory;
    
          if(!responseAgain.successful)
            throw responseAgain;
    
          return {
            success: true,
            message: "Get Snapshot Successfull",
            inventorySnapshot: response?.inventorySnapshots
          };
    
        } catch (error) {
          console.log(getCurrentLocalTime(), "error response from GIS >>", error);
          return {
            success: false,
            message: (error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
            inventorySnapshot: null
          };
        }

      }
      return {
        success: false,
        message: (error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
        inventorySnapshot: null
      };
    }
  }

  async adjustSingleInventory(input, facility, authToken) {
    let endPoint = `/services/rest/v1/inventory/adjust`;

    let payload = {
      inventoryAdjustment: { ...input }
    };

    // console.log(getCurrentLocalTime(), "payload for adjustSingleInventory >> ", payload, " >> ", facility);

    let authorization_value = BEARER + " " + authToken?.access_token;
    //console.log(getCurrentLocalTime(), "payload for Get Inv Snapshot >> ", payload, "and authToken = ", authorization_value);

    let headers= {
      "Facility": facility,
      "Authorization": authorization_value,
      "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
    }
    
    let promiseInventory = this.post(endPoint, payload, headers);

    try {
      const response = await promiseInventory;
     // console.log(getCurrentLocalTime(), "response for adjust Inv >> ", response);

      if (!response.successful)
        throw response;

      return {
        success: true,
        message: "Invenotory adjusted Successfully",

      };
    } catch (error) {
      
      console.error(getCurrentLocalTime(), ": ", "error from catch >> ", error.message);

      return {
        success: false,
        message:(error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
        inventorySnapshot: null
      };
    }
  }

  async adjustMultipleInventory(input, facility, authToken) {
    let endPoint = `/services/rest/v1/inventory/adjust/bulk`;


    let payload = {
      inventoryAdjustments: input
    };

    let authorization_value = BEARER + " " + authToken?.access_token;
    //console.log(getCurrentLocalTime(), "payload for Get Inv Snapshot >> ", payload, "and authToken = ", authorization_value);

    let promiseInventory = this.post(endPoint, payload, {
      headers: {
        "Facility": facility,
        "Authorization": authorization_value,
        "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
      }
    });


    try {
      const response = await promiseInventory;

      if(!response.successful)
        throw response;

      return {
        success: true,
        message: "Inventory adjusted Successfully",
        inventoryMultipleAdjustmentResponses: response?.inventoryAdjustmentResponses
      };
    } catch (error) {
        console.error(getCurrentLocalTime(), ": ", "error from catch >> ", error.message);
      return {
        success: false,
        message:(error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
      };
    }
  }


}

