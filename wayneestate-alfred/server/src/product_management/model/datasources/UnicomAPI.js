import { RESTDataSource } from 'apollo-datasource-rest';
import { CONTENT_TYPE_HEADER_JSON_VALUE, BEARER, GST_TAX_TYPE_CODE, ITEM_TYPE, TAX_TYPE_CODE, getCurrentLocalTime } from '../../../utility';



export class UnicomAPI extends RESTDataSource {
  constructor() {
    super();
    //console.log(getCurrentLocalTime(), "Hi this is constructor");
    this.baseURL = process.env.BASE_URL;
  }



  async createCategory(userInput, authToken) {
    let endPoint = `/services/rest/v1/product/category/addOrEdit`;
    let authorization_value = BEARER + " " + authToken?.access_token;
    // console.log(getCurrentLocalTime(), "userInput >>>", userInput); 

    //creating product payload for unicom create customer API
    let payload = {
      category: {
        code: userInput.categoryCode,
        name: userInput.categoryDisplayName,
        taxTypeCode: TAX_TYPE_CODE,
        gstTaxTypeCode: 0,
      }
    };

    // 
    // gstTaxTypeCode: GST_TAX_TYPE_CODE,

    Object.keys(payload).forEach(key => {
      if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
        delete obj[key];
      }
    });

