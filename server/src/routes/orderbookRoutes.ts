import express from 'express';
import { randomId, RedisManager } from '../utils';
import { client } from '..';
const router = express.Router();

  // Fetching whole order book.
router.post('/',async(req,res)=>{
    const uid = randomId();
    const data = { method :"getwholeOrderbook" , uid : uid};
    try {
      const response  =  await RedisManager(uid, data);  
      res.json({msg:response}); 
  } catch (error) {
      res.json({msg:"Error in getting data from pub/subs"});
  }
  return;
})

// Fetching orderBook details for a particular stock symbol
router.post('/:stockSymbol',async(req,res)=>{
    const { stockSymbol } = req.params;
    const uid = randomId();
    const data = { method :"getOrderbook", uid : uid , data : stockSymbol}
    try {
      const response  =  await RedisManager(uid, data);  // waiting to get the response from the pub/sub.
      res.json({msg:response}); 
  } catch (error) {
      res.json({msg:"Error in getting data from pub/subs"});
  }
  return;
})
  
  

export default router;