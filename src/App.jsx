import { Routes, Route, useNavigate } from "react-router-dom";
import BeveragesPage from "./pages/BeveragesPage";
import MainPage from "./pages/MainPage";
import PurchasePage from "./pages/PurchasePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/beverages" element={<BeveragesPage />} />
      <Route path="/:id/purchase" element={<PurchasePage />} />
    </Routes>
  );
}
