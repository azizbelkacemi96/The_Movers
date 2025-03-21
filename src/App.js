import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeDashboard from "./components/HomeDashboard";
import Finance from "./components/Finance";
import MissionsPage from "./components/MissionsPage";
import CalendarView from "./components/Calendar";


console.log("MissionsPage:", MissionsPage);
function App() {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </div>
  );
}

export default App;
