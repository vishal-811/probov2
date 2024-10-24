import { INR_BALANCES } from "../data/balance";
import { STOCK_BALANCES } from "../data/stockbalance";
import { ORDERBOOK } from "../data/orderbook";
import type { OrderServiceType, reverseCallType } from "../types";

import { client, Publisher } from '..'
import { publishMessage } from "../utils";

// Order to sell 
export function handleSell(uid : string , data : OrderServiceType){
    try {
        const { userId, stockSymbol, quantity, price, stockType } = data;

        if (!userId || !stockSymbol || !quantity || !price || !stockType) {
            throw new Error("Please fill all the fields" );
        }
      
          // Validate that the user exists with this ID
        const validateUser = INR_BALANCES[userId];
        if (!validateUser) {
           throw new Error("No user exists with this UserId");
        }
          // Validate stock type
        if (stockType !== 'yes' && stockType !== 'no') {
           throw new Error( "Invalid stock type" );
        }
        // Check if the user exists in the stock balances
        const userStocks = STOCK_BALANCES[userId];
        if (!userStocks || !userStocks[stockSymbol]) {
            throw new Error("User doesn't hold the stock or invalid stock symbol");
        }
      
        // Check if the user holds the given type of stock
        const stockDetails = userStocks[stockSymbol][stockType]
        if (!stockDetails) {
            throw new Error(`User doesn't hold any ${stockType} stocks of ${stockSymbol}`);
        }
          // Check if the user has enough stock to sell
        if (stockDetails.quantity < quantity) {
            throw new Error("Not enough stock to sell");
        }
          // Lock the quantity of stock being sold
        stockDetails.quantity -= quantity;
        stockDetails.locked = (stockDetails.locked || 0) + quantity;
      
        // Ensure the stock symbol and stock type exist in the ORDERBOOK
        if (!ORDERBOOK[stockSymbol]) {
            ORDERBOOK[stockSymbol] = { 'yes': {}, 'no': {}};
        }
        if (!ORDERBOOK[stockSymbol][stockType]) {
              ORDERBOOK[stockSymbol][stockType] = {};
        }
      
          // Get the price level or create it if it doesn't exist
        if (!ORDERBOOK[stockSymbol][stockType][price]) {
            ORDERBOOK[stockSymbol][stockType][price] = { total: 0, orders: {} };
        }
        if(!ORDERBOOK[stockSymbol][stockType][price].orders[userId]){
           ORDERBOOK[stockSymbol][stockType][price].orders[userId] = {quantity: 0 , orderType : "original"};
        }
          // Update the order book for the current stockSymbol
            ORDERBOOK[stockSymbol][stockType][price].orders[userId].quantity = 
            (ORDERBOOK[stockSymbol][stockType][price].orders[userId].quantity || 0) + quantity;
            ORDERBOOK[stockSymbol][stockType][price].total += quantity;
    
            ORDERBOOK[stockSymbol][stockType][price].orders[userId].orderType = "original";

          //Put the stock symbol and the  orderbook for that stock symbol in the pub/sub so that the ws server can get it
          //  and broadcast  to all the users.
          Publisher.publish('orderbook', JSON.stringify({stockSymbol : stockSymbol , orderbook : ORDERBOOK[stockSymbol]}));
          publishMessage( `channel_${uid}`,"Sell order placed and pending");
          return; 
    }catch (error : any) {

        publishMessage( `channel_${uid}`,{error : error.message});
    }
}


