import { INR_BALANCES } from "../data/balance";
import { STOCK_BALANCES } from "../data/stockbalance";
import { publishMessage } from "../utils";

export function handleTradeMint(uid : string , data : any){
    try {
        let { userId, stockSymbol, price, quantity } = data;
        if (!userId || !stockSymbol || quantity <=0 || price <=0) {
           throw new Error("Please provide userId, stockSymbol, quantity, and price.");
        }
      
        if(!INR_BALANCES[userId]){
          throw new Error("No user exist with this user Id");
        }
          if(typeof (quantity) == 'string'){
           quantity =  parseInt(quantity);
          }
          if(typeof(price) == 'string'){
            price =  parseInt(price);
          }
         const availBal = INR_BALANCES[userId].balance
         if(availBal<(price * quantity)){
            throw new Error("Insufficient Balance");
         }
            
        if (!STOCK_BALANCES[userId]){
            STOCK_BALANCES[userId] = {};
        }
            // Ensure the stock symbol exists for the user
         if (!STOCK_BALANCES[userId][stockSymbol]) {
             STOCK_BALANCES[userId][stockSymbol] = {};
          }
          
              // Initialize 'yes' and 'no' tokens if they don't exist
          if (!STOCK_BALANCES[userId][stockSymbol]['yes']) {
               STOCK_BALANCES[userId][stockSymbol]['yes'] = { quantity: 0, locked: 0 };
          }
          if (!STOCK_BALANCES[userId][stockSymbol]['no']) {
               STOCK_BALANCES[userId][stockSymbol]['no'] = { quantity: 0, locked: 0 };
          }
          
          STOCK_BALANCES[userId][stockSymbol]['yes'].quantity += quantity;
          STOCK_BALANCES[userId][stockSymbol]['no'].quantity += quantity;
             
          const mintFee  = (price * quantity); // we are making both yes and no tokens 
          INR_BALANCES[userId].balance -=mintFee ;
             publishMessage(`channel_${uid}`, `Minted ${quantity} 'yes' and 'no' tokens for user ${userId}, remaining balance is ${INR_BALANCES[userId].balance}`)
             return;
    } catch (error : any) {
        publishMessage(`channel_${uid}` , {error: error.message});
    }
}