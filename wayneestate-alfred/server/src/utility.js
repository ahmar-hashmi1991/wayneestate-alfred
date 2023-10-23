import { ApolloServer } from "apollo-server-express";
import { constraintDirective } from "graphql-constraint-directive";
import { context, dataSources, schema } from "./schema";

export const GRANT_TYPE = "grant_type";
export const GRANT_TYPE_VALUE_PSWD = "password"
export const CLIENT_ID = "client_id";
export const CLIENT_ID_VALUE = "my-trusted-client"
export const REFRESH_TOKEN = "refresh_token";
export const USERNAME = "username";
export const PASSWORD = "password";

// REST HEADERS constants
export const CONTENT_TYPE_HEADER = "Content-Type";
export const CONTENT_TYPE_HEADER_JSON_VALUE = "application/json";
export const CONTENT_TYPE_HEADER_PDF_VALUE = "application/pdf";
export const AUTHORIZATION = "Authorization";
export const BEARER = "bearer";
export const FACILITY = "Facility"
export const INVOICE_CODES = "invoiceCodes";

//GST API Response error code
export const GST_NO_RECORD = "record_not_found";
export const GST_INVALID = "invalid_parameter";

// User-BO-Customer Management constants
export const PARTY_CODE = "1";
export const CONTACT_TYPE = "PRIMARY";
export const EMAIL_NA_TEMPLATE = "notavailable@bizztm.com"
export const REGISTERED_DEALER_VALUE = true;

// Product Management constants
export const CATEGORY_CODE = "DEFAULT";
export const ITEM_TYPE = "SIMPLE";
export const TAX_TYPE_CODE = "Default";

// Create category constants
export const GST_TAX_TYPE_CODE = 0;

//Reward management constants
export const TRANSACTION_TYPE_CREDIT = "CREDIT";
export const TRANSACTION_TYPE_DEBIT = "DEBIT";
export const PARTICULARS_SIGNUP = "SIGNUP";
export const PARTICULARS_ORDER_PLACED = "ORDER PLACED";
export const PARTICULARS_5_COSTOMERS_TAGGED = "FIVE OR MORE CUSTOMERS TAGGED";
export const PARTICULARS_FESTIVE_BONANZA = "FESTIVE BONANZA";

export const BIZZCOIN_5_CUST_AMOUNT = 50;
export const BIZZCOIN_USED_AT_ORDER_AMOUNT = 25;
 

// Order Management Constants
export const SALE_ORDER_ID_PREFIX = "SOA";

export const CANCEL_ORDER_MESSAGE = "Cannot Cancel Sale Order At this State.";
export const SHIPMENT_UPDATED_MESSAGE = "Shipment Details Updated Successfully.";
export const SHIPMENT_CANNOT_UPDATE_MESSAGE = "Shipment Details could not be updated. Please debug for issues.";

// ORDER STATUS
export const ORDER_STATUS_FAILED = "FAILED";
export const ORDER_STATUS_FAILED_AT_UNICOM = "FAILED AT UNIWARE"
export const ORDER_STATUS_CREATED = "CREATED";
export const ORDER_STATUS_PROCESSING = "PROCESSING";
export const ORDER_STATUS_COMPLETED = "COMPLETE";
export const ORDER_STATUS_CANCELLED = "CANCELLED";

export const ORDER_STATUS_FAILED_AT_UNICOM_MESSAGE = "Order failed at Uniware."
export const ORDER_STATUS_CREATED_AT_UNICOME_MESSAGE = "Order Created Successfully at Uniware."
export const EPSILON = 0.01

// SHIPMENT STATUS
export const SHIPMENT_STATUS_CREATED = "CREATED";
export const SHIPMENT_STATUS_PICKING = "PICKING";
export const SHIPMENT_STATUS_READYSHIP = "READY TO SHIP";
export const SHIPMENT_STATUS_ADDTOMANIFEST = "ADDED TO MANIFEST";
export const SHIPMENT_STATUS_DISPATCHED = "DISPATCHED";
export const SHIPMENT_STATUS_SHIPPED = "SHIPPED";
export const SHIPMENT_STATUS_DELIVERED = "DELIVERED";
export const SHIPMENT_STATUS_CANCELED = "CANCELED";
export const SHIPMENT_STATUS_RETURNEXP = "RETURN EXPECTED";
export const SHIPMENT_STATUS_RETURNACK = "RETURN ACKNOWLEDGED";
export const SHIPMENT_STATUS_RETURNED = "RETURNED";

