import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TrendingUp, Search, ArrowRight, Filter, BarChart2 } from "lucide-react";
import { Base_Api_Url } from "../lib";

export const AllMarkets = () => {
  const [orderbook, setOrderbook] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${Base_Api_Url}/orderbook`);
        setOrderbook(response.data.msg);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orderbook data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMarkets = Object.entries(orderbook).filter(([marketName]) =>
    marketName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
              Explore Markets
            </div>
            <h1 className="text-4xl font-bold text-zinc-800 mb-4">
              Discover Active Trading Markets
            </h1>
            <p className="text-zinc-600 text-lg mb-8">
              Explore various markets and trade your opinions with confidence. 
              Choose from our wide selection of active trading opportunities.
            </p>
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            icon={<BarChart2 className="w-6 h-6 text-blue-600" />}
            title="Total Markets"
            value={Object.keys(orderbook).length}
            subtitle="Active trading markets"
          />
          <StatsCard
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            title="24h Volume"
            value="₹1.2M"
            subtitle="Trading volume"
          />
          <StatsCard
            icon={<Filter className="w-6 h-6 text-purple-600" />}
            title="Market Types"
            value="12+"
            subtitle="Different categories"
          />
        </div>


        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMarkets.map(([marketName], index) => (
              <ActiveMarketCard key={index} title={marketName} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ icon, title, value, subtitle } : any) => (
  <div className="bg-white rounded-xl p-6 border border-zinc-200 flex items-center space-x-4">
    <div className="bg-zinc-50 p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-zinc-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-zinc-800">{value}</p>
      <p className="text-zinc-500 text-sm">{subtitle}</p>
    </div>
  </div>
);

const ActiveMarketCard = ({ title } : any) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-6 select-none">
        <div className="flex items-center gap-x-4 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg">
            <img
              width={48}
              height={48}
              src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fw_200%2Ch_200%2Fprobo_product_images%2FIMAGE_207fe0ff-6e8a-474a-a762-08ebbf2e36b8.png&w=96&q=75"
              alt="Market Icon"
              className="rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-zinc-800 font-semibold text-lg line-clamp-2 break-words">
              {title}
            </h2>
            <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 mt-1">
              Active Market
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-zinc-100 text-wrap">
          <div className="space-y-1">
            <p className="text-sm text-zinc-500">Current Volume</p>
            <p className="text-lg font-semibold text-zinc-800">₹24.5K</p>
          </div>
          <button
            onClick={() => navigate(`/marketplace/${title}`)}
            className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all duration-300"
          >
            Trade Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllMarkets;