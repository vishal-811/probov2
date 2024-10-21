import express from 'express';
import { randomId, handlePubSub } from '../utils';
import { client } from '..';
const router = express.Router();

  // Fetching whole order book.
router.post('/',async(req,res)=>{
    const uid = randomId();
    const data = { method :"getwholeOrderbook" , uid : uid};
    client.rPush("data", JSON.stringify(data));
    try {
      const response  =  await handlePubSub(uid);  
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
    client.rPush('data', JSON.stringify(data));
    try {
      const response  =  await handlePubSub(uid);  // waiting to get the response from the pub/sub.
      res.json({msg:response}); 
  } catch (error) {
      res.json({msg:"Error in getting data from pub/subs"});
  }
  return;
})
  
  

export default router;