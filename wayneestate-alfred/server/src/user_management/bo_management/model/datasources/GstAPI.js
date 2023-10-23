import { RESTDataSource } from 'apollo-datasource-rest';
import { CONTENT_TYPE_HEADER_JSON_VALUE,getCurrentLocalTime, GST_INVALID, GST_NO_RECORD } from '../../../../utility';


export class GstAPI extends RESTDataSource {
   constructor() {
    super();
    this.baseURL = process.env.GST_BASE_URL;
  }

  async getGSTDetails(gstNumber) {

    // console.log(getCurrentLocalTime(), " GST number to verify >>>", gstNumber, "/n/n");
    try
    {
        let endPoint = `TransactionAPI/GetGSTINDetails`;
        let payload = {
          "USERCODE": process.env.GST_API_USERCODE,
          "CLIENTCODE": process.env.GST_API_CLIENTCODE,
          "PASSWORD": process.env.GST_API_PASSWORD,
          "RequestorGSTIN": process.env.GST_API_REQTR_GSTIN,
          "gstinlist": [
              {
                  "GSTIN": gstNumber
              }
          ]
      }
        const gstResult = await this.post(endPoint, payload,{
          headers: {
              "accept": CONTENT_TYPE_HEADER_JSON_VALUE,
          }
        });
        //console.log(getCurrentLocalTime(), " GST API Response >>", gstResult);

        if(gstResult && gstResult[0].Flag)
        {
          return {
              message: gstResult[0].Message,
              success: true,
              gstDetail: gstResult[0].JsonData,
          }
        }
        else
        {
          throw {message: gstResult[0].Message}
        }
    }
    catch(error)
    {
      console.log(getCurrentLocalTime(), "Error while fetching GST Details ", error.message)
      return{
        message: error.message,
        success: false 
      }
      
    }
  }

 }

