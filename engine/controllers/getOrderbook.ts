import { ORDERBOOK } from "../data/orderbook";
import { publishMessage } from "../utils";


export  function handleGetWholeOrderbook(uid : string, data : any){
    try {
        publishMessage(`channel_${uid}` , ORDERBOOK);
    } catch (error : any) {
        publishMessage(`channel_${uid}`, {error: error.message , status : "Failed in fetching OrderBook"});
    }
} 


// OrderBook for specific stock Symbol
export function handleGetOrderbook(uid : string, data : string){
   const stockSymbol  = data;
   try {
    if(!ORDERBOOK[stockSymbol]){
        ORDERBOOK[stockSymbol]={yes:{}, no:{}}
    }   
      publishMessage(`channel_${uid}`, ORDERBOOK[stockSymbol]);
   } catch (error : any) {
    publishMessage(`channel_${uid}`, {error: error.message });
   }
}