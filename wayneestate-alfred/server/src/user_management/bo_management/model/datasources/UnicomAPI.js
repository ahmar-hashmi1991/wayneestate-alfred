import { RESTDataSource } from 'apollo-datasource-rest';
import { AUTHORIZATION, CONTENT_TYPE_HEADER ,CONTENT_TYPE_HEADER_JSON_VALUE, BEARER, CONTACT_TYPE, PARTY_CODE, EMAIL_NA_TEMPLATE, REGISTERED_DEALER_VALUE , getCurrentLocalTime } from '../../../../utility';


export class UnicomAPI extends RESTDataSource {
   constructor() {
    super();
    //console.log(getCurrentLocalTime(), "Hi this is constructor");
    this.baseURL = process.env.BASE_URL;
  }



  async createBoDetail(userInput,authToken) {

    //console.log(getCurrentLocalTime(), "userInput >>>", userInput, "/n/n");

    let endPoint = `/services/rest/v1/oms/customer/create`;
    let authorization_value = BEARER + " " + authToken?.access_token;
    //creating customer payload for unicom create customer API
    let payload = {
      customer: {
          name: (userInput.boFirstName).concat(` ${userInput.boLastName}`),
          code: userInput._id, //Mandotory
          gstNumber: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? (userInput.boBusinessDetail.boBillingAddress[0].boGSTNumber) : null,
          registeredDealer: REGISTERED_DEALER_VALUE,
          enabled: userInput?.boIsActive,
          billingAddress: {
              addressLine1: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? (userInput.boBusinessDetail.boBillingAddress[0].boAddressLine1) : null,
              addressLine2: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? (userInput.boBusinessDetail.boBillingAddress[0].boAddressLine2) : null,
              city: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? userInput.boBusinessDetail.boBillingAddress[0].city : null,
              stateCode: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? userInput.boBusinessDetail.boBillingAddress[0].stateISO2Code : null,
              countryCode: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? userInput.boBusinessDetail.boBillingAddress[0].countryCode : null,
              addressType: userInput?.boBusinessDetail?.boBillingAddress[0]?.boAddressName,
              pincode: userInput?.boBusinessDetail?.boBillingAddress[0]?.pincode,
              phone: userInput?.boMobileNumber[0],
              partyCode: PARTY_CODE,
          },
          shippingAddress: {
            addressLine1: (userInput?.boShippingAddress?.length) ? (userInput.boShippingAddress[0].boAddressLine1) : null,
            addressLine2: (userInput?.boShippingAddress?.length) ? (userInput.boShippingAddress[0].boAddressLine2) : null,
            city: (userInput?.boShippingAddress?.length) ? (userInput.boShippingAddress[0].city) : null,
            stateCode: (userInput?.boShippingAddress?.length) ? (userInput.boShippingAddress[0].stateISO2Code) : null,
            countryCode: (userInput?.boShippingAddress?.length) ? (userInput.boShippingAddress[0].countryCode) : null,
            addressType: (userInput?.boShippingAddress?.length) ? (userInput.boShippingAddress[0].boAddressName) : null,
            pincode: userInput?.boShippingAddress[0]?.pincode,
            phone: userInput?.boMobileNumber[0],
            partyCode: PARTY_CODE,
          },
          partyContacts: [
            {
               contactType: CONTACT_TYPE,
               partyCode: PARTY_CODE,
               name: (userInput.boFirstName).concat(` ${userInput.boLastName}`),
               email: (userInput?.boEmail) ? userInput.boEmail : EMAIL_NA_TEMPLATE ,
               phone: userInput?.boMobileNumber[0],
            }
          ]
        }
     };

    // Remove all keys in the payload with null values or undefined
    Object.keys(payload).forEach(key => {
      if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
          delete obj[key];
      }
    });
    
