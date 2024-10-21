import { v4 as uuidv4 } from 'uuid';
import { Subscriber } from '..';

export async function handlePubSub(uid : string){
     return new Promise((resolve)=>{
      Subscriber.subscribe(`channel_${uid}`,(data)=>{
         console.log( Promise.resolve(data))
         resolve(JSON.parse(data));
       })
    })
}

export function randomId(){
    return  uuidv4();
}