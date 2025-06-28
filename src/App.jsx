import { Routes, Route, useNavigate } from "react-router-dom";
import StocksPage from "./pages/StocksPage";
import MainPage from "./pages/MainPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/stocks" element={<StocksPage />} />
    </Routes>
  );
}
