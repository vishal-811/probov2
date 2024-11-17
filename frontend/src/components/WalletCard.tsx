

export const WalletCard = ({CardIcon, CardText, balance, btnText, onClick} : any) => {
    
  return (
    <div className="border border-zinc-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex flex-col gap-y-4 justify-center items-center p-6 bg-gradient-to-b from-white to-zinc-50">
        <div className="bg-blue-50 p-2 rounded-sm">
          <CardIcon className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-center">
          <p className="text-zinc-500 text-sm font-medium mb-1">{CardText}</p>
          <p className="text-2xl font-bold text-zinc-800">₹ {balance}</p>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-zinc-100">
        <button onClick={onClick} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
          {btnText}
        </button>
      </div>
    </div>
  );
};

export default WalletCard;