// Odrer to buy
export function handleBuy(uid : string, data : OrderServiceType){
  try {
    const { userId, stockSymbol, quantity, price, stockType } = data;
  if (!userId || !stockSymbol || !quantity || !price || !stockType) {
    throw new Error( "Please provide all fields" );
  }
 
// Validate user balance
const userBalance = INR_BALANCES[userId];
if (!userBalance) {
   throw new Error("No user exists with this userId" );
}
 
// Check if the user has enough INR balance to place the order
const requiredAmount = price * quantity;
if (userBalance.balance < requiredAmount) {
  throw new Error("Insufficient balance" );
}

if (!ORDERBOOK[stockSymbol]) {
    ORDERBOOK[stockSymbol] = { 'yes': {}, 'no': {}};
}

if(!ORDERBOOK[stockSymbol][stockType]){
  ORDERBOOK[stockSymbol][stockType] = {[price] :{total:0 , orders:{}}};
}  

// Get the price level or create it if it doesn't exist
if (!ORDERBOOK[stockSymbol][stockType][price]) {
  ORDERBOOK[stockSymbol][stockType][price] = { total: 0, orders: {} };

//If the qvailable stock is equal to 0, create a reverse order
if(ORDERBOOK[stockSymbol][stockType][price].total < quantity && ORDERBOOK[stockSymbol][stockType][price].total === 0){
  reverseCall({ stockSymbol, stockType, price, quantity, userId, ORDERBOOK});
  const amount = price * quantity;
  INR_BALANCES[userId].balance -= amount;
 //Push the updated order book to the queue
 Publisher.publish('orderbook', JSON.stringify({stockSymbol : stockSymbol , orderbook : ORDERBOOK[stockSymbol]}));
 publishMessage(`channel_${uid}`,"Partial order placed 1");
 return;
}
let requiredQuantity = quantity;
// If the stock avialble is greater than the quantity in this case two option is there sell order is original or pseudo
if(ORDERBOOK[stockSymbol][stockType][price].total != 0){
  for( const [user, userSellQuantity] of Object.entries(ORDERBOOK[stockSymbol][stockType][price].orders)){

     if(requiredQuantity <= 0 || ORDERBOOK[stockSymbol][stockType][price].total === 0){
       break;
     }
     if(userSellQuantity.orderType === "original"){
        requiredQuantity -= userSellQuantity.quantity;
        const amount = userSellQuantity.quantity * price;
        if(STOCK_BALANCES[user][stockSymbol][stockType]){
          STOCK_BALANCES[user][stockSymbol][stockType].locked -=userSellQuantity.quantity;
        }
        INR_BALANCES[user].balance += amount; //increase the balance of the user who sell the Stock.
        ORDERBOOK[stockSymbol][stockType][price].total -= userSellQuantity.quantity;
        delete  ORDERBOOK[stockSymbol][stockType][price].orders[user];
        if( ORDERBOOK[stockSymbol][stockType][price].total === 0){
           delete  ORDERBOOK[stockSymbol][stockType][price];
        }
     }
     else{ //if the ordertype is pseudo.
        requiredQuantity -= userSellQuantity.quantity;
        const stockReverseType = stockType === 'yes' ? 'no' : 'yes'
        const amount = quantity * price;
       //  Unlock the user money and Give them reversetype stock
           INR_BALANCES[user].locked -=amount;
           if(STOCK_BALANCES[user][stockSymbol][stockReverseType]){
              STOCK_BALANCES[user][stockSymbol][stockReverseType].quantity +=quantity;
           }
     }
  }
}

if(requiredQuantity>0){
 //Deduct the money for the fulfilled stock qunatity also deduct their balance.
 const FullFilledQunatity = quantity - requiredQuantity;
 const amount = FullFilledQunatity * price;
 INR_BALANCES[userId].balance -= amount;
 if( STOCK_BALANCES[userId][stockSymbol][stockType]){
   STOCK_BALANCES[userId][stockSymbol][stockType].quantity +=FullFilledQunatity;
 }
 reverseCall({stockSymbol, stockType, userId, requiredQuantity,price,ORDERBOOK});
 // Send the orderbook to the Redis queue
 Publisher.publish('orderbook', JSON.stringify({stockSymbol : stockSymbol , orderbook : ORDERBOOK[stockSymbol]}));
 publishMessage(`channel_${uid}`,"Partial Order Placed");
 return;
}
else{ //if the user order is fulfilled, requiredQuantity equals to 0.
 // Deduct the user balance who bought the Stocks and increase their stocks
 const amount = quantity * price;
 INR_BALANCES[userId].balance -= amount;
 if(!STOCK_BALANCES[userId]){
   STOCK_BALANCES[userId] = {[stockSymbol]:{}};
 }
 if(!STOCK_BALANCES[userId][stockSymbol]){
    STOCK_BALANCES[userId][stockSymbol] = {yes:{quantity: 0, locked:0}, no:{quantity:0, locked: 0}};
 }
 if(STOCK_BALANCES[userId][stockSymbol][stockType]){
    STOCK_BALANCES[userId][stockSymbol][stockType].quantity += quantity;
 }
 Publisher.publish('orderbook', JSON.stringify({stockSymbol : stockSymbol , orderbook : ORDERBOOK[stockSymbol]}));
 publishMessage(`channel_${uid}`,"order fulfilled");
 } 
}
}catch (error : any) {
  publishMessage( `channel_${uid}`,{error : error.message});
 }
}


// Function to  make a reverse call
function reverseCall({ stockSymbol, stockType, price, quantity, userId, requiredQuantity, ORDERBOOK }: reverseCallType) {
const newStocks = quantity ? quantity : requiredQuantity;
let reverseStockType = stockType;
if(stockType == "yes"){
   reverseStockType = "no";
}
else{
   reverseStockType = "yes";
}
if (!ORDERBOOK[stockSymbol]) {
     ORDERBOOK[stockSymbol] = {yes:{}, no:{}};  
}
  
    // if (!ORDERBOOK[stockSymbol][reverseStockType]) {
    //   ORDERBOOK[stockSymbol][reverseStockType] = {};
    // }
  
if (!ORDERBOOK[stockSymbol][reverseStockType][price]) {
    ORDERBOOK[stockSymbol][reverseStockType][price] = {
        total: 0,
        orders: {}
      };
 }
    // Add the new reverse order (lock the user's funds for the unfulfilled quantity
if(newStocks){ // Increase total available stock at this price
    ORDERBOOK[stockSymbol][reverseStockType][price].total += newStocks;
} 
  
if (!ORDERBOOK[stockSymbol][reverseStockType][price].orders[userId]) {
    ORDERBOOK[stockSymbol][reverseStockType][price].orders[userId]= {quantity : 0, orderType:"pseudo"};
}
if(newStocks){ // Lock the user's remaining order quantity
    ORDERBOOK[stockSymbol][reverseStockType][price].orders[userId].quantity += newStocks
} 
    //Lock the user balance for pending reverse stocks.
if(newStocks){
    if(typeof price == 'string'){
       price = parseInt(price)
    }
    const totalAmount = newStocks * price;
    INR_BALANCES[userId].locked += totalAmount
}
    return ORDERBOOK[stockSymbol][reverseStockType][price];
}