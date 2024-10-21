import express from 'express';
import { randomId, handlePubSub } from '../utils';
import { client } from '..';
const router = express.Router();

   // Get a all users  Balances  ;
  router.get('/inr',async(req,res)=>{
     const uid = randomId();
     const data = { method :"getAllBalance", uid : uid};
     client.rPush("data",JSON.stringify(data));
     try {
      const response  =  await handlePubSub(uid); 
      res.json({msg:response}); 
  } catch (error) {
      res.json({msg:"Error in getting data from pub/subs"});
  }
  return;
  })
  
//  Get all stock balance 
  router.get('/stock', async(req,res)=>{
      const uid = randomId();
      const data = { method : "getAllStock", uid : uid};
      client.rPush("data",JSON.stringify(data));
      try {
         const response  =  await handlePubSub(uid); 
         res.json({msg:response}); 
     } catch (error) {
         res.json({msg:"Error in getting data from pub/subs"});
     }
     return;
  })

  export default router;