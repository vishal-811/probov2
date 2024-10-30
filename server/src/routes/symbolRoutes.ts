import express from 'express';
import {  randomId, RedisManager } from '../utils';
import { client } from '..';
const router = express.Router();

router.post('/create/:stockSymbol',async(req,res)=>{
    const { stockSymbol } = req.params;
    const uid = randomId();
    const data = {method :"create_Symbol", uid: uid, data: stockSymbol};
    try {
        const response  =  await RedisManager(uid, data); 
        res.json({msg:response}); 
    } catch (error) {
        res.json({msg:"Error in getting data from pub/subs"});
    }
    return;
})

export default router;