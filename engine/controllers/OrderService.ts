import { INR_BALANCES } from "../data/balance";
import { STOCK_BALANCES } from "../data/stockbalance";
import { ORDERBOOK } from "../data/orderbook";
import type {
  OrderServiceType,
  reverseCallType,
  OrderCancelType,
} from "../types";
import { client } from "..";
import { publishMessage } from "../utils";
import { v4 as uuidv4 } from "uuid";

// Order to sell
export function handleSell(uid: string, data: OrderServiceType) {
  try {
    const { userId, stockSymbol, quantity, price, stockType } = data;

    if (!userId || !stockSymbol || !quantity || !price || !stockType) {
      throw new Error("Please fill all the fields");
    }

    // Validate that the user exists with this ID
    const validateUser = INR_BALANCES[userId];
    if (!validateUser) {
      throw new Error("No user exists with this UserId");
    }
    // Validate stock type
    if (stockType !== "yes" && stockType !== "no") {
      throw new Error("Invalid stock type");
    }
    // Check if the user exists in the stock balances
    const userStocks = STOCK_BALANCES[userId];
    if (!userStocks || !userStocks[stockSymbol]) {
      throw new Error("User doesn't hold the stock or invalid stock symbol");
    }

    // Check if the user holds the given type of stock
    const stockDetails = userStocks[stockSymbol][stockType];
    if (!stockDetails) {
      throw new Error(
        `User doesn't hold any ${stockType} stocks of ${stockSymbol}`
      );
    }
    // Check if the user has enough stock to sell
    if (stockDetails.quantity < quantity) {
      throw new Error("Not enough stock to sell");
    }
    // Lock the quantity of stock being sold
    stockDetails.quantity -= quantity;
    stockDetails.locked = (stockDetails.locked || 0) + quantity;

    // Ensure the stock symbol and stock type exist in the ORDERBOOK
    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    if (!ORDERBOOK[stockSymbol][stockType]) {
      ORDERBOOK[stockSymbol][stockType] = {};
    }

    // Get the price level or create it if it doesn't exist
    if (!ORDERBOOK[stockSymbol][stockType][price]) {
      ORDERBOOK[stockSymbol][stockType][price] = { total: 0, orders: {} };
    }
    if (!ORDERBOOK[stockSymbol][stockType][price].orders[userId]) {
      const orderId = uuidv4();
      ORDERBOOK[stockSymbol][stockType][price].orders[userId] = [
        { quantity: quantity, orderId: orderId, orderType: "original" },
      ];
      ORDERBOOK[stockSymbol][stockType][price].total += quantity;
    } else {
      const orderId = uuidv4();
      ORDERBOOK[stockSymbol][stockType][price].orders[userId].push({
        quantity: quantity,
        orderId: orderId,
        orderType: "original",
      });
      ORDERBOOK[stockSymbol][stockType][price].total += quantity;
    }
    //Put the stock symbol and the  orderbook for that stock symbol in the pub/sub so that the ws server can get it
    //  and broadcast  to all the users.
    client.publish(
      "orderbook",
      JSON.stringify({
        stockSymbol: stockSymbol,
        orderbook: ORDERBOOK[stockSymbol],
      })
    );
    publishMessage(`channel_${uid}`, "Sell order placed and pending");
    return;
  } catch (error: any) {
    publishMessage(`channel_${uid}`, { error: error.message });
  }
}

