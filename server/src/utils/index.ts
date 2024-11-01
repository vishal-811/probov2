import { v4 as uuidv4 } from 'uuid';
import { Subscriber , client} from '..';

export  function RedisManager(uid : string, data : any){
     return new Promise(async (resolve)=>{
     await Subscriber.subscribe(`channel_${uid}`,(data)=>{
           Subscriber.unsubscribe(`channel_${uid}`);  //free the client.
           resolve(JSON.parse(data));
       })
     await client.RPUSH("data", JSON.stringify(data)); 
    })
}

export function randomId(){
    return  uuidv4();
}
