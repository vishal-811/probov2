import { STOCK_BALANCES } from "../data/stockbalance";
import { publishMessage } from "../utils";

export function handleSymbolCreate(uid: string, data: string) {
  try {
    const stockSymbol = data;
    if (!stockSymbol) {
      throw new Error("Please Provide a StockSymbol");
    }
    Object.keys(STOCK_BALANCES).forEach((userId) => {
      if (!STOCK_BALANCES[userId][stockSymbol]) {
        STOCK_BALANCES[userId][stockSymbol] = {}; // with default empty values.
      }
    });
    publishMessage(`channel_${uid}`, `Symbol ${stockSymbol} created`);
    return;
  } catch (error: any) {
    publishMessage(`channel_${uid}`, { error: error.message });
  }
}
