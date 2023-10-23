import { RESTDataSource } from 'apollo-datasource-rest';
import { CONTENT_TYPE_HEADER_JSON_VALUE, BEARER, ALFREDCHANNEL, CURRENCY_CODE, TRANXN_NOTE, NOTIF_EMAIL, ADD_REF_BILL, ADD_REF_SHIP, ZERO, SHIP_METHOD_CODE, CHANNEL_PROD_ID, PAYMENT_METHOD_COD, PAYMENT_METHOD_OTHER, FORCEALLOCATE_VALUE, CONTENT_TYPE_HEADER_PDF_VALUE, SALE_ORDER_ID_PREFIX, getCurrentLocalTime, PAY_ON_DELIVERY, CASH_ON_DELIVERY } from '../../../utility';
import { GtOrder } from '../GtOrder';


export class UnicomAPI extends RESTDataSource {
  constructor() {
    super();
    //console.log(getCurrentLocalTime(), "Hi this is constructor");
      this.baseURL = process.env.BASE_URL;
  }


  async createSaleOrder(userInput, authToken) {

    //console.log(getCurrentLocalTime(), "userInput >>>", userInput, "/n/n");

    let endPoint = `/services/rest/v1/oms/saleOrder/create`;

    let authorization_value = BEARER + " " + authToken?.access_token;
    let unicomSaleOrderItems = [];
    
    for (let i = 0; i < userInput?.orderItems?.length; i++) {
      let orderItem = userInput?.orderItems[i];
      for (let j = 0; j < orderItem.orderQuantity; j++) {
        let unicomSaleOrderItem = {
          itemName: orderItem.orderSkuName,
          itemSku: orderItem.orderSkuCode,
          shippingMethodCode: SHIP_METHOD_CODE,
          sellingPrice: orderItem.orderPrice.orderSellingPrice, //amount after discount and tax
          shippingCharges: ZERO,
          totalPrice: orderItem.orderPrice.orderTotalPrice,
          discount: orderItem.orderPrice.orderDiscountAmount, //amount in Rs 
          shippingMethodCharges: ZERO,
          channelTransferPrice: ZERO,
          shippingAddress: { referenceId: ADD_REF_SHIP },
          //facilityCode: DEMOSTAGING_FAC_CODE, // Change it to Delhi or Kota as when required if force allocating
          code: `${orderItem.orderSkuCode}-${j}`, // SKU code + Quantity item
          packetNumber: ZERO,
          channelProductId: CHANNEL_PROD_ID,
        }
        unicomSaleOrderItems.push(unicomSaleOrderItem);
      }
    }

    // Creating SO-ID for the first time here.
    const saleOrderID = await this.generateSaleOrderCode();
    userInput.saleOrderID = saleOrderID;

    // console.log(getCurrentLocalTime(), "saleOrder ID >> ", userInput);
    //creating product payload for unicom create customer API
    let payload = {
      saleOrder:
      {
        code: saleOrderID,
        channel: ALFREDCHANNEL, // Channel = "Robin" did not seem to work in Uniware, hence we made it to default, that is CUSTOM
        displayOrderDateTime: new Date(),
        cashOnDelivery: (userInput?.orderPaymentMethod === PAY_ON_DELIVERY || userInput?.orderPaymentMethod === CASH_ON_DELIVERY) ? true : false,
        currencyCode: CURRENCY_CODE,
        transactionId: (userInput?.orderPaymentMethod === PAY_ON_DELIVERY) ?
          `${PAYMENT_METHOD_COD}${userInput?.orderID}` : `${PAYMENT_METHOD_OTHER}${userInput?.orderID}`,
        transactionDate: new Date(),
        amountPaid: (userInput?.orderPaymentMethod === 'PREPAID') ? userInput?.orderAmount : ZERO,
        paymentMode: userInput?.orderPaymentMethod,
        transactionNote: TRANXN_NOTE,
        displayOrderCode: userInput?.orderID,
        customerGSTIN: userInput?.orderBoGSTNumber,
        //customerCode: userInput?.boDetail,  --There's no use of sending this data, as eventually we are sending all the info in our payload that was getting fetched from Customer - Unicommerce
        customerName: userInput?.orderBoFullName,
        notificationEmail: NOTIF_EMAIL,
        notificationMobile: userInput?.orderBoPhone,
        addresses: [
          {
            name: userInput?.orderBoFullName,
            addressLine1: userInput?.orderShippingAddress?.orderAddressLine1,
            addressLine2: userInput?.orderShippingAddress?.orderAddressLine2,
            city: userInput?.orderShippingAddress?.orderDistrict,
            district: userInput?.orderShippingAddress?.orderDistrict,
            pincode: userInput?.orderShippingAddress?.orderPincode,
            phone: userInput?.orderBoPhone,
            country: userInput?.orderShippingAddress?.orderCountry,
            state: userInput?.orderShippingAddress?.orderState,
            id: ADD_REF_SHIP
          },
          (userInput?.orderBillingAddress) ? {
            name: userInput?.orderBillingAddress?.orderLegalBusinessName,
            addressLine1: userInput?.orderBillingAddress?.orderAddressLine1,
            addressLine2: userInput?.orderBillingAddress?.orderAddressLine2,
            city: userInput?.orderBillingAddress?.orderDistrict,
            district: userInput?.orderBillingAddress?.orderDistrict,
            pincode: userInput?.orderBillingAddress?.orderPincode,
            phone: userInput?.orderBoPhone,
            country: userInput?.orderBillingAddress?.orderCountry,
            state: userInput?.orderBillingAddress?.orderState,
            id: ADD_REF_BILL
          } : null, 
        ],
        billingAddress: (userInput.orderBillingAddress) ? { referenceId: ADD_REF_BILL } : null,
        shippingAddress: { referenceId: ADD_REF_SHIP },
        totalDiscount: null, //We can send either this or item level discount
        totalGiftWrapCharges: ZERO,
        totalShippingCharges: userInput?.orderShippingCharges,
        totalCashOnDeliveryCharges: ZERO,
        totalStoreCredit: ZERO,
        totalPrepaidAmount: (userInput?.orderPaymentMethod === 'PREPAID') ? userInput?.orderAmount : ZERO,
        saleOrderItems: unicomSaleOrderItems
      },
      //forceAllocate: FORCEALLOCATE_VALUE,
     };

     if(!userInput.billingAddress)
     {
       let filterredAddress = (payload.saleOrder.addresses).filter(item => (item!==null));
       payload.saleOrder.addresses = filterredAddress;
       // console.log(getCurrentLocalTime(), "payload?.saleOrder?.addresses >> ", payload.saleOrder.addresses)
     }
    
     // console.log(getCurrentLocalTime(), "payload at Create Sale Order > ", payload);

      
      
      let promiseSaleOrder = this.post(endPoint, payload,{
        headers: {
          "Authorization": authorization_value,
          "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
        }
      });

      try {
        const response = await promiseSaleOrder;
        return response;
       
      } catch(error) {
        console.log(getCurrentLocalTime(), ": Error from catch >> ", error);
          return {
            successful: false,
            message:(error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
        };
      }
    
  }


  async getSaleOrder({ code, facilityCodes }, authToken) {

    // console.log(getCurrentLocalTime(), "From Get Sale Order >> ", code, " ", authToken);

    let authorization_value = BEARER + " " + authToken?.access_token;
    let endPoint = `/services/rest/v1/oms/saleorder/get`;

    // Since facility codes are not mandatory, we don't take it in the payload
    let payload = {
      code: code,
      // facilityCodes: facilityCodes
    }

    let response = await this.post(endPoint, payload, {
      headers: {
        "Authorization": authorization_value,
        "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
      }
    });

    return response;
  

   
  }

 async cancelSaleOrder({_id, orderCancellationReason},authToken){
    const saleOrderID = await GtOrder.findById({_id}, {saleOrderId : 1});
    console.log(getCurrentLocalTime(), ": Sale Order ID >> ", saleOrderID);

    let authorization_value = BEARER + " " + authToken?.access_token;
    let endpoint = `/services/rest/v1/oms/saleOrder/cancel`;
    
    if(!saleOrderID || saleOrderID === " ")
      return {
        successful: false,
        errors: [{description: "Sale Order ID for this order is null or empty"}]
      };

    let payload =
    {
      saleOrderCode: saleOrderID.saleOrderId,
      cancellationReason: orderCancellationReason
    }

    try
    {
        let response = this.post(endpoint, payload,{
        headers: {
          "Authorization": authorization_value,
          "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
        }
      });

      return response;
    }
    catch(error)
    {
      console.error(getCurrentLocalTime(), ": ", error);
    }    
  }

  async getShippingPackageDetails({ shippingPackageCode }, authToken) {
    let authorization_value = BEARER + " " + authToken?.access_token;
    let endPoint = `/services/rest/v1/oms/shippingPackage/getShippingPackageDetails`;
    let payload = {
      shippingPackageCode: shippingPackageCode,
    }
    let shippingPackageDetailDTO = await this.post(endPoint, payload, {
      headers: {
        "Authorization": authorization_value,
        "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
      }
    });

    try {
      const response = await shippingPackageDetailDTO;

      
      if(!response.successful)
        throw response;
      
        console.log(getCurrentLocalTime(), ": Error from catch >> ", response);
      
      return {
        success: true,
        message: "Shipping packages recieved Successfully",
      };
    } catch (error) {
      // console.log(getCurrentLocalTime(), "error from catch >> ", error);
      return {
        success: false,
        message:(error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
      
      };
    }

  }

  async getInvoicePDF({ invoiceCodes, facility }, authToken) {

    let authorization_value = BEARER + " " + authToken?.access_token;
    let endPoint = `/services/rest/v1/oms/invoice/show`;

    let params = { invoiceCodes };

    let resInvPDF = await this.get(endPoint, params, {
      headers: {
        "Facility": facility,
        "Authorization": authorization_value,
        "Content-Type": CONTENT_TYPE_HEADER_PDF_VALUE,
      }
    });

    console.log(getCurrentLocalTime(), ": ResInvPDF > ", resInvPDF); //blob data coming from response - Integrate with S3 and send the link.

  }

  async generateSaleOrderCode() {

    const currentOrderCount = await GtOrder.countDocuments()+1;
    const noOfDigits = (currentOrderCount+"").length;
    let saleOrderCode = SALE_ORDER_ID_PREFIX;
    for(let i=1; i<=(6-noOfDigits); i++)
        saleOrderCode = saleOrderCode+"0";
    
    saleOrderCode = saleOrderCode+currentOrderCount+process.env.SALE_ORDER_ID_ENV_POSTFIX;
  
    console.log(getCurrentLocalTime(), ": Sale order code generated = ", saleOrderCode);
    return saleOrderCode;
  }

  async getInvoiceDetails(shippingPackageCode, authToken) {
    //console.log(getCurrentLocalTime(), "userInput >>>", userInput, "/n/n");
    // console.log("shippingPackageCode >> ", shippingPackageCode);
    // console.log("authToken >> ", authToken);
    
    let endPoint = `/services/rest/v1/invoice/details/get`;

    let authorization_value = BEARER + " " + authToken?.access_token;

    let payload = {
      "shippingPackageCode" : shippingPackageCode
    };

    try {
      let invoiceDetailDTO = await this.post(endPoint, payload, {
        headers: {
          "Authorization": authorization_value,
          "Content-Type": CONTENT_TYPE_HEADER_JSON_VALUE,
          // We are only taking Delhi facility into account for invoice details
          "Facility": process.env.LIVE_DELHI_FAC_CODE
        }
      });

      // console.log("response from uniware for invoice details >> ", invoiceDetailDTO);

      if(!invoiceDetailDTO.successful) {
        console.log("invoiceDetailDTO >> ", invoiceDetailDTO);  
        throw invoiceDetailDTO;
      }
            
      return {
        success: true,
        message: "Invoice details fetched successfully",
        invoiceDetailsDTOResponse: invoiceDetailDTO?.invoice
      };
    } catch (error) {
       console.log(getCurrentLocalTime(), "error from catch >> ", error);
      return {
        success: false,
        message:(error?.errors?.length) ? (error?.errors[0]?.message) : "Please check server logs for errors",
      
      };
    }
    

  }

}


