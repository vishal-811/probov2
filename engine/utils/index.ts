import { client } from "..";
import { handleSymbolCreate } from "../controllers/SymbolCreate";
import { handleCreateUserId } from "../controllers/UserCreate";
import { handleOnramp } from "../controllers/onramp";
import { handleTradeMint } from "../controllers/tradeMint";
import { handleGetOrderbook, handleGetWholeOrderbook} from "../controllers/getOrderbook";
import { handlegetUserBalance, handlegetUserStockBalance } from "../controllers/getbalance";
import { handlegetAllUserBalance, handlegetAllUserStock } from "../controllers/allbalances";
import { handleCancel, handleSell } from "../controllers/OrderService";
import { handleBuy } from "../controllers/OrderService";
import { handleAutoMarket } from "../controllers/automarket";
import type { OrderCancelType, OrderServiceType } from "../types";

export async function publishMessage(uid : string , response : any){
     await client.publish(uid, JSON.stringify(response));
     console.log("data being sent to the ws ")
}

export function handleMethod(method : string , uid : string, data: string | object  ){
      switch(method){
        case 'create_userId' : {
            if( typeof data !== 'string'){
                data = JSON.stringify(data);
            }
            handleCreateUserId(uid, data);
            break;
        }
        case 'create_Symbol' :{
            if( typeof data !== 'string'){
                data = JSON.stringify(data);
            }
             handleSymbolCreate(uid, data);
             break;
        }
        case 'onramp':{
            if( typeof data === 'string'){
                data = JSON.parse(data);
            }
           handleOnramp(uid, data);
           break;
        }
        case 'mint' :{
            if( typeof data === 'string'){
                data = JSON.parse(data);
            }
            handleTradeMint(uid, data);
            break;
        }
        case 'getwholeOrderbook':{
            if( typeof data !== 'string'){
                data = JSON.stringify(data);
            }
           handleGetWholeOrderbook(uid, data);
            break;
        }
        case 'getOrderbook' :{
            if( typeof data !== 'string'){
                data = JSON.stringify(data);
            }
           handleGetOrderbook(uid, data);
           break;
        }
        case 'getUserbalance' :{
            if( typeof data !== 'string'){
                data = JSON.stringify(data);
            }
            handlegetUserBalance(uid , data);
            break;
        }
        case 'getUserStock' :{
            if( typeof data !== 'string'){
                data = JSON.stringify(data);
            }
            handlegetUserStockBalance(uid , data);
            break;
        }
        case 'getAllBalance' :{
            handlegetAllUserBalance(uid);
            break;
        }
        case 'getAllStock' :{
            handlegetAllUserStock(uid);
            break;
        }
        case 'order_sell':{
            handleSell(uid , data as OrderServiceType);
            break;
        }
        case 'order_buy' :{
                handleBuy(uid , data as OrderServiceType);
            break;
        }
        case 'auto_market' :{
            handleAutoMarket(uid, data);
            break;
        }
        case 'order_cancel' :{
            handleCancel(uid, data as OrderCancelType);
            break;
        }
        default :{
            console.log(`unknown method ${method}`)
        }
      }
}