    try {

      let catRes = this.post(endPoint, payload, {
        headers: {
          "Authorization": authorization_value,
          "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
        }
      });

      const response = await catRes;
      // console.log(getCurrentLocalTime(), "response from >>", response);
      return response;
    }
    catch (error) {
      console.log(getCurrentLocalTime(), "Error Message >>", error);
    }

  }

  async updateCategory(userInput, authToken) {
    let endPoint = `/services/rest/v1/product/category/addOrEdit`;
    let authorization_value = BEARER + " " + authToken?.access_token;
    //console.log(getCurrentLocalTime(), "userInput >>>", userInput, "/n/n"); 

    //creating product payload for unicom create customer API
    let payload = {
      category: {
        code: userInput.categoryCode,
        name: userInput.categoryDisplayName,
        taxTypeCode: TAX_TYPE_CODE,
        gstTaxTypeCode: GST_TAX_TYPE_CODE,
      }
    };


    Object.keys(payload).forEach(key => {
      if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
        delete obj[key];
      }
    });



    try {

      let catRes = this.post(endPoint, payload, {
        headers: {
          "Authorization": authorization_value,
          "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
        }
      });

      const response = await catRes;
      // console.log(getCurrentLocalTime(), "response from >>", response);
      return response;
    }
    catch (error) {
      console.log(getCurrentLocalTime(), "Error Message >>", error);
    }

  }

  async createProduct(userInput, authToken) {

    let authorization_value = BEARER + " " + authToken?.access_token;

    // console.log(getCurrentLocalTime(), "userInput >>>", userInput, "/n/n");

    let endPoint = `/services/rest/v1/catalog/itemType/createOrEdit`;

    //creating product payload for unicom create customer API
    let payload = {

      itemType: {
        categoryCode: userInput.categoryCode,
        skuCode: (userInput?.skuCode) ? (userInput.skuCode) : null,
        name: (userInput?.skuName) ? (userInput.skuName) : null,
        type: ITEM_TYPE,
        description: (userInput?.skuDescriptions[0]) ? (userInput.skuDescriptions[0]) : null,
        scanIdentifier: (userInput?.skuScanIdentifier) ? (userInput.skuScanIdentifier) : null,
        length: (userInput?.skuLength) ? (userInput.skuLength) : null,
        width: (userInput?.skuBreadth) ? (userInput.skuBreadth) : null,
        height: (userInput?.skuHeight) ? (userInput.skuHeight) : null,
        weight: (userInput?.skuWeight) ? (userInput.skuWeight) : null,
        minOrderSize: (userInput?.skuMinOrder) ? (userInput.skuMinOrder) : null,
        brand: (userInput?.productBrand) ? (userInput.productBrand) : null,
        ean: (userInput?.skuEAN) ? (userInput.skuEAN) : null,
        maxRetailPrice: (userInput?.skuPrice?.msp) ? (userInput.skuPrice.msp) : null,
        basePrice: (userInput?.skuPrice?.boPrice) ? (userInput.skuPrice.boPrice) : null,
        costPrice: (userInput?.skuPrice?.costPrice) ? (userInput.skuPrice.costPrice) : null,
        taxTypeCode: TAX_TYPE_CODE,
        gstTaxTypeCode: (userInput?.skuPrice?.gstPercent) ? (userInput.skuPrice.gstPercent) : null,
        hsnCode: (userInput?.productHsnCode) ? (userInput.productHsnCode) : null,
        shelfLife: (userInput?.productShelfLifeinDays) ? (userInput.productShelfLifeinDays) : null,
        expirable: userInput.productExpirable,
        enabled: userInput.skuIsActive
      }

    };

    

    try {
           let res = await this.post(endPoint, payload, {
             headers: {
               "Authorization": authorization_value,
               "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
             }
           });

        if (!res.successful)
          throw res;

        return {
            success: true,
            message: "Product Created Successfully on Uniware",
        };
    }
    catch (error) {
      console.log(getCurrentLocalTime(), ": Error Message >>", error);
      return {
        success: false,
        message: (error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
      }
    }
  }

  async createMultipleProduct(userInput, authToken) {

    let authorization_value = BEARER + " " + authToken?.access_token;

    // console.log(getCurrentLocalTime(), "userInput >>>", userInput, "/n/n");

    let endPoint = `/services/rest/v1/catalog/itemTypes/createOrEdit`;

    //creating product payload for unicom create customer API

    const itemTypes = userInput.map( sku => {
      return {
        categoryCode: sku.categoryCode,
        skuCode: (sku?.skuCode) ? (sku.skuCode) : null,
        name: (sku?.skuName) ? (sku.skuName) : null,
        type: ITEM_TYPE,
        description: (sku?.skuDescriptions[0]) ? (sku.skuDescriptions[0]) : null,
        scanIdentifier: (sku?.skuScanIdentifier) ? (sku.skuScanIdentifier) : null,
        length: (sku?.skuLength) ? (sku.skuLength) : null,
        width: (sku?.skuBreadth) ? (sku.skuBreadth) : null,
        height: (sku?.skuHeight) ? (sku.skuHeight) : null,
        weight: (sku?.skuWeight) ? (sku.skuWeight) : null,
        minOrderSize: (sku?.skuMinOrder) ? (sku.skuMinOrder) : null,
        brand: (sku?.productBrand) ? (sku.productBrand) : null,
        ean: (sku?.skuEAN) ? (sku.skuEAN) : null,
        maxRetailPrice: (sku?.skuPrice?.msp) ? (sku.skuPrice.msp) : null,
        basePrice: (sku?.skuPrice?.boPrice) ? (sku.skuPrice.boPrice) : null,
        costPrice: (sku?.skuPrice?.costPrice) ? (sku.skuPrice.costPrice) : null,
        taxTypeCode: TAX_TYPE_CODE,
        gstTaxTypeCode: (sku?.skuPrice?.gstPercent) ? (sku.skuPrice.gstPercent) : null,
        hsnCode: (sku?.productHsnCode) ? (sku.productHsnCode) : null,
        shelfLife: (sku?.productShelfLifeinDays) ? (sku.productShelfLifeinDays) : null,
        expirable: sku.productExpirable,
        enabled: sku.skuIsActive
      }
    });

    
    let payload = {itemTypes};

    console.log(getCurrentLocalTime()+ ": Payload for Create Multipl Product on Uniware >>> ", JSON.stringify(payload));

    // Object.keys(payload).forEach(key => {
    //   if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
    //     delete obj[key];
    //   }});

    try {
           let res = await this.post(endPoint, payload, {
             headers: {
               "Authorization": authorization_value,
               "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
             }
           });

           console.log(getCurrentLocalTime()+ ": Response from Create Multiple Product on Uniware >>> ", res);

          return {
            success: true,
            message: "Product created Successfully on Uniware",
          };
    }
    catch (error) {
      console.log(getCurrentLocalTime(), ": Error Message >>", error);
      return {
        success: false,
        message: (error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
      }
    }
  }

  async updateProduct(input, authToken) {

    // console.log(getCurrentLocalTime(), "input >>>", input, "/n/n");

    let endPoint = `/services/rest/v1/catalog/itemType/createOrEdit`;


    let authorization_value = BEARER + " " + authToken?.access_token;
    //creating product payload for unicom create customer API
    let payload = {

      itemType: {
        categoryCode: input.categoryCode,
        skuCode: (input?.skuCode) ? (input.skuCode) : null,
        name: (input?.skuName) ? (input.skuName) : null,
        type: ITEM_TYPE,
        description: (input?.skuDescriptions) ? (input.skuDescriptions[0]) : null,
        scanIdentifier: (input?.skuScanIdentifier) ? (input.skuScanIdentifier) : null,
        length: (input?.skuLength) ? (input.skuLength) : null,
        width: (input?.skuBreadth) ? (input.skuBreadth) : null,
        height: (input?.skuHeight) ? (input.skuHeight) : null,
        weight: (input?.skuWeight) ? (input.skuWeight) : null,
        minOrderSize: (input?.skuMinOrder) ? (input.skuMinOrder) : null,
        brand: (input?.productBrand) ? (input.productBrand) : null,
        ean: (input?.skuEAN) ? (input.skuEAN) : null,
        maxRetailPrice: (input?.skuPrice?.msp) ? (input.skuPrice.msp) : null,
        basePrice: (input?.skuPrice?.boPrice) ? (input.skuPrice.boPrice) : null,
        costPrice: (input?.skuPrice?.costPrice) ? (input.skuPrice.costPrice) : null,
        taxTypeCode: TAX_TYPE_CODE,
        gstTaxTypeCode: (input?.skuPrice?.gstPercent) ? (input.skuPrice.gstPercent) : null,
        hsnCode: (input?.productHsnCode) ? (input.productHsnCode) : null,
        shelfLife: (input?.productShelfLifeinDays) ? (input.productShelfLifeinDays) : null,
        expirable: input.productExpirable,
        enabled: input.skuIsActive
      }

    };

    Object.keys(payload.itemType).forEach(key => {
      if (payload.itemType[key] === null || payload.itemType[key] === undefined || payload.itemType[key] === '') {
        delete payload.itemType[key];
      }
    });

    // console.log(getCurrentLocalTime(), "Payload >> ", JSON.stringify(payload));

    let res = null;
    try {
      res = await this.post(endPoint, payload, {
        headers: {
          "Authorization": authorization_value,
          "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
        }
      });

      // console.log(getCurrentLocalTime(), "success created sale order in unicom", res);

    if (!res.successful)
        throw res
      return {
        success: true,
        message: "Product updated Successfully on Uniware",
      };
    }
    catch (error) {
      // console.log(getCurrentLocalTime(), "Error Message >>", error.message);
      return {
        success: false,
        message: (error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
      }
    }

  }

  async updateMultipleProduct(input, authToken)
  {
      //console.log(getCurrentLocalTime(), "input >>>", input, "/n/n");
  
      let endPoint = `/services/rest/v1/catalog/itemTypes/createOrEdit`;
      let authorization_value = BEARER + " " + authToken?.access_token;

      //creating product payload for unicom create customer API
      const itemTypes = input.map(skuDetail => {

          const skuUpdObj = {
            categoryCode: skuDetail.categoryCode,
            skuCode: (skuDetail?.skuCode) ? (skuDetail.skuCode) : null,
            name: (skuDetail?.skuName) ? (skuDetail.skuName) : null,
            type: ITEM_TYPE,
            description: (skuDetail?.skuDescriptions) ? (skuDetail.skuDescriptions[0]) : null,
            scanIdentifier: (skuDetail?.skuScanIdentifier) ? (skuDetail.skuScanIdentifier) : null,
            length: (skuDetail?.skuLength) ? (skuDetail.skuLength) : null,
            width: (skuDetail?.skuBreadth) ? (skuDetail.skuBreadth) : null,
            height: (skuDetail?.skuHeight) ? (skuDetail.skuHeight) : null,
            weight: (skuDetail?.skuWeight) ? (skuDetail.skuWeight) : null,
            minOrderSize: (skuDetail?.skuMinOrder) ? (skuDetail.skuMinOrder) : null,
            brand: (skuDetail?.productBrand) ? (skuDetail.productBrand) : null,
            ean: (skuDetail?.skuEAN) ? (skuDetail.skuEAN) : null,
            maxRetailPrice: (skuDetail?.skuPrice?.msp) ? (skuDetail.skuPrice.msp) : null,
            basePrice: (skuDetail?.skuPrice?.boPrice) ? (skuDetail.skuPrice.boPrice) : null,
            costPrice: (skuDetail?.skuPrice?.costPrice) ? (skuDetail.skuPrice.costPrice) : null,
            taxTypeCode: TAX_TYPE_CODE,
            gstTaxTypeCode: (skuDetail?.skuPrice?.gstPercent) ? (skuDetail.skuPrice.gstPercent) : null,
            hsnCode: (skuDetail?.productHsnCode) ? (skuDetail.productHsnCode) : null,
            shelfLife: (skuDetail?.productShelfLifeinDays) ? (skuDetail.productShelfLifeinDays) : null,
            expirable: skuDetail.productExpirable,
            enabled: skuDetail.skuIsActive
          };

          Object.keys(skuUpdObj).forEach(key => {
            if (skuUpdObj[key] === null || skuUpdObj[key] === undefined || skuUpdObj[key] === '') {
              delete skuUpdObj[key];
            }
          });
          return skuUpdObj;
      });

      let payload = {itemTypes};
  
      console.log(getCurrentLocalTime()+ ": Payload for Update Multipl Product on Uniware >>> ", JSON.stringify(payload));
      // console.log("Payload >> ", JSON.stringify(payload));
  
      let res = null;
      try {
        res = await this.post(endPoint, payload, {
          headers: {
            "Authorization": authorization_value,
            "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
          }
        });
  
        console.log(getCurrentLocalTime(), "Successfully updated sale order in unicom", res);
  
      if (!res.successful)
          throw res;

        return {
          success: true,
          message: "Product updated Successfully on Uniware.",
        };
      }
      catch (error) {
         console.log(getCurrentLocalTime(), ": Error Message >>", error);
        return {
          success: false,
          message: (error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
        }
      }
  }


}

