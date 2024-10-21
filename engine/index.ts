import express from 'express'
import { createClient } from 'redis';
import { handleMethod } from './utils';
const app = express();
export const client = createClient();
export const Publisher = createClient();


async function handleDataFromQueue(response : any){
     const Rawdata  = response?.element;
     const parsedData = JSON.parse(Rawdata);
     const { method , uid, data } = parsedData
     handleMethod(method,uid,data);  //check which type of method is it and proceed accordingly.
     return;
}

async function popFromqueue(){
    while(true){
        const requestData = await client.BLPOP("data",0);
        if(requestData){
           await handleDataFromQueue(requestData);
        }
    }
}

async function startServer(){ 
    try {
        await client.connect();
        await Publisher.connect();
        console.log("Engine Connected to server")

        popFromqueue();
    } catch (error) {
         console.log(error);
    }
    
    app.listen(3001,()=>{
        console.log("Engine is running on port 3001");
    })

}

startServer();

