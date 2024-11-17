import { INR_BALANCES } from "../data/balance";
import { STOCK_BALANCES } from "../data/stockbalance";
import { publishMessage } from "../utils";

// Get the Specific user balance
export function handlegetUserBalance(uid: string, data: string) {
  try {
    const userId = data;
    const userBalance = INR_BALANCES[userId];
    if (!userBalance) {
      throw new Error("No user exist with this userId");
    }

    publishMessage(`channel_${uid}`, `${JSON.stringify(userBalance)}`);
    return;
  } catch (error: any) {
    publishMessage(`channel_${uid}`, { error: error.message });
  }
}

// Get the specific user Stock Symbol
export function handlegetUserStockBalance(uid: string, data: string) {
  try {
    const userId = data;
    const stockBalances = STOCK_BALANCES[userId];
    if (!stockBalances) {
      throw new Error("No stock exist");
    }
    publishMessage(
      `channel_${uid}`,
      `your stock  Balance is  ${JSON.stringify(stockBalances)}`
    );
    return;
  } catch (error: any) {
    publishMessage(`channel_${uid}`, {
      error: error.message,
      status: "Error in fetching the user stock balance",
    });
  }
}
