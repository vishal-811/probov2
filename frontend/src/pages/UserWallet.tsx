import { useEffect, useState } from "react";
import { WalletCard } from "../components/WalletCard";
import { useWalletBalance } from "../store/useWalletBalance";
import { Wallet, Lock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserWallet = () => {
  const walletBalance = useWalletBalance((state) => state.walletBalance);
  const [lockedBal, setLockedBal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    async function fetchLockedbal() {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:3000/balance/inr/${userId}`
        );
        const walBal = JSON.parse(res.data.msg);
        const bal = walBal.locked;
        setLockedBal(bal);
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsLoading(false);
        setAnimate(true);
      }
    }
    
    fetchLockedbal();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`
        max-w-7xl mx-auto 
        transition-all duration-500 ease-out
        transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        md:px-8 px-6 py-12
      `}>
        <div className="relative mb-12">
          <h1 className="text-lg md:text-xl font-semibold text-zinc-600 mb-2">
            Total balance
          </h1>
          <div className="flex items-baseline space-x-2">
            <span className="md:text-5xl text-3xl font-bold text-zinc-900 
                           transition-all duration-300 hover:text-zinc-800">
              ₹{isLoading ? (
                <span className="inline-block w-24 h-12 bg-gray-200 animate-pulse rounded"></span>
              ) : (
                <span className="animate-in">{walletBalance}</span>
              )}
            </span>
            <div className="flex items-center text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp size={14} className="mr-1" />
              <span>Active</span>
            </div>
          </div>
          
          <div className="absolute -bottom-4 left-0 w-20 h-1 bg-zinc-900 rounded-full 
                        transform origin-left transition-transform duration-300 hover:scale-x-110" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`
            transform transition-all duration-500 ease-out
            ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <WalletCard
              CardIcon={Wallet}
              CardText="Available Balance"
              balance={walletBalance}
              btnText="Recharge"
              onClick={() => navigate('/depositmoney')}
              className="hover:shadow-xl transition-shadow duration-300
                        transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
            />
          </div>

          <div className={`
            transform transition-all duration-500 ease-out delay-100
            ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            <WalletCard
              CardIcon={Lock}
              CardText="Locked Balance"
              balance={lockedBal}
              btnText="Exit"
              className="hover:shadow-xl transition-shadow duration-300
                        transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
            />
          </div>

          <div className={`
            transform transition-all duration-500 ease-out delay-200
            ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            md:col-span-1 
          `}>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl 
                          transition-all duration-300 transform hover:-translate-y-1
                          border border-gray-100">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-zinc-800">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">Total Transactions</span>
                    <span className="font-medium text-zinc-800">
                      {isLoading ? (
                        <span className="inline-block w-8 h-4 bg-gray-200 animate-pulse rounded"></span>
                      ) : '12'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">Last Deposit</span>
                    <span className="font-medium text-zinc-800">₹500</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <button 
                    // onClick={() => navigate('/history')}
                    className="w-full py-2 text-zinc-600 hover:text-zinc-800 
                             text-sm font-medium transition-colors duration-200"
                  >
                    View History →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};