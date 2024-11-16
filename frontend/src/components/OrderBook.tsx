interface OrderDetails {
  total: number;
  orders: Record<string, any>;
}

export const OrderBook = ({ data }: any) => {
  const sortOrders = (orders: Array<{ price: string; quantity: number }>) => {
    const zeroQuantityOrders = orders.filter(order => order.quantity === 0);
    const nonZeroQuantityOrders = orders.filter(order => order.quantity > 0);
    const sortedZeroQuantityOrders = zeroQuantityOrders.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );
    
    const sortedNonZeroQuantityOrders = nonZeroQuantityOrders.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );
    return [...sortedNonZeroQuantityOrders, ...sortedZeroQuantityOrders].slice(0, 5);
  };

  const yesOrders = sortOrders(
    Object.entries(data.yes || {}).map(([price, details]) => ({
      price,
      quantity: (details as OrderDetails).total,
    }))
  );

  const noOrders = sortOrders(
    Object.entries(data.no || {}).map(([price, details]) => ({
      price,
      quantity: (details as OrderDetails).total,
    }))
  );

  return (
    <div className="border border-zinc-400 rounded-lg p-4 w-full">
      <p className="text-zinc-950 font-semibold text-md">Order Book</p>
      <div className="flex flex-row justify-between w-full space-x-8 pt-3">
        {/* YES Orders */}
        <div className="flex flex-col w-[50%]">
          <div className="flex justify-between w-full">
            <h2 className="text-zinc-950 text-sm font-semibold">PRICE</h2>
            <div className="flex space-x-2 items-center">
              <p className="text-sm text-zinc-700">QTY AT</p>
              <span className="text-sm text-blue-500">YES</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2 pt-2">
            {yesOrders.map(({ price, quantity }) => (
              <OrderRow
                key={`yes-${price}`}
                price={price}
                quantity={quantity}
              />
            ))}
          </div>
        </div>

        {/* NO Orders */}
        <div className="flex flex-col w-[50%]">
          <div className="flex justify-between w-full">
            <h2 className="text-zinc-950 text-sm font-semibold">PRICE</h2>
            <div className="flex space-x-2 items-center">
              <p className="text-sm text-zinc-700">QTY AT</p>
              <span className="text-sm text-red-500">NO</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2 pt-2">
            {noOrders.map(({ price, quantity }) => (
              <OrderRow 
                key={`no-${price}`} 
                price={price} 
                quantity={quantity} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderRow = ({ price, quantity }: { price: string; quantity: number }) => {
  return (
    <div className="flex border-t border-zinc-300 justify-between p-1">
      <p className="text-sm font-semibold text-zinc-800">{price}</p>
      <p className="text-sm font-semibold text-zinc-800">{quantity}</p>
    </div>
  );
};