    try{
      return await this.post(endPoint, payload,{
        headers: {
          "Facility": facility,
          "Authorization": authorization_value,
          "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
        }
      });
    }
    catch(error)
    {
      //console.log(getCurrentLocalTime(), "Error while posting to unicom - create customer ", error.message)
      return error.message;
    }
  }

  async updateBoDetail(_id, userInput, initialBoDetail, authToken){
  
    let endPoint = `/services/rest/v1/oms/customer/edit`;
    let authorization_value = BEARER + " " + authToken?.access_token;
    //creating customer payload for unicom create customer API
    let payload = {
      customer: {
          name: (initialBoDetail.boFirstName).concat(` ${initialBoDetail.boLastName}`),
          code: _id, //Mandotory
          gstNumber: initialBoDetail?.boBusinessDetail?.boBillingAddress?.length ? initialBoDetail.boBusinessDetail.boBillingAddress[0]?.boGSTNumber : null,
          registeredDealer: REGISTERED_DEALER_VALUE,
          enabled: initialBoDetail?.boIsActive,
          billingAddress: initialBoDetail?.boBusinessDetail?.boBillingAddress?.length ? {
              addressLine1: initialBoDetail.boBusinessDetail.boBillingAddress[0].boAddressLine1,
              addressLine2: initialBoDetail.boBusinessDetail.boBillingAddress[0].boAddressLine2,
              city: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? userInput.boBusinessDetail.boBillingAddress[0].city : null,
              stateCode: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? userInput.boBusinessDetail.boBillingAddress[0].stateISO2Code : null,
              countryCode: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? userInput.boBusinessDetail.boBillingAddress[0].countryCode : null,
              addressType: initialBoDetail?.boBusinessDetail?.boBillingAddress[0]?.boAddressName,
              pincode: (userInput?.boBusinessDetail?.boBillingAddress?.length) ? userInput?.boBusinessDetail?.boBillingAddress[0]?.pincode : null,
              phone: (initialBoDetail?.boMobileNumber[0])
          } : null,
          shippingAddress: (initialBoDetail?.boShippingAddress?.length) ? {
            addressLine1: initialBoDetail?.boShippingAddress[0]?.boAddressLine1,
            addressLine2: initialBoDetail?.boShippingAddress[0]?.boAddressLine2,
            city: (userInput?.boShippingAddress?.length) ? (userInput.boShippingAddress[0].city) : null,
            stateCode: (userInput?.boShippingAddress?.length) ? (userInput.boShippingAddress[0].stateISO2Code) : null,
            countryCode: (userInput?.boShippingAddress?.length) ? (userInput.boShippingAddress[0].countryCode) : null,
            addressType: initialBoDetail.boShippingAddress[0].boAddressName,
            pincode: (userInput?.boShippingAddress?.length) ? userInput?.boShippingAddress[0]?.pincode : null,
            phone: initialBoDetail?.boMobileNumber[0]
          } : null,
          partyContacts: [
            {
               contactType: CONTACT_TYPE,
               partyCode: PARTY_CODE,
               name: (initialBoDetail.boFirstName).concat(` ${initialBoDetail.boLastName}`),
               email: (initialBoDetail?.boEmail) ? initialBoDetail.boEmail : EMAIL_NA_TEMPLATE,
               phone: (initialBoDetail?.boMobileNumber?.length) ? (initialBoDetail?.boMobileNumber[0]) : null,
            }
          ]
        }
     };

     // Remove all keys in the payload with null values or undefined
     Object.keys(payload).forEach(key => {
       if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
         delete obj[key];
       }
     });

    try{
        console.log(getCurrentLocalTime(), "userInput >> ", userInput, "\n\n");
        console.log(getCurrentLocalTime(), "payloiad at Upload >>", payload);
        let res = await this.post(endPoint, payload, {
          headers: {
            "Facility": facility,
            "Authorization": authorization_value,
            "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
          }
        });
        if(res.successful === false)
         throw res.errors;
        console.log(getCurrentLocalTime(), "Update Customer in Unicom Success >> \n\n", res)
        return res;
      }
      catch(error)
      {
        console.log(getCurrentLocalTime(), "Error while posting to unicom - create customer ", {...error})
        return error.message;
      }
  }
}

