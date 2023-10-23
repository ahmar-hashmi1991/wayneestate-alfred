import mongoose from 'mongoose';
import { CLIENT_ID, CLIENT_ID_VALUE, GRANT_TYPE, GRANT_TYPE_VALUE_PSWD, PASSWORD, REFRESH_TOKEN, USERNAME, getConnectionString, getCurrentLocalTime } from './utility';
import fetch from "node-fetch";

import admin from 'firebase-admin';
import { serviceAccount } from "./firebaseServiceAccountKey";

export const Singleton = (function () {
    let authToken;
    let firebaseAdmin;

    const getAuthenticationToken = async () => {
        authToken = await fetchAuthToken();
        return authToken;
        // console.log(getCurrentLocalTime(), "authToken >> ", authToken);
    }

    const getDBConnection = async () => {
        try {
            await mongoose.connect(getConnectionString(), {useUnifiedTopology: true, useNewUrlParser: true});
            console.log(getCurrentLocalTime(), 'Mongoose connected');                
        } catch (error) {
            console.error(getCurrentLocalTime(), ": ", getCurrentLocalTime(), " : ", "error >> ", error);
        }
    }

    const fetchAuthToken = async () => {
        const params = new URLSearchParams();
        params.append(GRANT_TYPE, GRANT_TYPE_VALUE_PSWD);
        params.append(CLIENT_ID, CLIENT_ID_VALUE);


        params.append(USERNAME, process.env.UNICOM_USERNAME);
        params.append(PASSWORD, process.env.UNICOM_PASSWORD);

        let URL = decodeURIComponent(process.env.BASE_URL_AUTH.concat(params)); 

        try{
            let res = await fetch(URL);
            authToken = res.json();
        }
        catch(error){
            console.log(getCurrentLocalTime(), error.message);
        }
        return authToken;
    }

    const refreshAuthToken = async () => {
        const params = new URLSearchParams();
        params.append(GRANT_TYPE, REFRESH_TOKEN);
        params.append(CLIENT_ID, CLIENT_ID_VALUE);
        params.append(REFRESH_TOKEN, authToken.refresh_token);

        let URL = decodeURIComponent(process.env.BASE_URL_AUTH.concat(params));

        try{
            let res = await fetch(URL);
            authToken = res.json();
        }
        catch(error){
            console.log(getCurrentLocalTime(), error.message);
        }
        return authToken;
    }

    const refreshTokenAfterExpires = async ()=> {
        if(authToken)
        {
            authToken = await refreshAuthToken();
            console.log(getCurrentLocalTime(), "Token from timer", authToken);
        }
    }
    
    return {
        getResources: async () => {
            if (!authToken) {
                getDBConnection();
                authToken = await getAuthenticationToken();
                
                // Refreshing Token Every 12 hours - 5 minutes to fetch the new token.
                // setInterval(fetchAuthToken, ((authToken.expires_in) * 1000) - (2 * 60 * 1000));
                console.log(getCurrentLocalTime(), "authToken >> ", authToken, "Time to fetch token = ", (((authToken.expires_in) * 1000) - (2 * 60 * 1000)));
            }
            // else if(authToken.expires_in <= 300)
            // {
            //     authToken = await refreshAuthToken(authToken.refresh_token);
            //     //console.log(getCurrentLocalTime(), "authToken 2 >> ", authToken);
            // }
            // console.log(getCurrentLocalTime(), "authToken 3 >> ", authToken);
            return authToken;
        },
        forceGetResources: async () => {
            authToken = await getAuthenticationToken();
            // Refreshing Token Every 12 hours - 14 minutes to fetch the new token.
            // setInterval(fetchAuthToken, ((authToken.expires_in) * 1000) - (14 * 60 * 1000));
            console.log(getCurrentLocalTime(), "authToken >> ", authToken, "Time to fetch token = ", (((authToken.expires_in) * 1000) - (2 * 60 * 1000)));        
            return authToken;
        },
        getFirebaseAdmin: () => {
            if (!firebaseAdmin) {
                firebaseAdmin = admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: serviceAccount.project_id
                });
            }

            return firebaseAdmin;
        }
    };
})();
