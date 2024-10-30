import express from 'express';
import { randomId, RedisManager } from '../utils';
import { client } from '..';
const router = express.Router();

   // Get a all users  Balances  ;
  router.get('/inr',async(req,res)=>{
     const uid = randomId();
     const data = { method :"getAllBalance", uid : uid};
     try {
      const response  =  await RedisManager(uid,data); 
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
      try {
         const response  =  await RedisManager(uid,data); 
         res.json({msg:response}); 
     } catch (error) {
         res.json({msg:"Error in getting data from pub/subs"});
     }
     return;
  })

  export default router;