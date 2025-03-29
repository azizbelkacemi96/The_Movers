import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const linkStyle = (path) =>
    `flex items-center gap-1 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition ${
      location.pathname === path ? "bg-blue-600 text-white" : "text-gray-800"
    }`;

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="The Movers" className="h-10 w-auto rounded" />
          <h1 className="text-xl font-bold text-blue-600">The Movers</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-4">
          <Link to="/" className={linkStyle("/")}>📊 Dashboard</Link>
          <Link to="/missions" className={linkStyle("/missions")}>🚚 Missions</Link>
          <Link to="/quotes" className={linkStyle("/quotes")}>🧾 Quotes</Link>
          <Link to="/investors" className={linkStyle("/investors")}>💰 Account</Link>
          <Link to="/calendar" className={linkStyle("/calendar")}>📅 Calendar</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