// Odrer to buy
export function handleBuy(uid: string, data: OrderServiceType) {
  try {
    let { stockSymbol, stockType, userId, quantity, price } = data;
    console.log("The price inside the engine is", price);

    if (!stockSymbol || !stockType || !userId || !quantity || !price) {
      throw new Error("please provide all the fields");
    }

    if (price <= 0 || price >= 10) {
      throw new Error("Invalid price");
    }

    if (!INR_BALANCES[userId]) {
      throw new Error("No user Exist with this userId");
    }

    if (price * quantity > INR_BALANCES[userId].balance) {
      throw new Error("Insufficient Balance");
    }

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    
    if (!ORDERBOOK[stockSymbol][stockType][price]) {
      ORDERBOOK[stockSymbol][stockType][price] = { total: 0, orders: {} };
    }
     
    if (ORDERBOOK[stockSymbol][stockType][price].total == 0) {
      handlereverseCall({
        stockSymbol,
        stockType,
        price,
        quantity,
        userId,
        ORDERBOOK,
      });
      const amount = price * quantity;
      INR_BALANCES[userId].balance -= amount;
      client.publish(
        "orderbook",
        JSON.stringify({
          stockSymbol: stockSymbol,
          orderbook: ORDERBOOK[stockSymbol],
        })
      );
      publishMessage(`channel_${uid}`, "partial order placed 1");
      return;
    }

    let requiredQuantity = quantity;
    if (ORDERBOOK[stockSymbol][stockType][price].total != 0) {
      for (let [sellerId, orders] of Object.entries(
        ORDERBOOK[stockSymbol][stockType][price].orders
      )) {
        if (
          requiredQuantity <= 0 ||
          ORDERBOOK[stockSymbol][stockType][price].total == 0
        )
          break;
        orders.map((order) => {
          const availableQuantity = Math.min(order.quantity, requiredQuantity);
          if (order.orderType === "original") {
            order.quantity -= availableQuantity;
            requiredQuantity -= availableQuantity;
            ORDERBOOK[stockSymbol][stockType][price].total -= availableQuantity;
            const amount = price * availableQuantity;
            INR_BALANCES[sellerId].balance += amount;
            INR_BALANCES[userId].balance -= amount;

            if (STOCK_BALANCES[sellerId][stockSymbol][stockType]) {
              STOCK_BALANCES[sellerId][stockSymbol][stockType].locked -=
                availableQuantity;
            }
          } else {
            requiredQuantity -= order.quantity;
            const stockReverseType = stockType === "yes" ? "no" : "yes";
            const amount = quantity * price;

            INR_BALANCES[sellerId].locked -= amount;
            if (STOCK_BALANCES[sellerId][stockSymbol][stockReverseType]) {
                STOCK_BALANCES[sellerId][stockSymbol][
                stockReverseType
              ].quantity += quantity;
            }
          }
        });

        const filteredOrders = orders.filter((order) => order.quantity !== 0);
        ORDERBOOK[stockSymbol][stockType][price].orders[sellerId] =
          filteredOrders;
      }
      if (requiredQuantity > 0) {
        const FullFilledQunatity = quantity - requiredQuantity;
        const amount = FullFilledQunatity * price;
        INR_BALANCES[userId].balance -= amount;

        if (STOCK_BALANCES[userId][stockSymbol][stockType]) {
          STOCK_BALANCES[userId][stockSymbol][stockType].quantity +=
            FullFilledQunatity;
        }

        handlereverseCall({
          stockSymbol,
          stockType,
          userId,
          requiredQuantity,
          price,
          ORDERBOOK,
        });
        client.publish(
          "orderbook",
          JSON.stringify({
            stockSymbol: stockSymbol,
            orderbook: ORDERBOOK[stockSymbol],
          })
        );
        publishMessage(`channel_${uid}`, "Partial Order Placed");
        return;
      } else {
        const amount = quantity * price;
        INR_BALANCES[userId].balance -= amount;
        if (!STOCK_BALANCES[userId]) {
          STOCK_BALANCES[userId] = { [stockSymbol]: {} };
        }

        if (!STOCK_BALANCES[userId][stockSymbol]) {
          STOCK_BALANCES[userId][stockSymbol] = {
            yes: { quantity: 0, locked: 0 },
            no: { quantity: 0, locked: 0 },
          };
        }
        if (STOCK_BALANCES[userId][stockSymbol][stockType]) {
          STOCK_BALANCES[userId][stockSymbol][stockType].quantity += quantity;
        }
        client.publish(
          "orderbook",
          JSON.stringify({
            stockSymbol: stockSymbol,
            orderbook: ORDERBOOK[stockSymbol],
          })
        );
        publishMessage(`channel_${uid}`, "order fulfilled");
      }
    }
  } catch (error: any) {
    publishMessage(`channel_${uid}`, { error: error.message });
  }
}

