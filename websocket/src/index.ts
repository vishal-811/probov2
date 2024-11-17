import WebSocket, {  WebSocketServer } from "ws";
import http from 'http';
import { createClient } from 'redis';

const server = http.createServer(function (request,response){
     response.end("Hi there");
})

const subscriptions :{
    stockSymbol : string,
    subscribers : WebSocket[]
}[] = [];


const wss = new WebSocketServer({server});

const client = createClient({
    url : "redis://redis:6379"
});
const subscriber = createClient({
    url : "redis://redis:6379"
});


function findSubscription(stockSymbol : string){
    return subscriptions.find(subscription => subscription.stockSymbol === stockSymbol)
}

function handleWebsocketMessage(message : any, ws : WebSocket){
   let data;
   try {
     data = JSON.parse(message.toString());
   } catch (error) {
     console.log("error in parsing message" , error);
   }

   const type =  data.type;
   const stockSymbol = data.stockSymbol;
   if(type === 'subscribe'){
      let subscription = findSubscription(stockSymbol);
      if(!subscription){ // if there is no subscriptions for that for Stocksymbol //eg : BTC_IND not in the subscription array
                         // so firstly put that in the subscriptions array and than add the subscribers to that StockSymbol.
        subscription = {stockSymbol : stockSymbol, subscribers :[]};
        subscriptions.push(subscription);
       }
       subscription.subscribers.push(ws)
   }
   else if( type === 'unsubscribe'){
    let subscription = findSubscription(stockSymbol);
    if (!subscription) return;
    subscription.subscribers = subscription.subscribers.filter(subscriber => subscriber !== ws); // Remove subscriber
    // If it is the last subscriber to that stockSymbol than also remove the stockSymbol
     if(subscription.subscribers.length === 0){
        console.log(subscription.stockSymbol);
     }
   }
}

async function sendOrderBookData(stockSymbol : string, orderbook : object){
    try {
        const subscription = findSubscription(stockSymbol);
         if(subscription){
        subscription.subscribers.forEach(client =>{
             if(client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify(orderbook));
             }
        })
       }
    } catch (error) {
        console.log(error);
    }
}

function handleCloseEvent(ws : WebSocket){  // remove the user from all the StockSymbol markets.
    subscriptions.forEach(subscription => {
        subscription.subscribers.filter(userId =>{
            userId != ws
        })
    })
}

wss.on('connection', (ws)=>{
    ws.on('error', console.error)
    ws.on('message' ,(message)=>{
        handleWebsocketMessage(message, ws);
    })

    ws.on('close', ()=> handleCloseEvent(ws))
})

async function startServer(){
  try {
    await client.connect();
    await subscriber.connect();
    // Get the updated orderBook from the engine and give the updated orderbook to all the subscriber.
       await subscriber.subscribe('orderbook', (message)=>{
        const parsedData =  JSON.parse(message);
        let { stockSymbol, orderbook } = parsedData;
        //Now show the updated order book to all the users.
        sendOrderBookData(stockSymbol , orderbook); 
    })
    console.log("connect to redis");
  } catch (error) {
     console.log("error", error);
     console.log("failed to connect to redis erorrrrr")
  }
  
  server.listen(8080, ()=>{
     console.log("ws is listen on port 8080");
  })
}

startServer();
