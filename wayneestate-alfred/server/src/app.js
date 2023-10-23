import express from "express";
import { AuthenticationError } from 'apollo-server-express';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { callGetInventorySnapshotAPI, callGetInventorySnapshotAPIAndIncrement } from "./inventory_management/controller/regularInventorySync";
import { getServer, getMillisecondsToNext00hrs, getCurrentLocalTime } from "./utility";
import { callfetchOrderAndShippmentForActiveOrders } from "./order_management/controller/fetchOrderAndShippmentStatus";
import { Singleton } from "./resources";
import dotenv from 'dotenv';
import os from 'os'
import cluster from 'cluster'

const authenticationMiddleware = async (req, res, next) => {
    // const bearerToken = req.header('Authorization').replace('Bearer', '').trim();

    const bearerToken = req.headers?.authorization?.replace('Bearer', '').trim();
    const passedUID = req.header('uid') || '';

    // console.log("passed uid : ", passedUID);

    // console.log("Bearer token >> ", bearerToken);
    
    try {
        if (bearerToken && passedUID) {
            const decodedToken = await Singleton.getFirebaseAdmin().auth().verifyIdToken(bearerToken);
            // console.log("Decoded token >> ", decodedToken);
        
            const decodedUID = decodedToken.uid;
            // console.log("decoded uid : ", decodedUID);
        
            if (decodedUID !== passedUID) {
                throw { message: "User authentication failed. UID expired or incorrect."};
            } else {
                console.log("VERIFICATION SUCCESSFUL!");
                next();
            }
        } else if (bearerToken && !passedUID) {
            throw { message: "User authentication failed. No UID passed."};
        } else if (!bearerToken && passedUID) {
            throw { message: "User authentication failed. No bearer token passed."};
        } else {
            next();
            // throw { message: "User authentication failed. No bearer token or UID passed."};
            // throw new AuthenticationError("User authentication failed. No bearer token or UID passed.")
        }
    }
    catch (error) {
        console.log("error >> ", error);
        next(error);
    }
    // console.log("passed uid : ", passedUID);

    // console.log("Bearer token >> ", bearerToken);
  }

const startServer = async () => {
    dotenv.config({ path: './src/.env' });
    const app = express();

    // Running Node JS instance on multiple cores of the CPU
    const numCpus = os.cpus().length;
    console.log("CPU Cores >> ", numCpus);

    // Server started for the first time, then fork other CPU cores to inititate Node JS instance
    if(cluster.isPrimary)
    {
      console.log("Inside Primary process")
      for(let i=0;i<numCpus; i++)
      {
        cluster.fork();
      }
      // By any chance, a server/instance crashes, re-initiate the process so we never have downtime
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died, restarting again.`);
        cluster.fork();
      })
    }
    else {
        // The Worker process have been inititated if in this block.
        console.log("Inside worker process");

        // Trying to increase the json limit from 100kb to 50Mb
        app.use(express.json({ limit: '50mb' }));

        const apolloServer = getServer();
        await apolloServer.start();
        apolloServer.applyMiddleware({ app: app, path: '/bizztm' });
        console.log("Env Variables >> ", process.env);
        
        // Setting up the inventory Sync calls once per day for every FC 
        setInterval(async ()=> {
             try{
                 await callGetInventorySnapshotAPI(process.env.LIVE_DELHI_FAC_CODE) ;
                 // Sync Kota facility only after Delhi facility 
                 await callGetInventorySnapshotAPIAndIncrement(process.env.LIVE_KOTA_FAC_CODE);
                 //Fetch Shipments after Inventory Sync only
                 await callfetchOrderAndShippmentForActiveOrders();
             }
             catch(error)
             {
                 console.error(getCurrentLocalTime(), " : ", error);
             }
           
        }, getMillisecondsToNext00hrs());

        const PORT = process.env.PORT || 4002;
        app.listen(PORT, () =>  console.log(getCurrentLocalTime(), `
        🚀  Server ${process.pid} is running!
        🔉  Listening on port ${PORT}
        📭  Query at http://localhost:4002/bizztm`
      
        ));
      

      }
    // app.use(authenticationMiddleware);

   

  }

startServer();



