import express from 'express';
import { randomId, RedisManager} from '../utils';
import { client } from '..'
const router = express.Router();
  
    //  get a user inr balance 
  router.get('/inr/:userId',async(req,res)=>{
      const { userId } = req.params;
      const uid = randomId();
      const data = { method :"getUserbalance", uid : uid, data : userId};
      try {
        const response  =  await RedisManager(uid,data); 
        res.json({msg:response}); 
    } catch (error) {
        res.json({msg:"Error in getting data from pub/subs"});
    }
    return;
  })
  
      // get a user Stock Balance 
  router.get('/stock/:userId',async(req,res)=>{
      const { userId } = req.params;
      const uid = randomId();
      const data = { method :"getUserStock", uid: uid, data : userId};
      try {
        const response  =  await RedisManager(uid,data); 
        res.json({msg:response}); 
    } catch (error) {
        res.json({msg:"Error in getting data from pub/subs"});
    }
    return;
  })
  
export default router;