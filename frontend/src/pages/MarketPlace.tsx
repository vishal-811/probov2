import { useState, useEffect } from "react";
import { EventTitle } from "../components/EventTitle";
import { OrderBook } from "../components/OrderBook";
import { OrderBuy } from "../components/OrderBuy";
import axios from "axios";
import { useParams } from "react-router-dom";

export const MarketPlace = () => {
  const [orderbook, setOrderbook] = useState({});
  const [balance, setBalance] = useState(0);
  const { stockSymbol } = useParams();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    async function fetchBalance() {
      const res = await axios.get(`http://localhost:3000/balance/inr/${userId}`);
      setBalance(res.data.balance);
    }
    fetchBalance();
  }, []);

  useEffect(() => {
    async function fetchStock() {
      const res = await axios.post(`http://localhost:3000/orderbook/${stockSymbol}`);
      setOrderbook(res.data.msg);
    }
    fetchStock();

    const connectWithWs = () => {
      const socket = new WebSocket("ws://localhost:8080");
      socket.addEventListener("open", () => {
        console.log("WebSocket connected");
        socket.send(
          JSON.stringify({ type: "subscribe", stockSymbol: stockSymbol })
        );
      });

      socket.addEventListener("message", (message) => {
        console.log("THe data from the websocket looks like", message);
        const data = JSON.parse(message.data);
        setOrderbook(data);
      });

      socket.addEventListener("error", (err) => {
        console.log(err);
      });
    };

    connectWithWs();
  }, [stockSymbol]);

  return (
    <div className="flex flex-col md:flex-row md:w-[90%] w-full mx-auto p-4 md:p-6 md:justify-between gap-4">
      <div className="flex flex-col gap-y-6 md:max-w-[60%] md:flex-1 w-full">
        <EventTitle title={stockSymbol} />
        <OrderBook data={orderbook} />
      </div>
      <div className="pt-7">
        <OrderBuy balance={balance} stockSymbol={stockSymbol} />
      </div>
    </div>
  );
};