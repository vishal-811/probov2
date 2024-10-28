
export interface UserBalance {
    balance: number;
    locked: number;
  }
  
  export interface INRBalances {
    [key: string]: UserBalance; 
  }

  interface Order {
    quantity: number;
    orderId: string;
    orderType: "original" | "pseudo";
}

interface Orders {
    [userId: string]: Order[];
}

interface PriceLevel {
    total: number;
    orders: Orders;
}

export interface OrderSide {
    [price: string]: PriceLevel;
}

export interface Orderbook {
    [symbol: string]: {
        yes: OrderSide;
        no: OrderSide;
    };
}
  
interface StockDetail {
    quantity: number;
    locked: number;
  }
  
  interface StockSide {
    yes?: StockDetail;
    no?: StockDetail;
  }
  
  export interface StockBalances {
    [userId: string]: {
      [symbol: string]: StockSide;
    };
  }

  export type StockType = 'yes' | 'no'

  export interface OrderRequest {
    userId: string;
    stockSymbol: string;
    quantity: number;
    price: number;
    stockType: StockType
  }


  export interface reverseCallType {
    stockSymbol : string,
    stockType : StockType,
    price :number | string,
    quantity? : number,
    requiredQuantity?:number,
    userId:string,
    ORDERBOOK : Orderbook
  }

  export interface OrderServiceType {
     userId : string,
     stockSymbol : string,
     stockType : StockType,
     price : number,
     quantity :number
  }

  export interface OrderCancelType {
    orderId : string,
    userId : string,
    stockSymbol : string,
    stockType :"yes" | "no"
    price : number
  }
