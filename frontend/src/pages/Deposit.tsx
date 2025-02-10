import axios from "axios";
import { useState } from "react";
import { useWalletBalance } from "../store/useWalletBalance";
import { useNavigate } from "react-router-dom";
import { Base_Api_Url } from "../lib";

export const Recharge = () => {
  const [amount, setAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const walletBalance = useWalletBalance((state) => state.walletBalance);
  const setWalletBalance = useWalletBalance((state) => state.setWalletBalance);
  const navigate = useNavigate();

  const handleAmountChange = (e: any) => {
    setAmount(parseInt(e.target.value));
  };

  const handleSuggestedAmount = (suggestedAmount: number) => {
    amount === 0
      ? setAmount(suggestedAmount)
      : setAmount((prevAmount) => (prevAmount || 0) + suggestedAmount);
  };

  const handleDeposit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = localStorage.getItem("userId");

    try {
      if (amount) {
        const res = await axios.post(`${Base_Api_Url}/onramp/inr`, {
          userId: userId,
          amount: amount,
        });

        if (res.status === 200) {
          const newbal = Number(walletBalance) + Number(amount);
          setWalletBalance(newbal);
          navigate("/activemarket");
        }
      }
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:px-12 p-4 md:space-y-8 space-y-6">
          <h2 className="text-3xl md:text-5xl font-semibold text-gray-800 relative select-none">
            Deposit
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-zinc-800 rounded-full" />
          </h2>

          <div
            className="bg-white p-6 md:p-10 rounded-2xl shadow-xl 
                        w-full md:max-w-[45%] transition-all duration-300
                        hover:shadow-2xl border border-gray-100"
          >
            <form onSubmit={handleDeposit} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-gray-900 text-lg font-semibold">
                  Deposit amount
                </label>
                <div
                  className={`relative transition-all duration-200
                              ${
                                inputFocused ? "transform -translate-y-1" : ""
                              }`}
                >
                  <input
                    type="number"
                    value={amount || ""}
                    onChange={handleAmountChange}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="0"
                    className="w-full px-6 py-3 text-lg
                             border border-gray-300 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-zinc-800/20
                             focus:border-zinc-800 transition-all duration-200"
                    required
                    min="1"
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 
                                 text-gray-400 text-lg font-medium"
                  >
                    ₹
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {[250, 500, 1000].map((suggestedAmount) => (
                  <button
                    key={suggestedAmount}
                    type="button"
                    onClick={() => handleSuggestedAmount(suggestedAmount)}
                    className="px-6 py-3 text-zinc-700 rounded-xl
                             border border-zinc-200 hover:bg-zinc-50
                             active:bg-zinc-100 transition-all duration-200
                             transform hover:-translate-y-0.5 hover:shadow-md
                             focus:outline-none focus:ring-2 focus:ring-zinc-800/20"
                  >
                    +{suggestedAmount}
                  </button>
                ))}
              </div>

              <div className="relative mt-8">
                <button
                  type="submit"
                  disabled={amount == null || amount <= 0 || isLoading}
                  className={`
                    w-full py-3 px-6 rounded-xl font-medium text-lg
                    transform transition-all duration-200
                    ${
                      amount != null && amount > 0 && !isLoading
                        ? "bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] hover:-translate-y-0.5"
                        : "bg-gray-400 cursor-not-allowed"
                    }
                    text-white shadow-lg hover:shadow-xl
                    disabled:hover:transform-none
                  `}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Recharge"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
