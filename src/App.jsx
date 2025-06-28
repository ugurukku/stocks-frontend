import { Routes, Route, useNavigate } from "react-router-dom";
import StocksPage from "./pages/StocksPage";
import MainPage from "./pages/MainPage";
import PurchasePage from "./pages/PurchasePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/stocks" element={<StocksPage />} />
      <Route path="/purchase/:symbol" element={<PurchasePage />} />
    </Routes>
  );
}
