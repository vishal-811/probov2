import { useState, useEffect } from "react";
import logo from "../assets/logo.avif";
import { useNavigate } from "react-router-dom";
import CreateUserPage from "./CreateUser";
import axios from "axios";
import { useWalletBalance } from "../store/useWalletBalance";
import { useAuth } from "../store/useAuth";
import { Base_Api_Url } from "../lib";

const Navbar = () => {
  // const [userId, setUserId] = useState<string | null>(null);
  const [createUser, setCreateUser] = useState<boolean>(false);
  const isloggedin = useAuth((state) => state.isLoggedin);
  const setIsloggedin = useAuth((state) => state.setIsLoggedIn);
  const walletBalance = useWalletBalance((state) => state.walletBalance);
  const setWalletBalance = useWalletBalance((state) => state.setWalletBalance);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsloggedin(true);
      async function fetchBalance() {
        const res = await axios.get(`${Base_Api_Url}/balance/inr/${userId}`);
        const walBal = JSON.parse(res.data.msg);
        const bal = walBal.balance;
        setWalletBalance(bal);
      }

      fetchBalance();
    } else {
      setWalletBalance(0);
    }
  }, [walletBalance, isloggedin]);

  return (
    <div>
      <div className="bg-[#f5f5f5] border-b border-[#e3e3e3] flex justify-between items-center p-4 md:px-12 w-auto max-w-full">
        <a href="/" className="flex items-center space-x-2">
          <div className="text-xl font-bold text-blue-500 hover:scale-105 transition-transform duration-200">
            Opinio
            <span className="text-3xl text-blue-600 font-extrabold tracking-wide">
              X
            </span>
          </div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
        </a>

        <div className="flex items-center space-x-4">
          <span className="text-gray-600 text-sm hidden md:block relative group">
            <span className="absolute -left-1 top-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/2 animate-pulse" />
            <span className="pl-3">For 18 years and above only</span>
          </span>

          {/* Wallet Section */}
          <button
            onClick={() => navigate("/wallet")}
            className="flex items-center md:space-x-3 space-x-1 bg-white shadow-md rounded-lg md:px-3 md:py-2 px-3 py-1 border border-zinc-300 cursor-pointer"
          >
            <img
              alt="wallet"
              src="https://d39axbyagw7ipf.cloudfront.net/icons/wallet.svg"
              className="md:w-4 md:h-4 w-3 h-3 items-center"
            />
            <span className="text-sm sm:text-xs font-semibold text-gray-800 select-none ps-2 pe-2">
              ₹{walletBalance || 0}
            </span>
          </button>

          <div>
            {isloggedin ? (
              <button
                onClick={() => navigate("/activemarket")}
                className="bg-zinc-900 text-white px-6 py-2 rounded-lg hover:bg-zinc-800 transition text-nowrap"
              >
                Trade On
              </button>
            ) : (
              <button
                onClick={() => setCreateUser(true)}
                className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-nowrap"
              >
                Create ID
              </button>
            )}
          </div>
        </div>
      </div>

      {createUser && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <CreateUserPage
            onAuthaction={() => setIsloggedin(true)}
            onClose={() => setCreateUser(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
