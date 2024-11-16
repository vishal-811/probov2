import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AllMarkets = () => {
  const [orderbook, setOrderbook] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:3000/orderbook");
        setOrderbook(response.data.msg);
      } catch (error) {
        console.error("Error fetching orderbook data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Active Markets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(orderbook).map(([marketName], index) => (
          <ActiveMarketCard key={index} title={marketName} />
        ))}
      </div>
    </div>
  );
};

const ActiveMarketCard = ({ title }: any) => {
  const navigate = useNavigate();

  return (
    <div className="border border-zinc-200 rounded-lg p-5 bg-slate-50 flex flex-col space-y-4 shadow-sm hover:shadow-lg transition-transform transform hover:scale-105 duration-200 ease-in-out">
      <div className="flex items-center gap-x-4">
        <img
          width={48}
          height={48}
          src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fw_200%2Ch_200%2Fprobo_product_images%2FIMAGE_207fe0ff-6e8a-474a-a762-08ebbf2e36b8.png&w=96&q=75"
          alt="Market Icon"
          loading="lazy"
        />
        <h2 className="text-zinc-800 font-semibold text-lg line-clamp-2 break-words">
          {title}
        </h2>
      </div>
      <div className="flex justify-between items-center pt-3">
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-green-100 text-green-700">
          Active
        </span>
        <button
          onClick={() => {
            navigate(`/marketplace/${title}`);
          }}
          className="text-blue-600 font-medium hover:text-blue-800"
        >
          View Market
        </button>
      </div>
    </div>
  );
};
