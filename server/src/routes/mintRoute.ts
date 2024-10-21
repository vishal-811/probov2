import express from 'express';
import { handlePubSub, randomId } from '../utils';
import { client } from '../index'
const router = express.Router();


router.post('/mint',async(req,res)=>{
    const { userId, stockSymbol, price, quantity } = req.body;
    const uid = randomId();
    const data = { method : 'mint', uid: uid, data:{ userId, stockSymbol, price, quantity }};
    client.rPush("data",JSON.stringify(data));
    try {
        const response  =  await handlePubSub(uid); 
        res.json({msg:response}); 
    } catch (error) {
        res.json({msg:"Error in getting data from pub/subs"});
    }
    return;
})

export default router