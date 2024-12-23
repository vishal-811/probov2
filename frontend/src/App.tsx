import "./App.css";
import Navbar from "./components/navbar";
import { AllMarkets } from "./pages/Allmarkets"
import { MarketPlace } from "./pages/MarketPlace";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Recharge } from "./pages/Deposit";
import { UserWallet } from "./pages/UserWallet";
import LandingPage from "./pages/HomePage";

function App() {
  return (
    <div className="max-w-screen min-h-screen bg-[#F5F5F5]">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/marketplace/:stockSymbol" element={<MarketPlace />} />
          <Route path="/activemarket" element={<AllMarkets />}/>
          <Route path="/depositmoney" element={<Recharge/>}/>
          <Route path="/wallet" element={<UserWallet/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
