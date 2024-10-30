import express from 'express';
import { randomId , RedisManager} from '../utils';
import { client } from '..';
const router = express.Router();

router.post('/inr',async(req,res)=>{
    const { amount , userId} = req.body;
    const uid = randomId();
    const data  = {method :'onramp', uid: uid, data: {amount : amount, userId : userId} };
    try {
        const response  =  await RedisManager(uid,data);  // waiting to get the response from the pub/sub.
        res.json({msg:response}); 
    } catch (error) {
        res.json({msg:"Error in getting data from pub/subs"});
    }
    return;
})

export default router;