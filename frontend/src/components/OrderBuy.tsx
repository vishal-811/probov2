import { useState } from "react";
import { Plus, Minus, AlertCircle, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useWalletBalance } from "../store/useWalletBalance";
import { Base_Api_Url } from "../lib";

const ControlButton = ({ onClick, icon, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      md:w-8 md:h-8 w-4 h-4 flex items-center justify-center
      rounded-full transition-all duration-200 p-1 md:p-0
      ${
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-100 hover:bg-blue-500 hover:text-white active:scale-95"
      }
      focus:outline-none focus:ring-2 focus:ring-blue-300
    `}
  >
    {icon}
  </button>
);

export const OrderBuy = ({ stockSymbol }: any) => {
  const [price, setPrice] = useState(0.5);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("yes"); // State for the selected option
  const walletBalance = useWalletBalance((state) => state.walletBalance)
  const setWalletBalance = useWalletBalance((state)=> state.setWalletBalance)
  const navigate = useNavigate();

  const incrementPrice = () => setPrice((prev) => Math.min(prev + 0.5, 9.5));
  const decrementPrice = () => setPrice((prev) => Math.max(prev - 0.5, 0.5));
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  async function handleOrder() {
    try {
      const amountRequired = quantity * price;
      if(walletBalance < amountRequired) return;
      const res = await axios.post(`${Base_Api_Url}/order/buy`, {
        userId: localStorage.getItem("userId"),
        stockSymbol: stockSymbol,
        stockType: selectedOption, 
        price:price,
        quantity: quantity,
      });
      console.log("The response after buying is", res.status);
      if(res.status === 200){
        setWalletBalance(walletBalance - amountRequired);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  }

  return (
    <div className="border border-zinc-200 rounded-2xl md:p-6 p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
      <CustomToggleButton
        price={price}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption} // Pass selectedOption and setSelectedOption
      />
      <div className="mt-6 flex flex-col justify-between bg-gray-50 p-6 rounded-xl gap-y-4">
        {/* Price Control */}
        <div className="flex justify-between items-center group">
          <p className="text-sm md:text-lg font-semibold text-zinc-900">Price</p>
          <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-lg shadow-sm">
            <ControlButton
              onClick={decrementPrice}
              icon={<Minus size={16} />}
              disabled={price <= 0.5}
            />
            <span className="w-16 text-center text-lg font-semibold text-zinc-900">
              ₹{price.toFixed(2)}
            </span>
            <ControlButton
              onClick={incrementPrice}
              icon={<Plus size={16} />}
              disabled={price >= 9.5}
            />
          </div>
        </div>

        {/* Quantity Control */}
        <div className="flex justify-between items-center group">
          <p className="text-sm md:text-lg font-semibold text-zinc-900">Quantity</p>
          <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-lg shadow-sm">
            <ControlButton
              onClick={decrementQuantity}
              icon={<Minus size={16}/>}
              disabled={quantity <= 1}
            />
            <span className="w-16 text-center text-lg font-semibold text-zinc-900">
              {quantity}
            </span>
            <ControlButton
              onClick={incrementQuantity}
              icon={<Plus size={16} />}
            />
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="md:text-lg text-sm font-medium text-zinc-900">Total</span>
            <span className="text-xl font-bold text-blue-600">
              ₹{(price * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Insufficient Balance and Recharge Button */}
      <div className="flex flex-col md:gap-y-0 gap-y-4 md:flex-row justify-between items-center mt-6 pb-6 md:space-x-4 space-x-0">
        <button
          onClick={() => navigate("/depositmoney")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium md:px-6 md:py-2 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <Wallet size={18} />
          <span>Recharge</span>
        </button>
        {!walletBalance && (
          <div className="flex items-center space-x-2 bg-red-50 md:px-4 md:py-2 px-2 py-1 rounded-lg text-wrap">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-sm text-red-600 font-medium">
              Insufficient balance
            </span>
          </div>
        )}
      </div>

      {/* Place Order Button */}
      <button
        onClick={() => handleOrder()}
        className="bg-zinc-900 hover:bg-zinc-800 text-white w-full py-3 rounded-lg font-medium transition-colors duration-200 transform hover:scale-[1.02]"
      >
        Place Order
      </button>
    </div>
  );
};

const CustomToggleButton = ({
  price,
  selectedOption,
  setSelectedOption,
}: {
  price: number;
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="relative md:bg-gray-50 bg-gray-100 md:p-1 p-0 md:rounded-3xl rounded-2xl flex justify-between shadow-sm w-full text-nowrap">
      <button
        className={`flex-1 px-4 py-1 md:px-12 md:py-2 rounded-3xl font-medium ${
          selectedOption === "yes"
            ? "bg-blue-500 text-white shadow-lg"
            : "bg-transparent text-zinc-700 hover:bg-gray-100"
        }`}
        onClick={() => handleOptionClick("yes")}
      >
        Yes ₹{selectedOption === "yes" ? price : 10 - price}
      </button>
      <button
        className={`flex-1 px-4 py-1 md:px-12 md:py-2 rounded-3xl font-semibold md:font-medium ${
          selectedOption === "no"
            ? "bg-red-500 text-white shadow-lg"
            : "bg-transparent text-zinc-700 hover:bg-gray-100"
        }`}
        onClick={() => handleOptionClick("no")}
      >
        No ₹{selectedOption === "no" ? price : 10 - price}
      </button>
    </div>
  );
};