// RETURN INITIATED STATUS
export const RETURN_INITIATED_REQUESTED = "RETURN_REQUESTED";
export const RETURN_INITIATED_CANCELLED = "RETURN_CANCELLED"; 
export const RETURN_INITIATED_PROCESSED = "RETURN_PROCESSED"; 
export const RETURN_INITIATED_REJECTED = "RETURN_REJECTED";
export const RETURN_PICKED = "RETURN_PICKED";
export const REFUND_PROCESSED = "REFUND_PROCESSED";
export const UNICOM_RETURN_CREATED = "CREATED";
export const UNICOM_RETURN_COMPLETE = "COMPLETE";


// RETURN TYPE
export const RETURN_TYPE_WITHOUT_PICKUP = "DRDER"; 
export const RETURN_TYPE_WITH_PICKUP = "WAC"; 

// TRANSACTION STATUS
export const TRANSACTION_STATUS_PENDING = "PENDING";
export const TRANSACTION_STATUS_SUCCESS = "SUCCESS";
export const TRANSACTION_STATUS_FAILURE = "FAILURE";

export const PAYMENT_METHOD_COD = "COD";
export const PAYMENT_METHOD_PAYTM = "PAYTM";
export const PAYMENT_METHOD_OTHER = "OTH"

export const ALFREDCHANNEL = "CUSTOM";
export const ROBINCHANNEL = "ROBIN";
export const CURRENCY_CODE = "INR";
export const TRANXN_NOTE = "Order placed on Robin";
export const NOTIF_EMAIL = null;
export const NOTIF_MOBILE = null;
export const ADD_REF_SHIP = "SHIPPING";
export const ADD_REF_BILL = "BILLING";
export const ZERO = 0;
export const SHIP_METHOD_CODE = "STD";
export const CHANNEL_PROD_ID = null;
export const FORCEALLOCATE_VALUE = true;

export const UNAUTHORISED = "Unauthorized";

export const CONUSMER_APP_INSTALLED_VALUE = false;
export const UPDATED_SINCE_IN_MINUTES_ONE_DAY_VALUE = 1440;

export const couponTypeDiscountCategory = "DISCOUNT";
export const couponTypePercentageCode = "PERCENTAGE";

export const COUPON_TAGCODE_GENERIC = "GENERIC";
export const COUPON_TAGCODE_HOOK_TAG = "HOOK_TAG";

export const TXN_FAILURE = "TXN_FAILURE";
export const NO_RECORD_FOUND = "NO_RECORD_FOUND";

export const SHIPMENT_PAYMENT_STATUS_PAID = "PAID";
export const SHIPMENT_PAYMENT_STATUS_UNPAID = "UNPAID";

export const ORDER_PAYMENT_STATUS_COMPLETELY_PAID = "PAID";
export const ORDER_PAYMENT_STATUS_PARTIALLY_PAID = "PARTIALLY PAID";
export const ORDER_PAYMENT_STATUS_UNPAID = "UNPAID";

export const PAY_ON_DELIVERY = "PAYONDELIVERY";
export const CASH_ON_DELIVERY = "CASHONDELIVERY"

export const cacheCapacity = 10;

export const getServer = () => {
    //console.log(getCurrentLocalTime(), schemaObject.dataSources().CountryDB.addCountry);
    let server = new ApolloServer({
        schema: constraintDirective()(schema),
        context,
        dataSources
    });
    return server;
}

export const getConnectionString = () => {
    return `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.NODE_ENV}-cluster.8arck.mongodb.net/prodCluster?retryWrites=true&w=majority`;
};

export const getMillisecondsToNext5Min = () => {
    let current = Date.now();
    let bufferMilliSeconds =   10 * 60 * 1000; // 10 minutes buffer in case of bigger orders.
    let rem = current % 300000;
    let getMillisecondsToNext5Min = (300000 - rem) + bufferMilliSeconds;
    return getMillisecondsToNext5Min;
}

export const getMillisecondsToNext00hrs = () => {
    let current = Date.now();
    //let bufferMilliSeconds = 30 * 1000; //30 seconds buffer
    let msIn24hr = 24 * 60 * 60 * 1000;
    let rem = current % msIn24hr;
    let getMillisecondsToNext00hrs = (msIn24hr - rem);
    console.log(getCurrentLocalTime(), "getMillisecondsToNext00hrs >> ", getMillisecondsToNext00hrs);
    return getMillisecondsToNext00hrs;
}

export const getCurrentLocalTime = () => {
    let dateNow = new Date();
    return dateNow.toLocaleString();
}

export const notNullAndUndefinedCheck = (param) => {
    if(param !== null && param !== undefined)
        return true;
    return false;

}

export const verifyIdToken = async (firebaseAdmin, bearerToken) => {
    try {
        return await firebaseAdmin.auth().verifyIdToken(bearerToken);
    } catch (error) {
        console.log("error >> ", error);
        return null;
    }
}