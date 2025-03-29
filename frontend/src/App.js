import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeDashboard from "./components/HomeDashboard";
import InvestorPage from "./components/Investor";
import MissionsPage from "./components/MissionsPage";
import CalendarView from "./components/Calendar";
import QuotePage from "./components/QuotePage";

function App() {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/investors" element={<InvestorPage />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/quotes" element={<QuotePage />} />
      </Routes>
    </div>
  );
}

export default App;
