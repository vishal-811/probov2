import { INR_BALANCES } from "../data/balance";
import { publishMessage } from "../utils";


export function handleCreateUserId(uid : string, data : string){
    try {
      const userId  = data;
    if(INR_BALANCES[userId]){
       throw new Error("user already exists")
    }
    INR_BALANCES[userId] = {
       balance :0,
       locked: 0  
    } 

    publishMessage(`channel_${uid}` , `user created with userId ${userId}`);
    return;
    } catch (error:any) {
      publishMessage(`channel_${uid}` , { error: error.message}); 
    }
}