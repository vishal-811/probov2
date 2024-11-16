import axios from "axios";
import { useState } from "react";
import { useWalletBalance } from "../store/useWalletBalance";

export const Recharge = () => {
  const [amount, setAmount] = useState<number | null>(null);
  const walletBalance = useWalletBalance((state)=> state.walletBalance);
  const setWalletBalance = useWalletBalance((state)=>state.setWalletBalance);

  const handleAmountChange = (e: any) => {
    setAmount(parseInt(e.target.value));
  };

  const handleSuggestedAmount = (suggestedAmount: any) => {
      amount === 0
      ? setAmount(suggestedAmount)
      : setAmount(amount + suggestedAmount);
  };

  const handleDeposit = async (e: any) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (amount) {
      const res = await axios.post("http://localhost:3000/onramp/inr", {
        userId: userId,
        amount: amount,
      });
      if(res.status === 200){
        const newbal = (Number(walletBalance) + Number(amount));
         setWalletBalance(newbal);
      }
    }
  };

  return (
    <div className="bg-[#f5f5f5]">
      <div className="flex flex-col md:px-12 p-4 md:space-y-5 space-y-4">
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800">
          Deposit
        </h2>
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full md:max-w-[45%] md:min-h-[45%] md:space-y-6  space-y-2">
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-gray-900 text-lg font-semibold mb-2">
                Deposit amount
              </label>
              <input
                type="number"
                //@ts-ignore
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                min="1"
              />
            </div>

            <div className="flex space-x-4 mt-12">
              {[250, 500, 1000].map((suggestedAmount) => (
                <button
                  key={suggestedAmount}
                  type="button"
                  onClick={() => handleSuggestedAmount(suggestedAmount)}
                  className="px-4 py-2 text-zinc-700 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition items-center justify-center"
                >
                  +{suggestedAmount}
                </button>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                disabled={amount == null || amount <= 0}
                className={`w-full py-2 rounded-lg font-medium text-white ${
                  amount != null && amount > 0
                    ? "bg-zinc-800 hover:bg-zinc-700"
                    : "bg-gray-400 cursor-not-allowed"
                } transition`}
              >
                Recharge
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
