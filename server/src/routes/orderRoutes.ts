import express from "express";
import { handlePubSub, randomId } from "../utils";
import { client } from "..";
const router = express.Router();

router.post("/sell", async (req, res) => {
  const { userId, stockSymbol, stockType, price, quantity } = req.body;
  const uid = randomId();
  const data = {
    method: "order_sell",
    uid: uid,
    data: { userId, stockSymbol, stockType, price, quantity },
  };
  client.rPush("data", JSON.stringify(data));
  try {
    const response = await handlePubSub(uid); // waiting to get the response from the pub/sub.
    res.json({ msg: response });
  } catch (error) {
    res.json({ msg: "Error in getting data from pub/subs" });
  }
  return;
});

router.post("/buy", async (req, res) => {
  const { userId, stockSymbol, stockType, price, quantity } = req.body;
  const uid = randomId();
  const data = {
    method: "order_buy",
    uid: uid,
    data: { userId, stockSymbol, stockType, price, quantity },
  };
  client.rPush("data", JSON.stringify(data));
  try {
    const response = await handlePubSub(uid); // waiting to get the response from the pub/sub.
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
  client.rPush("data", JSON.stringify(data));
  try {
    const response = await handlePubSub(uid);
    res.json({msg :response});
  } catch {
     res.json({msg:"Error in cancelling order"});
  }
});

export default router;
