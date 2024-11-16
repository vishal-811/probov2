import express from "express";
import {  randomId, RedisManager } from "../utils";
const router = express.Router();

router.post("/sell", async (req, res) => {
  const { userId, stockSymbol, stockType, price, quantity } = req.body;
  const uid = randomId();
  const data = {
    method: "order_sell",
    uid: uid,
    data: { userId, stockSymbol, stockType, price, quantity },
  };
  try {
    const response = await RedisManager(uid,data); // waiting to get the response from the pub/sub.
    res.json({ msg: response });
  } catch (error) {
    res.json({ msg: "Error in getting data from pub/subs" });
  }
  return;
});

router.post("/buy", async (req, res) => {
  const { userId, stockSymbol, stockType, price, quantity } = req.body;
  console.log("The price inside a server is", price);
  const uid = randomId();
  const data = {
    method: "order_buy",
    uid: uid,
    data: { userId, stockSymbol, stockType, price, quantity },
  };
  try {
    const response = await RedisManager(uid,data); // waiting to get the response from the pub/sub.
    res.json({ msg: response });
  } catch (error) {
    res.json({ msg: "Error in getting data from pub/subs" });
  }
  return;
});

router.post("/cancel", async (req, res) => {
  const { orderId, userId, stockSymbol, stockType, price } = req.body;
  const uid = randomId();
  const data = {
    method: "order_cancel",
    uid: uid,
    data: {
      orderId: orderId,
      userId: userId,
      stockSymbol: stockSymbol,
      stockType: stockType,
      price: price,
    },
  };
  try {
    const response = await RedisManager(uid, data);
    res.json({msg :response});
  } catch {
     res.json({msg:"Error in cancelling order"});
  }
});

export default router;