// Function to  make a reverse call
function handlereverseCall({
  stockSymbol,
  stockType,
  price,
  quantity,
  userId,
  requiredQuantity,
  ORDERBOOK,
}: reverseCallType) {
  const newStocks = quantity ? quantity : requiredQuantity;
  if (typeof price === "string") {
    price = parseInt(price);
  }
  const correspondingPrice = 10 - price;
  const reverseStockType = stockType === "yes" ? "no" : "yes";
  if (!ORDERBOOK[stockSymbol]) {
    ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
  }

  if (!ORDERBOOK[stockSymbol][reverseStockType]) {
    ORDERBOOK[stockSymbol][reverseStockType] = {};
  }

  if (!ORDERBOOK[stockSymbol][reverseStockType][correspondingPrice]) {
    ORDERBOOK[stockSymbol][reverseStockType][correspondingPrice] = {
      total: 0,
      orders: {},
    };
  }
  // Add the new reverse order (lock the user's funds for the unfulfilled quantity
  if (newStocks) {
    // Increase total available stock at this price
    ORDERBOOK[stockSymbol][reverseStockType][correspondingPrice].total +=
      newStocks;
  }

  if (
    !ORDERBOOK[stockSymbol][reverseStockType][correspondingPrice].orders[
      userId
    ] &&
    newStocks
  ) {
    const orderId = uuidv4();
    ORDERBOOK[stockSymbol][reverseStockType][correspondingPrice].orders[
      userId
    ] = [{ quantity: newStocks, orderId: orderId, orderType: "pseudo" }];
  }
  //Lock the user balance for pending reverse stocks.
  if (newStocks) {
    if (typeof price == "string") {
      price = parseInt(price);
    }
    const totalAmount = newStocks * price;
    INR_BALANCES[userId].locked += totalAmount;
  }
  return ORDERBOOK[stockSymbol][reverseStockType][correspondingPrice];
}

export function handleCancel(uid: string, data: OrderCancelType) {
  try {
    const { userId, orderId, stockSymbol, stockType, price } = data;
    if (!userId || !orderId || !stockSymbol || !stockType || !price) {
      throw new Error("Please provide all the  fields");
    }
    const validateUser = INR_BALANCES[userId];
    if (!validateUser) {
      throw new Error("Invalid UserId");
    }
    if (!ORDERBOOK[stockSymbol]) {
      throw new Error("No stock exist with this  symbol");
    }
    const user = ORDERBOOK[stockSymbol][stockType][price].orders[userId];
    if (!user) {
      throw new Error("Wrong userId, cancel failed");
    }
    //  Iterate over all the orders of the user and find its userId.
    let flag = false;
    user.map((order) => {
      if (order.orderId === orderId) {
        const stockQuantity = order.quantity;
        if (STOCK_BALANCES[userId][stockSymbol][stockType]) {
          STOCK_BALANCES[userId][stockSymbol][stockType].locked -=
            stockQuantity;
          STOCK_BALANCES[userId][stockSymbol][stockType].quantity +=
            stockQuantity;
        }
        flag =true;
        order.quantity = 0;
        ORDERBOOK[stockSymbol][stockType][price].total -= stockQuantity;
      }
    });
     if(flag){
      const filteredOrders = user.filter((order) => order.quantity !== 0);
      ORDERBOOK[stockSymbol][stockType][price].orders[userId] = filteredOrders;
      publishMessage(`channel_${uid}`, "Order canceled successfully");
      return;
     }
     publishMessage(`channel_${uid}`, "Wrong OrderId, cancellation failed");
  } catch (error: any) {
    console.log("Error is ", { error: error.message });
    publishMessage(`channel_${uid}`, {error : error.message});
  }
}
