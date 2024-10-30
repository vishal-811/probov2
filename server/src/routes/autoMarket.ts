// import express from 'express';
// import { client  } from '..';
// import { RedisManager } from '../utils';
// import { v4 as uuidv4 } from 'uuid'
// const router = express.Router();

// router.post('/automarket', async (req,res)=>{
//       // const { marketType , marketSymbol } = req.body;
//    const marketType ='crypto'
//    const marketSymbol ='bitcoin'
//    const uid  = uuidv4();
//    const data = {method :"auto_market", uid :uid, data : {marketType : marketType , marketSymbol : marketSymbol}};
//    setInterval(() => {
//       client.rPush('data', JSON.stringify(data));
//    }, 10000);
//    try {
//       const response = await RedisManager(uid,data);
//       res.json({msg : response});
//    } catch (error) {
//       res.json({msg:"Market does not created"})
//       }
//  })
 

// export default router;
