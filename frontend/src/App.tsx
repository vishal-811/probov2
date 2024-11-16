import "./App.css";
import Navbar from "./components/navbar";
import { AllMarkets } from "./pages/Allmarkets"
import { MarketPlace } from "./pages/MarketPlace";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Recharge } from "./pages/Deposit";

function App() {
  return (
    <div className="max-w-screen min-h-screen bg-[#F5F5F5]">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/marketplace/:stockSymbol" element={<MarketPlace />} />
          <Route path="/activemarket" element={<AllMarkets />}/>
          <Route path="/depositmoney" element={<Recharge/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
