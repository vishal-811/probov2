import express from "express";
const router = express.Router();
import { client, Subscriber } from '../index';
import { handlePubSub, randomId } from "../utils";

router.post('/create/:userId',async(req,res)=>{
    const { userId } = req.params;
    const  uid = randomId();  //unique identifier to subscribe.
    const data  = {method : "create_userId", uid: uid, data : userId}
    client.RPUSH("data", JSON.stringify(data)); 
    try {
        const response  =  await handlePubSub(uid);  // waiting to get the response from the pub/sub.
        res.json({msg:response}); 
    } catch (error) {
        res.json({msg:"Error in getting data from pub/subs"});
    }
    return;
})

export default router;