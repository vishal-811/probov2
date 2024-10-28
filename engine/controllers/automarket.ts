import { publishMessage } from "../utils";

export async function handleAutoMarket(uid: string, data: any) {
  try {
    const { marketSymbol, marketType } = data;
    if (!marketSymbol || !marketType) {
      throw new Error("Please fill all the fields");
    }
    createAutoMarket(marketSymbol, marketType, uid);
  } catch (error: any) {
    publishMessage(`channel_${uid}`, { errro: error.message });
  }
}

function createAutoMarket(marketSymbol: any, marketType: any, uid: string) {
  switch (marketType) {
    case "crypto": {
      handleCryptoMarket(marketSymbol, uid);
      break;
    }
    default: {
      console.log("unknown market type");
    }
  }
}

async function handleCryptoMarket(marketSymbol: any, uid: string) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${marketSymbol}&vs_currencies=inr`;
  const data = await fetch(url);
  const price = await data.json();
  console.log("1234fghjkl");
  publishMessage(`channel_${uid}`, price);
}
