import { INR_BALANCES } from "../data/balance";
import { STOCK_BALANCES } from "../data/stockbalance";
import { publishMessage } from "../utils";

// Give all the user balances.
export function handlegetAllUserBalance(uid : string){
   try {
    publishMessage(`channel_${uid}`, INR_BALANCES);
   return
   } catch (error : any) {
     publishMessage(`channel_${uid}`, {error : error.message , status :"Error in fetching the users balances"});
     return;
   }
}

// Give all the user stocks
export function handlegetAllUserStock(uid : string){
   try {
     publishMessage(`channel_${uid}`, STOCK_BALANCES);
   } catch (error : any) {
    publishMessage(`channel_${uid}`, { error : error.message })
    return;
   }
}